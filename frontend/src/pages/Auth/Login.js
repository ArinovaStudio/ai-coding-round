import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import { FaEnvelope, FaLock} from 'react-icons/fa';
import { REACT_APP_API_URL } from '../../context/env';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [auth, setAuth, login] = useAuth()
    const location = useLocation()

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${REACT_APP_API_URL}/api/auth/login`, {
                email,
                password
            });
            
            if (response.data.token && response.data.role) {
                login(response.data.token, response.data.role);
                
                // Navigate based on role
                if (response.data.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate(location.state?.from || '/');
                }
            } else {
                toast.error("Login failed. Please try again.");
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
            toast.error(errorMessage);
        }
    }

    return (
        <Layout>
            <div className=" bg-gray-50 flex items-center justify-center py-1 w-screen h-80%">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                            <p className="text-gray-600 mt-2">Login to your account</p>
                        </div>
                        
                        <form onSubmit={handlesubmit} className="space-y-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400" />
                                    </div>
                                    <input 
                                        type="email" 
                                        id="email"
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                                        placeholder="Enter your email" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input 
                                        type="password" 
                                        id="password"
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                                        placeholder="Enter your password" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <button
                                type="submit" 
                                className="w-full py-3 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                            >
                                Login
                            </button>
                        </form>
                        
                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                Don't have an account? 
                                <Link to="/register" className="text-purple-600 hover:text-purple-800 font-medium ml-1 transition-colors">
                                    Register
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Login