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

      // Fetch profile data 
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
              toast.error("Profile information could not be retrieved.", error);
            } else {
              const profileData = {
                username: data.Username || ""
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
      
          // Map role → table + column + updates
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
      <section className="bg-[#FEFEE3] to-gray-300 min-h-screen flex flex-col items-center justify-center py-20 px-10 relative overflow-hidden">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl relative z-10 overflow-hidden">
        <div className="bg-[#2C6E49] p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="text-left">
                  <h1 className="text-3xl font-abhaya font-bold text-white">My Profile</h1>
                  <p className="text-white/90 text-sm">Manage and protect your account</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-[#4C956C] hover:bg-[#3B7D57] text-white font-bold px-6 py-3 rounded-lg cursor-pointer transition-all duration-300 tracking-wide text-sm shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">

          {/* Username */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center">
              {}
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/90 backdrop-blur-sm text-gray-800 font-medium rounded-xl px-4 py-3 border border-[#4C956C]/20 focus:outline-none focus:ring-2 focus:ring-[#4C956C]/30 focus:border-[#4C956C] text-sm shadow-sm transition-all duration-300 hover:shadow-md"
              placeholder="Enter your username"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center">
              {}
              Email
            </label>
            <div className="bg-[#F8F9FA] border border-[#4C956C]/20 rounded-xl px-4 py-3">
              <p className="text-gray-800 text-sm font-medium">{profile.Email || "Not set"}</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="text-center pt-4">
            <button
              className={`font-bold px-8 py-4 rounded-xl text-sm cursor-pointer transition-all duration-300 tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transform disabled:hover:scale-100 flex items-center justify-center mx-auto ${saving || !hasChanges()
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-[#4C956C] hover:bg-[#3B7D57] text-white'
                }`}
              onClick={handleSaveProfile}
              disabled={saving || !hasChanges()}
            >
              {saving ? (
                <> Saving... </>
              ) : (
                <> Save Profile </>
              )}
            </button>
          </div>
        </div>
      </div>
      </section>
    );
}

export default ProfilePage;
