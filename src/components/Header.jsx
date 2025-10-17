import { NavLink, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "../util/supabase";
import toast from "react-hot-toast";

const Header = () => {
  const { userRole, loading, session } = UserAuth();
  const [username, setUsername] = useState("");

  // 🧠 Fetch username from either ADMIN or CUSTOMER table
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        if (!session?.user || !userRole) return;

        let tableName = "";
        let userIdColumn = "";

        switch (userRole) {
          case "customer":
            tableName = "CUSTOMER";
            userIdColumn = "Customer_uid";
            break;
          case "admin":
            tableName = "ADMIN";
            userIdColumn = "Admin_uid";
            break;
          default:
            return;
        }

        const { data, error } = await supabase
          .from(tableName)
          .select("Username")
          .eq(userIdColumn, session.user.id)
          .single();

        if (error) {
          console.error("Error fetching username:", error.message);
          return;
        }

        setUsername(data?.Username || "");
      } catch (err) {
        console.error("Unexpected error fetching username:", err);
        toast.error("Error fetching user profile.");
      }
    };

    if (!loading) fetchUsername();
  }, [session, userRole, loading]);

  // 🟢 Button text logic
  const displayName = loading
    ? "Loading..."
    : session?.user
    ? username || (userRole === "admin" ? "Admin" : "Profile")
    : "Guest";

  console.log("Header → Role:", userRole);
  console.log("Header → Username:", username);
  console.log("Header → Session:", session);

  return (
    <header className="bg-[#2C6E49] shadow-lg sticky top-0 z-50">
      <div className="w-full max-w-6xl mx-auto px-4">
        <nav className="flex gap-20 items-center py-4">
          {/* LOGO */}
          <Link to="/" className="flex items-center no-underline">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="ThreadCycle Duma Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <span className="text-2xl font-bold text-[#85b027]">
              ThreadCycle
            </span>
          </Link>

          {/* NAVIGATION LINKS */}
          <ul className="flex justify-center list-none">
            <li className="ml-6">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `relative transition-colors no-underline font-medium hover:text-[#FEFEE3]
                  after:content-[''] after:absolute after:w-0 after:h-[2px]
                  after:left-0 after:-bottom-1 after:bg-[#FEFEE3] after:transition-all after:duration-300 hover:after:w-full
                  ${isActive ? "text-[#FEFEE3] after:w-full" : "text-white after:w-0"}`
                }
              >
                Home
              </NavLink>
            </li>

            <li className="ml-6">
              <NavLink
                to="/scrap-estimator"
                className={({ isActive }) =>
                  `relative transition-colors no-underline font-medium hover:text-[#FEFEE3]
                  after:content-[''] after:absolute after:w-0 after:h-[2px]
                  after:left-0 after:-bottom-1 after:bg-[#FEFEE3] after:transition-all after:duration-300 hover:after:w-full
                  ${isActive ? "text-[#FEFEE3] after:w-full" : "text-white after:w-0"}`
                }
              >
                Scrap Estimator
              </NavLink>
            </li>

            <li className="ml-6">
              <NavLink
                to="/tutorials"
                className={({ isActive }) =>
                  `relative transition-colors no-underline font-medium hover:text-[#FEFEE3]
                  after:content-[''] after:absolute after:w-0 after:h-[2px]
                  after:left-0 after:-bottom-1 after:bg-[#FEFEE3] after:transition-all after:duration-300 hover:after:w-full
                  ${isActive ? "text-[#FEFEE3] after:w-full" : "text-white after:w-0"}`
                }
              >
                Tutorials
              </NavLink>
            </li>

            <li className="ml-6">
              <NavLink
                to="/thrift-map"
                className={({ isActive }) =>
                  `relative transition-colors no-underline font-medium hover:text-[#FEFEE3]
                  after:content-[''] after:absolute after:w-0 after:h-[2px]
                  after:left-0 after:-bottom-1 after:bg-[#FEFEE3] after:transition-all after:duration-300 hover:after:w-full
                  ${isActive ? "text-[#FEFEE3] after:w-full" : "text-white after:w-0"}`
                }
              >
                Thrift Map
              </NavLink>
            </li>

            <li className="ml-6">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `relative transition-colors no-underline font-medium hover:text-[#FEFEE3]
                  after:content-[''] after:absolute after:w-0 after:h-[2px]
                  after:left-0 after:-bottom-1 after:bg-[#FEFEE3] after:transition-all after:duration-300 hover:after:w-full
                  ${isActive ? "text-[#FEFEE3] after:w-full" : "text-white after:w-0"}`
                }
              >
                About
              </NavLink>
            </li>

            {/* ✅ Show Admin Page link only if admin */}
            {!loading && userRole === "admin" && (
              <li className="ml-6">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `relative transition-colors no-underline font-medium hover:text-[#FEFEE3]
                    after:content-[''] after:absolute after:w-0 after:h-[2px]
                    after:left-0 after:-bottom-1 after:bg-[#FEFEE3] after:transition-all after:duration-300 hover:after:w-full
                    ${isActive ? "text-[#FEFEE3] after:w-full" : "text-white after:w-0"}`
                  }
                >
                  Admin Page
                </NavLink>
              </li>
            )}
          </ul>

          {/* ✅ PROFILE / LOGIN BUTTON */}
          <div className="flex items-center">
            {session?.user ? (
              <NavLink
                to="/profile"
                className="bg-[#4C956C] hover:bg-[#3B7D57] text-white font-bold px-6 py-3 rounded-lg cursor-pointer transition-all duration-300 tracking-wide text-sm shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center"
              >
                {displayName}
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="bg-[#4C956C] hover:bg-[#3B7D57] text-white font-bold px-6 py-3 rounded-lg cursor-pointer transition-all duration-300 tracking-wide text-sm shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center"
              >
                {displayName}
              </NavLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
