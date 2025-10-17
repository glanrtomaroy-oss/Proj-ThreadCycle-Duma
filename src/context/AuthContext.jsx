import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../util/supabase";
// Auth context provides current session, role, and auth helpers (sign in/out/up)

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  // Sign up user with Supabase auth, then create a CUSTOMER record
  const signUpNewUser = async (username, email, password) => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return { success: false, error: signUpError };
    }

    if (signUpData.session) {
      setSession(signUpData.session);
    }

    // Insert into CUSTOMER table
    const { error: insertUserError } = await supabase.from("CUSTOMER").insert({
      Username: username,
      Email: email,
      Customer_uid: signUpData.user.id,
    });

    if (insertUserError) {
      return { success: false, error: insertUserError };
    }

    setUserRole("customer");
    setLoading(false);
    return { success: true, data: signUpData, userRole: "customer" };
  };

  // Determine whether a user is a customer or admin by probing tables
  const fetchUserRole = async (userId) => {
  if (!userId) return null;

  try {
    // ✅ First, check CUSTOMER table
    const { data: customer, error: customerError } = await supabase
      .from("CUSTOMER")
      .select("Username, Customer_uid")
      .eq("Customer_uid", userId)
      .maybeSingle();

    if (customerError) {
      console.error("Error fetching CUSTOMER role:", customerError);
    }

    if (customer) {
      console.log("✅ Found CUSTOMER:", customer);
      setUserRole("customer");
      setUsername(customer.Username || "User");
      return "customer";
    }

    // ✅ Then, check ADMIN table
    const { data: admin, error: adminError } = await supabase
      .from("ADMIN")
      .select("Username, Admin_uid")
      .eq("Admin_uid", userId)
      .maybeSingle();

    if (adminError) {
      console.error("Error fetching ADMIN role:", adminError);
    }

    if (admin) {
      console.log("✅ Found ADMIN:", admin);
      setUserRole("admin");
      setUsername(admin.Username || "Admin");
      return "admin";
    }

    console.log("⚠️ No matching role found for this user ID:", userId);
    setUserRole(null);
    setUsername("");
    return null;
  } catch (err) {
    console.error("Unexpected error in fetchUserRole:", err);
    setUserRole(null);
    setUsername("");
    return null;
  }
};

  // Sign in and resolve role, returns both success and role for routing
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        return { success: false, error: error.message };
      }
  
      if (data.user) {
        // Wait for the role to be fetched
        const role = await fetchUserRole(data.user.id);
  
        if (!role) {
          return { success: false, error: "No role found for this user" };
        }

        setUserRole(role);
        return { success: true, data, role };
      }
  
      return { success: false, error: "No user found" };
    } catch (error) {
      return { success: false, error: "Unexpected error" };
    }
  };

  // Sign out and clear local state and also remove cached Supabase token
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      setUserRole(null);
      setSession(null);

      if (error) {
        console.error("Supabase sign-out error:", error.message);
      }

      // Fallback clear
      try {
        const tokenKey =
          "sb-" + supabase.supabaseUrl.split("//")[1].split(".")[0] + "-auth-token";
        localStorage.removeItem(tokenKey);
      } catch (localStorageError) {
        console.warn("Error clearing localStorage token:", localStorageError);
      }

      console.log("User signed out successfully.");
    } catch (unexpectedError) {
      setUserRole(null);
      setSession(null);
      console.error("Unexpected sign-out error:", unexpectedError);
    }
  };


  // Get current session and subscribe to auth state changes
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setLoading(false);

        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }
      }
    );

    return () => listener?.subscription?.unsubscribe();
  }, []);

  // Expose auth state and helpers to the app
  return (
    <AuthContext.Provider
      value={{
        session,
        signInUser,
        signUpNewUser,
        signOut,
        userRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    return {
      session: null,
      userRole: null,
      loading: true,
      signInUser: () =>
        Promise.resolve({ success: false, error: "Context not available." }),
      signUpNewUser: () =>
        Promise.resolve({ success: false, error: "Context not available." }),
      signOut: () => Promise.resolve(),
    };
  }

  return context;
};

export default AuthContext;
