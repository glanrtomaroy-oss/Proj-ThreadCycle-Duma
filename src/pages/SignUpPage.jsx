import { useState } from 'react';

function SignupPage({ setActivePage, setUser }) {
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

    if (!formData.username.trim()) {
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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Registering:', formData);
      setUser({ username: formData.username });
      setActivePage('home'); // Go back to home after signup
    }
  };

  const handleBackToLogin = () => {
    setActivePage('login');
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 py-10 px-5">
      <div className="w-full max-w-md">
        <div className="bg-white p-10 rounded-xl shadow-2xl border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-gray-800 mb-2 text-3xl font-bold">Create Account</h2>
            <p className="text-gray-600 text-base">Join our sustainable fashion community</p>
          </div>

          <form onSubmit={handleSubmit} className="mb-5">
            <div className="mb-5">
              <label htmlFor="username" className="block mb-2 text-gray-800 font-medium text-sm">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-colors focus:outline-none focus:shadow-sm box-border ${
                  errors.username ? 'border-red-500' : 'border-gray-200 focus:border-[#4c5f0d]'
                }`}
                placeholder="Enter your username"
              />
              {errors.username && <span className="text-red-500 text-sm mt-1 block">{errors.username}</span>}
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 text-gray-800 font-medium text-sm">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-colors focus:outline-none focus:shadow-sm box-border ${
                  errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#4c5f0d]'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>}
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block mb-2 text-gray-800 font-medium text-sm">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-colors focus:outline-none focus:shadow-sm box-border ${
                  errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#4c5f0d]'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && <span className="text-red-500 text-sm mt-1 block">{errors.password}</span>}
            </div>

            <div className="mb-5">
              <label htmlFor="confirmPassword" className="block mb-2 text-gray-800 font-medium text-sm">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-colors focus:outline-none focus:shadow-sm box-border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-[#4c5f0d]'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <span className="text-red-500 text-sm mt-1 block">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="w-full py-3 bg-[#4c5f0d] text-white rounded-lg text-base font-semibold cursor-pointer transition-colors hover:bg-[#4c5f0d] mt-2">
              Create Account
            </button>
          </form>

          <div className="text-center border-t border-gray-200 pt-5">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button type="button" className="bg-none border-none text-[#4c5f0d] cursor-pointer font-semibold underline hover:text-[#4c5f0d]" onClick={handleBackToLogin}>
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;