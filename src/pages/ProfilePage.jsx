import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const ProfilePage = () => {
    const { signOut } = UserAuth();
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

    return (
        <>
        <button
        onClick={handleSignOut}
        >
            Logout
        </button>
        </>
    );
}

export default ProfilePage;