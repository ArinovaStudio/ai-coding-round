import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaUserTag} from 'react-icons/fa';

// This component handles user registration
// It includes a form for users to enter their details
const Register = () => {
    // State variables for registration form
    // These will hold the values entered by the user
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
                username,
                email,
                password,
                role
            });
            
            if (response.data.message) {
                toast.success(response.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            toast.error(errorMessage);
        }
    }

    return ( 
        <Layout >
            <div className=" bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                            <p className="text-gray-600 mt-2">Join AI Interviewer to get started</p>
                        </div>
                        
                        <form onSubmit={handlesubmit} className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        id="username"
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)} 
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                        placeholder="Enter your username" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400" />
                                    </div>
                                    <input 
                                        type="email" 
                                        id="email"
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                        placeholder="Enter your email" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input 
                                        type="password" 
                                        id="password"
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                        placeholder="Create a password" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUserTag className="text-gray-400" />
                                    </div>
                                    <select 
                                        id="role"
                                        value={role} 
                                        onChange={(e) => setRole(e.target.value)} 
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                        required
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mt-6"
                            >
                                Create Account
                            </button>
                        </form>
                        
                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                Already have an account? 
                                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium ml-1 transition-colors">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Register