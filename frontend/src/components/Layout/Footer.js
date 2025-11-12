import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedinIn, FaTwitter, FaGithub, FaEnvelope, FaPhoneAlt, FaBrain, FaRobot } from 'react-icons/fa';
import '../../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 mb-5 mb-lg-0">
                            <div className="footer-widget">
                                <h3 className="widget-title">AI Interviewer</h3>
                                <p className="widget-text">
                                    Revolutionizing the interview process with AI-powered assessments. 
                                    Practice, improve, and ace your next interview with our intelligent platform.
                                </p>
                                <div className="social-links">
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <FaLinkedinIn />
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <FaTwitter />
                                    </a>
                                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <FaGithub />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-6 mb-5 mb-lg-0">
                            <div className="footer-widget">
                                <h3 className="widget-title">Features</h3>
                                <ul className="widget-links">
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/practice">Practice Interview</Link></li>
                                    <li><Link to="/mock-tests">Mock Tests</Link></li>
                                    <li><Link to="/feedback">AI Feedback</Link></li>
                                    <li><Link to="/analytics">Performance Analytic</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-6 mb-5 mb-md-0">
                            <div className="footer-widget">
                                <h3 className="widget-title">Support</h3>
                                <ul className="widget-links">
                                    <li><Link to="/help">Help Center</Link></li>
                                    <li><Link to="/tutorials">Tutorials</Link></li>
                                    <li><Link to="/faq">FAQ</Link></li>
                                    <li><Link to="/terms">Terms of Service</Link></li>
                                    <li><Link to="/privacy">Privacy Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="footer-widget">
                                <h3 className="widget-title">Contact Us</h3>
                                <ul className="contact-info">
                                    <li>
                                        <FaEnvelope className="me-2" />
                                        <span>support@aiinterviewer.com</span>
                                    </li>
                                    <li>
                                        <FaPhoneAlt className="me-2" />
                                        <span>+1 (555) AI-HELP</span>
                                    </li>
                                </ul>
                                <div className="ai-features">
                                    <div className="feature-item">
                                        <FaBrain className="feature-icon" />
                                        <span>AI-Powered Analysis</span>
                                    </div>
                                    <div className="feature-item">
                                        <FaRobot className="feature-icon" />
                                        <span>Smart Interview Bot</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <p className="copyright">
                                &copy; {new Date().getFullYear()} AI Interviewer. All Rights Reserved.
                            </p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <div className="footer-links">
                                <Link to="/terms">Terms</Link>
                                <Link to="/privacy">Privacy</Link>
                                <Link to="/security">Security</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;