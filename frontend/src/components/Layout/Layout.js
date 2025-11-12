import React, { useState, useEffect } from 'react'
import Footer from './Footer'
import Header from './Header'
import { Toaster } from "react-hot-toast";
import { FaArrowUp } from 'react-icons/fa';
import '../../styles/LayoutStyles.css';

const Layout = (props) => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check scroll position to show/hide scroll to top button
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="site-wrapper">
            <Header />
            <main>
                <Toaster 
                    position='top-center' 
                    toastOptions={{
                        style: {
                            background: '#363636',
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '16px 24px',
                        },
                        success: {
                            iconTheme: {
                                primary: '#4caf50',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#f44336',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                {loading && (
                    <div className="page-loader">
                        <div className="spinner"></div>
                    </div>
                )}
                <div className="page-content">
                    {props.children}
                </div>
                
                {/* Scroll to top button */}
                <div 
                    className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                >
                    <FaArrowUp />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Layout