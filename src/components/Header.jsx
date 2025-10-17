import { NavLink, Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { useState, useEffect } from "react";
import { supabase } from "../util/supabase";
import toast from "react-hot-toast";

const Header = () => {
  const { userRole, loading, session } = UserAuth();
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  console.log("Current user role:", userRole);
  console.log("Loading state:", loading);
  console.log("User info:", user);

  // Fetch profile data for the current user based on role
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!session?.user) return;
  
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
            return; // no role yet
        }
  
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq(userIdColumn, session.user.id)
          .single();
  
        if (error || !data) {
          console.error("Profile fetch error:", error);
          toast.error("Profile information could not be retrieved.");
        } else {
          setUsername(data.Username || "");
          setProfile(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("Unexpected error while fetching profile.");
      }
    };
  
    if (!loading && userRole) {
      fetchProfile();
    }
  }, [session, userRole, loading]);

  
  // 🟢 Determine what to display on the button
  const displayName = !loading
    ? userRole === "admin"
      ? username || "Admin"
      : username || "Profile"
    : "Profile";
  
  // const displayName = !loading
  //   ? userRole === "admin"
  //     ? "Admin"
  //     : user?.username || user?.email?.split("@")[0] || "Profile"
  //   : "Profile";
  
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
            <span className="text-2xl font-bold text-[#85b027]">ThreadCycle</span>
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

          {/* PROFILE / LOGIN BUTTON */}
          <div className="flex items-center">
            {!loading && (userRole === "customer" || userRole === "admin") ? (
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
                Login
              </NavLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
