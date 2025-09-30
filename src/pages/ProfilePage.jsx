import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useState, useEffect } from "react";
import { supabase } from "../util/supabase";

const ProfilePage = () => {
  const [profile, setProfile] = useState('')
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loadings, setLoadings] = useState(false);
  const [saving, setSaving] = useState(false);
  const [originalValues, setOriginalValues] = useState({});

    const { session, signOut, userRole } = UserAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
          await signOut();
          toast.success("Successfully signed out!")
          navigate("/login"); // Redirect to login page
          // Scroll to top after navigation
          setTimeout(() => window.scrollTo(0, 0), 100);
        } catch (error) {
        }
      };

      const hasChanges = () => {
        if (!profile) return false;
    
        return (
          username !== originalValues.username
        );
      };

      // ~Fetch profile data when component mounts or session changes~
      useEffect(() => {
        const fetchProfile = async () => {
          try {
            if (!session || !session.user) return;
            console.log(session);

            let tableName = "";
            let userIdColumn = "";
      
            // Decide which table to use
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
                console.error("Unknown role:", userRole);
                return;
            }
      
            const { data, error } = await supabase
              .from(tableName)
              .select("*")
              .eq(userIdColumn, session.user.id)
              .single();
      
            if (error || !data) {
              console.error("Fetch error:", error);
            } else {
              const profileData = {
                username: data.cus_username || data.admin_username || "",
                firstName: data.cus_fname || data.admin_fname || "",
                lastName: data.cus_lname || data.admin_lname || "",
                phoneNumber: data.cus_celno || data.admin_celno || ""
              };
      
              setUsername(profileData.username);
              setProfile(data);
              setOriginalValues(profileData);
            }
          } catch (err) {
            console.error("Unexpected error:", err);
          } finally {
            setLoadings(false);
          }
        };
      
        fetchProfile();
      }, [session]);

      //Function to handle profile save
      const handleSaveProfile = async () => {
        if (saving) return; // Prevent multiple clicks
        setSaving(true);
      
        try {
          let tableName = "";
          let userIdColumn = "";
          let updates = {};
      
          // 🔹 Map role → table + column + updates
          switch (userRole) {
            case "customer":
              tableName = "CUSTOMER";
              userIdColumn = "Customer_uid";
              updates = {
                Username: username.trim(),
              };
              break;
      
            case "admin":
              tableName = "ADMIN";
              userIdColumn = "Admin_uid";
              updates = {
                Username: username.trim(),
              };
              break;
      
            default:
              toast.error("Unknown role. Cannot update profile.", {
                duration: 4000,
                position: "top-center",
              });
              return;
          }
      
          // 🔹 Perform the update
          const { error } = await supabase
            .from(tableName)
            .update(updates)
            .eq(userIdColumn, session.user.id);
      
          if (error) {
            toast.error(`Failed to update profile: ${error.message}`, {
              duration: 4000,
              position: "top-center",
            });
          } else {
            setProfile((prev) => ({ ...prev, ...updates }));
            setOriginalValues({ username: username.trim() });
      
            toast.success("Profile updated successfully!", {
              duration: 3000,
              position: "top-center",
              style: {
                background: "#10B981",
                color: "#fff",
                borderRadius: "8px",
                padding: "12px 16px",
              },
            });
          }
        } catch (err) {
          toast.error("An unexpected error occurred. Please try again.", {
            duration: 4000,
            position: "top-center",
          });
        } finally {
          setSaving(false);
        }
      };
      

    return (
      <section className="bg-gradient-to-br from-[#F8E6B4] via-[#E2D2A2] to-[#DFDAC7] min-h-screen flex flex-col items-center justify-center py-20 px-10 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#AF524D]/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#DFAD56]/15 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-[#8B3A3A]/8 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-[#DFAD56]/12 rounded-full blur-lg animate-pulse delay-3000"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 w-full max-w-4xl relative z-10 overflow-hidden">
        <div className="bg-gradient-to-r from-[#AF524D] to-[#8B3A3A] p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="mr-4">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-abhaya font-bold text-white">My Profile</h1>
                  <p className="text-white/90 text-sm">Manage and protect your account</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-2xl cursor-pointer transition-all duration-300 tracking-wide text-sm shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">

          {/* Username */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#492220] mb-2 flex items-center">
              <svg className="w-4 h-4 text-[#AF524D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Username
            </label>
            <div className="bg-[#F8F9FA] border border-[#AF524D]/20 rounded-2xl px-4 py-3">
              <p className="text-[#492220] text-sm font-medium">{profile.Username || "Not set"}</p>
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#492220] mb-2 flex items-center">
              <svg className="w-4 h-4 text-[#AF524D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </label>
            <div className="bg-[#F8F9FA] border border-[#AF524D]/20 rounded-2xl px-4 py-3">
              <p className="text-[#492220] text-sm font-medium">{profile.Email || "Not set"}</p>
            </div>
          </div>

          {/* Password Status */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-[#492220] mb-2 flex items-center">
              <svg className="w-4 h-4 text-[#AF524D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Password Status
            </label>
            <div className="bg-[#F8F9FA] border border-[#AF524D]/20 rounded-2xl px-4 py-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <p className="text-[#492220] text-sm font-medium">Password is set</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="text-center pt-4">
            <button
              className={`font-bold px-8 py-4 rounded-2xl text-sm cursor-pointer transition-all duration-300 tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transform disabled:hover:scale-100 flex items-center justify-center mx-auto ${saving || !hasChanges()
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#AF524D] to-[#8B3A3A] hover:from-[#8B3A3A] hover:to-[#6B2D2D] text-white'
                }`}
              onClick={handleSaveProfile}
              disabled={saving || !hasChanges()}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Save Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      </section>
    );
}

export default ProfilePage;