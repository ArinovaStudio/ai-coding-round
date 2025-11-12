import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FaBrain, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../../context/auth'
import toast from 'react-hot-toast'

const Header = () => {
    const [auth, setAuth, login, logout] = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success("Logout Successfully")
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
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-[#9e4ff7] transition-colors" to="/">
                        <FaBrain className="text-[#9e4ff7] text-2xl" />
                        <span>AI Interviewer</span>
                    </Link>

                   

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
                                <button 
                                    className="flex items-center space-x-2 text-gray-700 hover:text-[#9e4ff7] transition-colors"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    
                                    <span className="hidden md:inline font-medium">👤</span>
                                </button>
                                
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
    )
}

export default Header