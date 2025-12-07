import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaBrain, FaRobot, FaInstagram } from 'react-icons/fa';
import '../../styles/Footer.css';
import { IoIosMail } from "react-icons/io";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 col-md-6 mb-5 mb-lg-0">
                            <div className="footer-widget">
                                <h3 className="widget-title">Arinova Studio</h3>
                                <p className="widget-text">
                                    Revolutionizing the interview process with AI-powered assessments. 
                                    Practice, improve, and ace your next interview with our intelligent platform.
                                </p>
                                <div className="social-links">
                                    <a href="https://linkedin.com/company/arinova-studio" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <FaLinkedinIn />
                                    </a>
                                    <a href="https://instagram.com/arinova-studio" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <FaInstagram />
                                    </a>
                                    <a href="mailto:support@arinova.studio" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <IoIosMail />
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <div className="flex justify-around w-full">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <p className="copyright">
                                &copy; {new Date().getFullYear()} All Rights Reserved - Arinova Studio
                            </p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <div className="footer-links">
                                <Link to="https://arinova.studio">www.arinova.studio</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;