import { Link, NavLink } from 'react-router-dom';
import { FaBrain, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';

const AdminNavbar = () => {
  const [auth, setAuth, login, logout] = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
  }

  const capitalizeWords = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const name = capitalizeWords(auth?.user?.username) || auth?.role || 'User';

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/admin/dashboard" className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors">
            <FaBrain className="text-purple-600 text-2xl" />
            <span>AI Interviewer Admin</span>
          </NavLink>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/admin/new-interview"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:text-purple-600'
                }`
              }
            >
              New Interview
            </NavLink>
            <NavLink
              to="/admin/submitted-interviews"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:text-purple-600'
                }`
              }
            >
              Submitted Interviews
            </NavLink>
            <NavLink
              to="/admin/saved-questions"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:text-purple-600'
                }`
              }
            >
              Saved Questions
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:text-purple-600'
                }`
              }
            >
              Users
            </NavLink>
          </div>
          {/* Auth Section */}
          <div className="flex items-center">
            {!auth.token ? (
              <NavLink
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                to="/login"
              >
                Login / Register
              </NavLink>
            ) : (
              <div className="relative">
                <div className="w-20 h-8 bg-[#9e4ff7] text-white rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer hover:bg-purple-700 transition-colors">
                  <button
                    className="flex items-center space-x-2 text-white hover:text-[#9e4ff7] transition-colors"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >

                    <span className="hidden md:inline font-medium">👤</span>
                  </button>
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      {auth.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-left"
                          onClick={() => setDropdownOpen(false)}
                        >
                          🏠 Admin Dashboard
                        </Link>
                      )}
                      <button
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-left"
                        onClick={() => {
                          handleLogout();
                          setDropdownOpen(false);
                        }}
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;