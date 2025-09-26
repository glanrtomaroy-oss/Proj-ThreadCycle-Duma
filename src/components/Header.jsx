import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Header.css';

function Header({ user, onLogout }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = user && user.role === 'admin';

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        onLogout();
        setMobileMenuOpen(false);
        navigate('/');
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    // lock body scroll while mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            const previous = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = previous; };
        }
        return undefined;
    }, [mobileMenuOpen]);

    return (
        <header className="site-header">
            <div className="container header-inner">
                <nav className="navbar" role="navigation" aria-label="Main Navigation">
                    <Link to="/" className="logo" onClick={closeMobileMenu}>
                        <div className="logo-image" aria-hidden="true">
                            <img src="/logo.png" alt="ThreadCycle Duma Logo" />
                            <i className="fas fa-recycle"></i>
                        </div>
                        <span className="site-title">ThreadCycle Duma</span>
                    </Link>

                    {/* Desktop / Tablet Navigation */}
                    <ul className="nav-links">
                        <li>
                            <Link
                                to="/"
                                className={`${isActive('/') ? 'active' : ''}`}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/scrap-estimator"
                                className={`${isActive('/scrap-estimator') ? 'active' : ''}`}
                            >
                                Scrap Estimator
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/tutorials"
                                className={`${isActive('/tutorials') ? 'active' : ''}`}
                            >
                                Tutorials
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/thrift-map"
                                className={`${isActive('/thrift-map') ? 'active' : ''}`}
                            >
                                Thrift Map
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className={`${isActive('/about') ? 'active' : ''}`}
                            >
                                About
                            </Link>
                        </li>
                        {isAdmin && (
                            <li>
                                <Link
                                    to="/admin"
                                    className={`${isActive('/admin') ? 'active' : ''}`}
                                >
                                    Admin
                                </Link>
                            </li>
                        )}
                    </ul>

                    <div className="auth-buttons">
                        {user ? (
                            <div className="user-menu">
                                <span className="welcome-text">Welcome, {user.username}</span>
                                {isAdmin && <span className="admin-badge">Admin</span>}
                                <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="btn btn-outline"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileMenuOpen}
                        type="button"
                    >
                        {mobileMenuOpen ? (
                            // Close (X) icon - inline SVG
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            // Hamburger icon - inline SVG
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path d="M3 7h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 17h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </nav>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="mobile-nav" role="dialog" aria-modal="true">
                        <button className="mobile-nav-close" onClick={closeMobileMenu} aria-label="Close menu" type="button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <ul className="mobile-nav-links">
                            <li>
                                <Link
                                    to="/"
                                    className={`${isActive('/') ? 'active' : ''}`}
                                    onClick={closeMobileMenu}
                                >
                                    <i className="fas fa-home"></i> Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/scrap-estimator"
                                    className={`${isActive('/scrap-estimator') ? 'active' : ''}`}
                                    onClick={closeMobileMenu}
                                >
                                    <i className="fas fa-calculator"></i> Scrap Estimator
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/tutorials"
                                    className={`${isActive('/tutorials') ? 'active' : ''}`}
                                    onClick={closeMobileMenu}
                                >
                                    <i className="fas fa-video"></i> Tutorials
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/thrift-map"
                                    className={`${isActive('/thrift-map') ? 'active' : ''}`}
                                    onClick={closeMobileMenu}
                                >
                                    <i className="fas fa-map-marked-alt"></i> Thrift Map
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className={`${isActive('/about') ? 'active' : ''}`}
                                    onClick={closeMobileMenu}
                                >
                                    <i className="fas fa-info-circle"></i> About
                                </Link>
                            </li>
                            {isAdmin && (
                                <li>
                                    <Link
                                        to="/admin"
                                        className={`${isActive('/admin') ? 'active' : ''}`}
                                        onClick={closeMobileMenu}
                                    >
                                        <i className="fas fa-cog"></i> Admin
                                    </Link>
                                </li>
                            )}
                            <li className="mobile-auth">
                                {user ? (
                                    <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
                                ) : (
                                    <Link to="/login" className="btn btn-primary" onClick={closeMobileMenu}>Login</Link>
                                )}
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
