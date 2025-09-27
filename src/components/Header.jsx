import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="w-full max-w-6xl mx-auto px-4">
        <nav className="flex gap-20 items-center py-4">
          <div className="flex items-center gap-2.5">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <img src="/logo.png" alt="ThreadCycle Duma Logo" className="w-full h-full object-contain rounded-full" />
              <i className="fas fa-recycle absolute text-xl text-green-600 hidden"></i>
            </div>
            <span className="text-2xl font-bold text-[#4c5f0d]">ThreadCycle Duma</span>
          </div>
          <ul className=" flex justify-center list-none">
            <li className="ml-6">
              <NavLink
                className={({ isActive }) =>
                  `text-gray-800 font-medium transition-colors no-underline hover:text-[#4c5f0d] ${isActive ? 'text-[#4c5f0d] border-b-2 border-[#4c5f0d]' : ''
                  }`
                }
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li className="ml-6">
              <NavLink
                className={({ isActive }) =>
                  `text-gray-800 font-medium transition-colors no-underline hover:text-[#4c5f0d] ${isActive ? 'text-[#4c5f0d] border-b-2 border-[#4c5f0d]' : ''
                  }`
                }
                to="/scrap-estimator"
              >
                Scrap Estimator
              </NavLink>
            </li>
            <li className="ml-6">
              <NavLink
                className={({ isActive }) =>
                  `text-gray-800 font-medium transition-colors no-underline hover:text-[#4c5f0d] ${isActive ? 'text-[#4c5f0d] border-b-2 border-[#4c5f0d]' : ''
                  }`
                }
                to="/tutorials"
              >
                Tutorials
              </NavLink>
            </li>
            <li className="ml-6">
              <NavLink
                className={({ isActive }) =>
                  `text-gray-800 font-medium transition-colors no-underline hover:text-[#4c5f0d] ${isActive ? 'text-[#4c5f0d] border-b-2 border-[#4c5f0d]' : ''
                  }`
                }
                to="/thrift-map"
              >
                Thrift Map
              </NavLink>
            </li>
            <li className="ml-6">
              <NavLink
                className={({ isActive }) =>
                  `text-gray-800 font-medium transition-colors no-underline hover:text-[#4c5f0d] ${isActive ? 'text-[#4c5f0d] border-b-2 border-[#4c5f0d]' : ''
                  }`
                }
                to="/about"
              >
                About
              </NavLink>
            </li>
            {/* Admin Link */}
            {/* {isAdmin && (
              <li className="ml-6">
                <NavLink 
                  className={({isActive}) => 
                    `text-gray-800 font-medium transition-colors no-underline hover:text-[#4c5f0d] ${
                      isActive ? 'text-[#4c5f0d] border-b-2 border-[#4c5f0d]' : ''
                    }`
                  } 
                  to="/admin"
                >
                  Admin
                </NavLink>
              </li>
            )} */}
          </ul>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center">
                <span className="mr-4">Welcome, {user.username}</span>
                {isAdmin && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium mr-4">Admin</span>}
                <NavLink
                  className={({ isActive }) =>
                    `text-gray-800 font-medium transition-colors no-underline hover:text-[#4c5f0d] ${isActive ? 'text-[#4c5f0d] border-b-2 border-[#4c5f0d]' : ''
                    }`
                  }
                  to="/logout"
                >
                  Logout
                </NavLink>
              </div>
            ) : (
              <NavLink
                className={({ isActive }) =>
                  `px-4 py-2 rounded font-medium cursor-pointer transition-all duration-300 bg-transparent border border-[var(--primary)] border-2 text-[var(--primary)] mr-2.5 hover:bg-[var(--primary)] hover:text-white ${isActive ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : ''
                  }`
                }
                to="/login"
              >
                Login
              </NavLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
