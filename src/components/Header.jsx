import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

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

    return (
        <header>
            <div className="container">
                <nav className="navbar">
                    <Link to="/" className="logo" onClick={closeMobileMenu}>
                        <div className="logo-image">
                            <img src="/logo.png" alt="ThreadCycle Duma Logo" />
                            <i className="fas fa-recycle"></i>
                        </div>
                        <span>ThreadCycle Duma</span>
                    </Link>

                    {/* Desktop Navigation */}
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
                        aria-label="Toggle mobile menu"
                    >
                        <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </button>
                </nav>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="mobile-nav">
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
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
