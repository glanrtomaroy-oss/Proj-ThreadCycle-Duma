import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../util/supabase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState(""); // 🟢 Store username

  // 🟢 Fetch role and username
  const fetchUserRole = async (userId) => {
    if (!userId) return null;

    // Check CUSTOMER table
    const { data: customer } = await supabase
      .from("CUSTOMER")
      .select("CustID, Username")
      .eq("Customer_uid", userId)
      .maybeSingle();

    if (customer) {
      setUserRole("customer");
      setUsername(customer.Username || "User");
      return "customer";
    }

    // Check ADMIN table
    const { data: admin } = await supabase
      .from("ADMIN")
      .select("AdminID")
      .eq("Admin_uid", userId)
      .maybeSingle();

    if (admin) {
      setUserRole("admin");
      setUsername("Admin");
      return "admin";
    }

    setUserRole(null);
    setUsername("");
    return null;
  };

  // Sign up user with Supabase auth, then create CUSTOMER record
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
    setUsername(username);
    setLoading(false);
    return { success: true, data: signUpData, userRole: "customer" };
  };

  // Sign in and resolve role
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
        if (!role) return { success: false, error: "No role found for this user" };

        setUserRole(role);
        return { success: true, data, role };
      }

      return { success: false, error: "No user found" };
    } catch (error) {
      return { success: false, error: "Unexpected error" };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      setUserRole(null);
      setSession(null);
      setUsername("");

      if (error) {
        console.error("Supabase sign-out error:", error.message);
      }

      const tokenKey =
        "sb-" + supabase.supabaseUrl.split("//")[1].split(".")[0] + "-auth-token";
      localStorage.removeItem(tokenKey);
    } catch (err) {
      console.error("Unexpected sign-out error:", err);
    }
  };

  // 🟢 Subscribe to username changes (real-time updates)
  const subscribeToUserUpdates = (userId) => {
    if (!userId) return;

    const channel = supabase
      .channel("customer-updates")
      .on(
        "postgres_changes",
        {
          event: "*", // listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "CUSTOMER",
          filter: `Customer_uid=eq.${userId}`,
        },
        (payload) => {
          console.log("🔁 CUSTOMER table change:", payload);
          if (payload.new?.Username) {
            setUsername(payload.new.Username);
          }
        }
      )
      .subscribe();

    return channel;
  };

  // Get session + listen for changes
  useEffect(() => {
    let subscription;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setLoading(false);

        if (session?.user) {
          await fetchUserRole(session.user.id);
          subscription = subscribeToUserUpdates(session.user.id); // 🟢 Subscribe to changes
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
          await fetchUserRole(session.user.id);
          subscription = subscribeToUserUpdates(session.user.id);
        } else {
          setUserRole(null);
          setUsername("");
        }
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

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

export const UserAuth = () => useContext(AuthContext);
export default AuthContext;
