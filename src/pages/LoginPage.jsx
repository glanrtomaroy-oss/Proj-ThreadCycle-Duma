import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signInUser } = UserAuth();
  
  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const result = await signInUser(email, password );
      if (result.success) {
        toast.success("Successfully signed in! Welcome back to ThreadCycle!");

        console.log(result);

        // ✅ Redirect based on role
        if (result.role === "admin") {
          navigate("/admin");
        } else if (result.role === "customer") {
          navigate("/");
        }

        // Scroll to top after navigation
        setTimeout(() => window.scrollTo(0, 0), 100);
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 py-10 px-5">
      <div className="w-full max-w-md">
        <div className="bg-white p-10 rounded-xl shadow-2xl border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-gray-800 mb-2 text-3xl font-bold">Welcome!</h2>
            <p className="text-gray-600 text-base">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="mb-5">
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 text-gray-800 font-medium text-sm">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={"w-full px-4 py-3 border-2 rounded-lg text-base transition-colors focus:outline-none focus:shadow-sm box-border"}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block mb-2 text-gray-800 font-medium text-sm">Password</label>
              <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={"w-full px-4 py-3 border-2 rounded-lg text-base transition-colors focus:outline-none focus:shadow-sm box-border"}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#AF524D]/60 hover:text-[#AF524D] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="black">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="black">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-base font-semibold mt-2 transition-colors
                ${loading 
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                  : "bg-[#4c5f0d] text-white hover:bg-[#3b4a0a] cursor-pointer"
                }`}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="text-center border-t border-gray-200 pt-5">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button type="button" className="bg-none border-none text-[#4c5f0d] cursor-pointer font-semibold underline hover:text-[#4c5f0d]" onClick={handleGoToSignup}>
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
