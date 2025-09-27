import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
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
              {/* <a
                href="#home"
                className={activePage === "home" ? "active" : ""}
                onClick={(e) => { e.preventDefault(); handleNavigation("home"); }}
              >
                Home
              </a> */}
              <NavLink className={({isActive}) => isActive ? "active" : ""} to="/">Home</NavLink>
            </li>
            <li>
              {/* <a
                href="#scrap-estimator"
                className={activePage === "scrap-estimator" ? "active" : ""}
                onClick={(e) => { e.preventDefault(); handleNavigation("scrap-estimator"); }}
              >
                Scrap Estimator
              </a> */}
              <NavLink className={({isActive}) => isActive ? "active" : ""} to="/scrap-estimator">Scrap Estimator</NavLink>
            </li>
            <li>
              {/* <a
                href="#tutorials"
                className={activePage === "tutorials" ? "active" : ""}
                onClick={(e) => { e.preventDefault(); handleNavigation("tutorials"); }}
              >
                Tutorials
              </a> */}
              <NavLink className={({isActive}) => isActive ? "active" : ""} to="/tutorials">Tutorials</NavLink>
            </li>
            <li>
              {/* <a
                href="#thrift-map"
                className={activePage === "thrift-map" ? "active" : ""}
                onClick={(e) => { e.preventDefault(); handleNavigation("thrift-map"); }}
              >
                Thrift Map
              </a> */}
              <NavLink className={({isActive}) => isActive ? "active" : ""} to="/thrift-map">Thrift Map</NavLink>
            </li>
            <li>
              {/* <a
                href="#about"
                className={activePage === "about" ? "active" : ""}
                onClick={(e) => { e.preventDefault(); handleNavigation("about"); }}
              >
                About
              </a> */}
              <NavLink className={({isActive}) => isActive ? "active" : ""} to="/about">About</NavLink>
            </li>
            {/* Admin Link */}
            {/* {isAdmin && (
              <li>
                <NavLink className={({isActive}) => isActive ? "active" : ""} to="/admin">Admin</NavLink>
              </li>
            )} */}
          </ul>
          <div className="auth-buttons">
            {user ? (
              <div className="user-menu">
                <span className="welcome-text">Welcome, {user.username}</span>
                {isAdmin && <span className="admin-badge">Admin</span>}
                <NavLink className={({isActive}) => isActive ? "active" : ""} to="/logout">Logout</NavLink>
              </div>
            ) : (
              <NavLink className={({isActive}) => isActive ? "active" : ""} to="/login">Login</NavLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
