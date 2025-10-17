import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../util/supabase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState(""); // 👈 added username state

  // 🔹 Sign up new user and insert into CUSTOMER table
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

    const { error: insertUserError } = await supabase.from("CUSTOMER").insert({
      Username: username,
      Email: email,
      Customer_uid: signUpData.user.id,
    });

    if (insertUserError) {
      return { success: false, error: insertUserError };
    }

    setUserRole("customer");
    setUsername(username);
    setLoading(false);
    return { success: true, data: signUpData, userRole: "customer" };
  };

  // 🔹 Fetch user role (and username) by checking CUSTOMER or ADMIN table
  const fetchUserRole = async (userId) => {
    if (!userId) return null;

    console.log("🔍 Fetching role for user:", userId);

    // Check CUSTOMER table
    const { data: customer, error: customerError } = await supabase
      .from("CUSTOMER")
      .select("CustID, Username, Customer_uid")
      .eq("Customer_uid", userId)
      .maybeSingle();

    if (customerError) console.error("❌ CUSTOMER fetch error:", customerError);

    if (customer) {
      console.log("✅ Found CUSTOMER:", customer);
      setUserRole("customer");
      setUsername(customer.Username || "User");
      return "customer";
    }

    // Check ADMIN table
    const { data: admin, error: adminError } = await supabase
      .from("ADMIN")
      .select("AdminID, Username, Admin_uid")
      .eq("Admin_uid", userId)
      .maybeSingle();

    if (adminError) console.error("❌ ADMIN fetch error:", adminError);

    if (admin) {
      console.log("✅ Found ADMIN:", admin);
      setUserRole("admin");
      setUsername(admin.Username || "Admin");
      return "admin";
    }

    console.log("⚠️ No role found for this user.");
    setUserRole(null);
    setUsername("");
    return null;
  };

  // 🔹 Sign in user and resolve their role + username
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

  // 🔹 Sign out user and clear state
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      setUserRole(null);
      setSession(null);
      setUsername("");

      if (error) {
        console.error("Supabase sign-out error:", error.message);
      }

      try {
        const tokenKey =
          "sb-" + supabase.supabaseUrl.split("//")[1].split(".")[0] + "-auth-token";
        localStorage.removeItem(tokenKey);
      } catch (localStorageError) {
        console.warn("Error clearing localStorage token:", localStorageError);
      }

      console.log("✅ User signed out successfully.");
    } catch (unexpectedError) {
      setUserRole(null);
      setSession(null);
      setUsername("");
      console.error("Unexpected sign-out error:", unexpectedError);
    }
  };

  // 🔹 Initialize session and listen for auth changes
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
          setUsername("");
        }
      } catch (error) {
        console.error("Session init error:", error);
        setLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
          setUsername("");
        }
      }
    );

    return () => listener?.subscription?.unsubscribe();
  }, []);

  // 🔹 Provide everything to app
  return (
    <AuthContext.Provider
      value={{
        session,
        signInUser,
        signUpNewUser,
        signOut,
        userRole,
        username,
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
      username: "",
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
