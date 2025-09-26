import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { signUpSchema, loginSchema } from '../utils/validation';

function OptimizedLoginPage({ setUser }) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm({
        resolver: zodResolver(isLogin ? loginSchema : signUpSchema)
    });

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            if (isLogin) {
                // Handle login logic
                console.log('Logging in:', data);
                setUser({
                    username: data.email.split('@')[0],
                    email: data.email,
                    role: 'user' // Default role
                });
                navigate('/');
            } else {
                // Handle signup logic
                console.log('Registering:', data);
                setUser({
                    username: data.username,
                    email: data.email,
                    role: 'user' // Default role
                });
                navigate('/');
            }
        } catch (error) {
            console.error('Auth error:', error);
            alert('Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        reset();
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
                        <p>{isLogin ? 'Sign in to your account' : 'Join our sustainable fashion community'}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    {...register('username')}
                                    className={errors.username ? 'error' : ''}
                                    placeholder="Enter your username"
                                />
                                {errors.username && (
                                    <span className="error-message">{errors.username.message}</span>
                                )}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                {...register('email')}
                                className={errors.email ? 'error' : ''}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <span className="error-message">{errors.email.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                {...register('password')}
                                className={errors.password ? 'error' : ''}
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <span className="error-message">{errors.password.message}</span>
                            )}
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    {...register('confirmPassword')}
                                    className={errors.confirmPassword ? 'error' : ''}
                                    placeholder="Confirm your password"
                                />
                                {errors.confirmPassword && (
                                    <span className="error-message">{errors.confirmPassword.message}</span>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary login-btn"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
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

export default OptimizedLoginPage;
