import { NavLink, Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Header = () => {
  const { userRole, loading } = UserAuth();
  // const [user, setUser] = useState("");

  return (
    <header className="bg-[#2C6E49] shadow-lg sticky top-0 z-50">
      <div className="w-full max-w-6xl mx-auto px-4">
        <nav className="flex gap-20 items-center py-4">
          <div className="flex items-center">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <img src="/logo.png" alt="ThreadCycle Duma Logo" className="w-full h-full object-contain rounded-full" />
              <i className="fas fa-recycle absolute text-xl text-green-600 hidden"></i>
            </div>
            <span className="text-2xl font-bold text-[#85b027]">ThreadCycle</span>
          </div>
          <ul className=" flex justify-center list-none">
            <li className="ml-6">
              <NavLink
                className={({ isActive }) =>
                  `relative transition-colors no-underline font-medium hover:text-[#FEFEE3] after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-[#FEFEE3] after:transition-all after:duration-300 hover:after:w-full
                  ${isActive 
                      ? "text-[#FEFEE3] after:w-full" 
                      : "text-white after:w-0"}`
                }
                
                to="/"
                end
              >
                Home
              </NavLink>
            </li>
            <li className="ml-6">
              <NavLink
                className={({ isActive }) =>
                  `relative transition-colors no-underline 
                   text-white font-medium hover:text-[#FEFEE3] 
                   after:content-[''] after:absolute after:w-0 after:h-[2px] 
                   after:left-0 after:-bottom-1 after:bg-[#FEFEE3] 
                   after:transition-all after:duration-300 
                   hover:after:w-full
                   ${isActive 
                      ? "text-[#FEFEE3] after:w-full" 
                      : "text-white after:w-0"}`
                }
                to="/scrap-estimator"
              >
                Scrap Estimator
              </NavLink>
            </li>
            <li className="ml-6">
              <NavLink
                className={({ isActive }) =>
                  `relative transition-colors no-underline 
                   font-medium hover:text-[#FEFEE3] 
                   after:content-[''] after:absolute after:w-0 after:h-[2px] 
                   after:left-0 after:-bottom-1 after:bg-[#FEFEE3] 
                   after:transition-all after:duration-300 
                   hover:after:w-full
                   ${isActive 
                      ? "text-[#FEFEE3] after:w-full" 
                      : "text-white after:w-0"}`
                }
                to="/tutorials"
              >
                Tutorials
              </NavLink>
            </li>
            <li className="ml-6">
              <NavLink
                className={({ isActive }) =>
                  `relative transition-colors no-underline 
                   font-medium hover:text-[#FEFEE3] 
                   after:content-[''] after:absolute after:w-0 after:h-[2px] 
                   after:left-0 after:-bottom-1 after:bg-[#FEFEE3] 
                   after:transition-all after:duration-300 
                   hover:after:w-full
                   ${isActive 
                      ? "text-[#FEFEE3] after:w-full" 
                      : "text-white after:w-0"}`
                }
                to="/thrift-map"
              >
                Thrift Map
              </NavLink>
            </li>
            <li className="ml-6">
              <NavLink
                className={({ isActive }) =>
                  `relative transition-colors no-underline 
                   font-medium hover:text-[#FEFEE3] 
                   after:content-[''] after:absolute after:w-0 after:h-[2px] 
                   after:left-0 after:-bottom-1 after:bg-[#FEFEE3] 
                   after:transition-all after:duration-300 
                   hover:after:w-full
                   ${isActive 
                      ? "text-[#FEFEE3] after:w-full" 
                      : "text-white after:w-0"}`
                }
                to="/about"
              >
                About
              </NavLink>
            </li>
            {/* Admin Link */}
          </ul>
          <div className="flex items-center">
            {!loading && userRole === "customer" || userRole === "admin" ? (
              <div className="flex items-center">
                <NavLink
                  className={({ isActive }) =>
                    `bg-[#4C956C] hover:bg-[#3B7D57] text-white font-bold px-6 py-3 rounded-lg cursor-pointer transition-all duration-300 tracking-wide text-sm shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center' : ''
                    }`
                  }
                  to="/profile"
                >
                  Profile
                </NavLink>
              </div>
            ) : (
              <NavLink
                className={
                  "bg-[#4C956C] hover:bg-[#3B7D57] text-white font-bold px-6 py-3 rounded-lg cursor-pointer transition-all duration-300 tracking-wide text-sm shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center "
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
