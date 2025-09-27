import { useState } from 'react';

function LoginPage({ setActivePage, setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim() && !isLogin) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (isLogin) {
        console.log('Logging in:', { email: formData.email, password: formData.password });
        setUser({ username: formData.username || formData.email.split('@')[0] });
        setActivePage('home'); // ✅ Go back to home after login
      } else {
        console.log('Registering:', formData);
        setUser({ username: formData.username });
        setActivePage('home'); // ✅ Go back to home after signup
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] px-5 py-10">
      <div className="w-full max-w-[400px]">
        <div className="bg-white p-10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-[#e1e5e9]">
          <div className="text-center mb-8">
            <h2 className='text-[#2c3e50] mb-2 text-[28px]'>{isLogin ? 'Welcome!' : 'Create Account'}</h2>
            <p className='text-[#7f8c8d] text-base'>{isLogin ? 'Sign in to your account' : 'Join our sustainable fashion community'}</p>
          </div>

          <form onSubmit={handleSubmit} className="mb-5">
            {!isLogin && (
              <div className="mb-5">
              <label 
                htmlFor="username" 
                className="block mb-2 text-[#2c3e50] font-medium text-sm"
              >
                Username
              </label>

              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition focus:outline-none focus:border-[#4c5f0d] focus:ring-2 focus:ring-[#4c5f0d]/20
                  ${errors.username ? "border-[#e74c3c]" : "border-[#e1e5e9]"}`}
              />

              {errors.username && (
                <span className="text-[#e74c3c] text-sm mt-1 block">
                  {errors.username}
                </span>
              )}
            </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            )}

            <button type="submit" className="btn btn-primary login-btn">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" className="toggle-mode-btn" onClick={toggleMode}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
