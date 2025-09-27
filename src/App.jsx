import './App.css';
import { useState } from 'react';
import HomePage from './pages/HomePage';
import ScrapEstimatorPage from './pages/ScrapEstimatorPage';
import TutorialsPage from './pages/TutorialsPage';
import ThriftMapPage from './pages/ThriftMapPage';
import AboutPage from './pages/AboutPage';
import  LoginPage from './pages/LoginPage';
import  AdminPage from './pages/AdminPage';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [activePage, setActivePage] = useState("home");
  const [user, setUser] = useState(null);

  // Helper function to render the actual page content
  const renderCurrentPage = () => {
    switch(activePage) {
      case "home":
        return <HomePage setActivePage={setActivePage} user={user} />;
      case "scrap-estimator":
        return <ScrapEstimatorPage user={user} />;
      case "tutorials":
        return <TutorialsPage user={user} />;
      case "thrift-map":
        return <ThriftMapPage user={user} />;
      case "about":
        return <AboutPage />;
      case "login":
        return (
          <LoginPage 
            setActivePage={setActivePage} 
            setUser={setUser} 
          />
        );
      case "admin":
        return user?.role === 'admin' 
          ? <AdminPage user={user} /> 
          : <HomePage setActivePage={setActivePage} user={user} />;
      default:
        return <HomePage setActivePage={setActivePage} user={user} />;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActivePage("home");
  };

  const handleNavigation = (page) => {
    setActivePage(page);
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <>
      {/* Header */}
      <header>
        <div className="container">
          <nav className="navbar">
            <div className="logo">
              <div className="logo-image">
                <img src="/logo.png" alt="ThreadCycle Duma Logo" />
                <i className="fas fa-recycle"></i>
              </div>
              <span>ThreadCycle Duma</span>
            </div>
            <ul className="nav-links">
              <li>
                <a 
                  href="#home" 
                  className={activePage === "home" ? "active" : ""} 
                  onClick={(e) => { e.preventDefault(); handleNavigation("home"); }}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#scrap-estimator" 
                  className={activePage === "scrap-estimator" ? "active" : ""} 
                  onClick={(e) => { e.preventDefault(); handleNavigation("scrap-estimator"); }}
                >
                  Scrap Estimator
                </a>
              </li>
              <li>
                <a 
                  href="#tutorials" 
                  className={activePage === "tutorials" ? "active" : ""} 
                  onClick={(e) => { e.preventDefault(); handleNavigation("tutorials"); }}
                >
                  Tutorials
                </a>
              </li>
              <li>
                <a 
                  href="#thrift-map" 
                  className={activePage === "thrift-map" ? "active" : ""} 
                  onClick={(e) => { e.preventDefault(); handleNavigation("thrift-map"); }}
                >
                  Thrift Map
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className={activePage === "about" ? "active" : ""} 
                  onClick={(e) => { e.preventDefault(); handleNavigation("about"); }}
                >
                  About
                </a>
              </li>
              {/* Admin Link */}
              {isAdmin && (
                <li>
                  <a 
                    href="#admin" 
                    className={activePage === "admin" ? "active" : ""} 
                    onClick={(e) => { e.preventDefault(); handleNavigation("admin"); }}
                  >
                    Admin
                  </a>
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
                <button 
                  className="btn btn-outline" 
                  onClick={() => handleNavigation("login")}
                >
                  Login
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Render Active Page */}
      {renderCurrentPage()}

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>ThreadCycle Duma</h3>
              <p>A digital platform for slow fashion and sustainable living in Dumaguete City.</p>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2025 ThreadCycle Duma. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
