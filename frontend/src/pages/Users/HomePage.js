import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { FaBrain, FaRobot, FaChartLine, FaUsers, FaPlay, FaStar } from 'react-icons/fa';
import '../../styles/HomePage.css';

const HomePage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Master Your Next Interview with <span className="text-gradient">AI Intelligence</span>
            </h1>
            <p className="hero-subtitle">
              Practice with our AI-powered interviewer, get instant feedback, and boost your confidence
              for real interviews. Join thousands who've landed their dream jobs.
            </p>
            <div className="hero-buttons">
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose AI Interviewer?</h2>
            <p>Advanced AI technology to prepare you for success</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icons">
                <FaBrain />
              </div>
              <h3>AI-Powered Analysis</h3>
              <p>Get detailed feedback on your responses, body language, and communication skills</p>
            </div>
            <div className="feature-card">
              <div className="feature-icons">
                <FaRobot />
              </div>
              <h3>Smart Interview Bot</h3>
              <p>Practice with our intelligent bot that adapts questions based on your industry and role</p>
            </div>
            <div className="feature-card">
              <div className="feature-icons">
                <FaChartLine />
              </div>
              <h3>Performance Analytics</h3>
              <p>Track your progress with detailed analytics and personalized improvement suggestions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icons">
                <FaUsers />
              </div>
              <h3>Industry Experts</h3>
              <p>Questions curated by hiring managers and industry professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>50K+</h3>
              <p>Successful Interviews</p>
            </div>
            <div className="stat-item">
              <h3>95%</h3>
              <p>Success Rate</p>
            </div>
            <div className="stat-item">
              <h3>1000+</h3>
              <p>Companies</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>AI Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Users Say</h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p>"AI Interviewer helped me land my dream job at Google. The feedback was incredibly detailed and actionable."</p>
              <div className="testimonial-author">
                <strong>Sarah Chen</strong>
                <span>Software Engineer at Google</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p>"The AI analysis of my communication style was spot-on. I improved my confidence significantly."</p>
              <div className="testimonial-author">
                <strong>Michael Rodriguez</strong>
                <span>Product Manager at Microsoft</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p>"Best interview prep tool I've used. The personalized feedback made all the difference."</p>
              <div className="testimonial-author">
                <strong>Emily Johnson</strong>
                <span>Data Scientist at Amazon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Ace Your Next Interview?</h2>
            <p>Join thousands of professionals who've transformed their interview skills with AI</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;