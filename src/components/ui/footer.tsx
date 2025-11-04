"use client";

import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="footer-container">
        {/* Background Pattern */}
        <div className="footer-bg-overlay" />
        <div className="footer-bg-gradient" />
        
        <div className="footer-content">
          {/* Main Footer Content */}
          <div className="footer-grid">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="brand-section"
            >
              <div className="brand-logo">
                <div className="logo-icon">
                  <span className="logo-text"></span>
                </div>
                <h2 className="brand-title">Tropical Bloom Tourism</h2>
              </div>
              <p className="brand-description">
                Discover the soul of Sri Lanka through authentic experiences. From pristine beaches to ancient heritage sites, we bring you closer to paradise.
              </p>
              <div className="social-links">
                {[
                  { Icon: FaFacebookF, color: '#1877f2', delay: 0 },
                  { Icon: FaInstagram, color: '#e4405f', delay: 0.1 },
                  { Icon: FaYoutube, color: '#ff0000', delay: 0.2 },
                  { Icon: FaTwitter, color: '#1da1f2', delay: 0.3 }
                ].map(({ Icon, color, delay }, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay }}
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 360,
                      transition: { duration: 0.4 }
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="social-icon"
                    style={{ '--hover-color': color } as React.CSSProperties}
                  >
                    <Icon className="icon" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="links-section"
            >
              <h3 className="section-title">
                <span className="title-indicator"></span>
                Navigation
              </h3>
              <ul className="links-list">
                {['Home', 'Destinations', 'Tour Packages', 'Experiences', 'About Us'].map((item, index) => (
                  <motion.li 
                    key={item} 
                    className="link-item"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <a href="#" className="link">
                      <span className="link-bullet"></span>
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Popular Destinations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="links-section"
            >
              <h3 className="section-title">
                <span className="title-indicator"></span>
                Top Destinations
              </h3>
              <ul className="links-list">
                {[
                  'Sigiriya Rock Fortress',
                  'Ella & Nine Arch Bridge',
                  'Temple of the Tooth',
                  'Mirissa Beach',
                  'Yala National Park',
                  'Galle Fort'
                ].map((destination, index) => (
                  <motion.li 
                    key={destination} 
                    className="link-item"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <a href="#" className="destination-link">
                      <span className="destination-arrow">→</span>
                      {destination}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="contact-section"
            >
              <h3 className="section-title">
                <span className="title-indicator"></span>
                Get In Touch
              </h3>
              <div className="contact-info">
                <motion.div 
                  className="contact-item"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="contact-icon">
                    <FaMapMarkerAlt className="icon" />
                  </div>
                  <div>
                    <p className="contact-label">Location</p>
                    <p className="contact-detail">Colombo 03, Sri Lanka</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="contact-item"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="contact-icon">
                    <FaPhone className="icon" />
                  </div>
                  <div>
                    <p className="contact-label">Phone</p>
                    <p className="contact-detail">+94 77 123 4567</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="newsletter-section"
          >
            <div className="newsletter-content">
              <div className="newsletter-text">
                <h3 className="newsletter-title">Stay Updated</h3>
                <p className="newsletter-description">
                  Get exclusive travel tips and destination updates delivered to your inbox.
                </p>
              </div>
              <div className="newsletter-form">
                <div className="form-container">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="email-input"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="subscribe-button"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <div className="bottom-bar">
            <div className="bottom-content">
              <div className="copyright-section">
                <span>© {currentYear} Tropical Bloom Tourism. All rights reserved.</span>
                <div className="legal-links">
                  <a href="#" className="legal-link">Privacy</a>
                  <a href="#" className="legal-link">Terms</a>
                  <a href="#" className="legal-link">Cookies</a>
                </div>
              </div>
              
              <div className="developer-section">
                <div className="location-tag">
                  <span>🇱🇰</span>
                  <span>Made with passion in Sri Lanka</span>
                </div>
                <div className="developer-tag">
                  <span className="developed-text">Developed by</span>
                  <a 
                    href="https://zevarone.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="developer-link"
                  >
                    <span className="developer-icon">⚡</span>
                    <span className="developer-name">XXXX </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          className="floating-element amber"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="floating-element blue"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="floating-element green"
          animate={{
            x: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </footer>

      <style jsx>{`
        .footer-container {
          background: #0f172a;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .footer-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%);
          opacity: 0.95;
        }

        .footer-bg-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at top right, rgba(245, 158, 11, 0.1) 0%, transparent 50%, transparent 100%);
        }

        .footer-content {
          position: relative;
          z-index: 10;
          max-width: 80rem;
          margin: 0 auto;
          padding: 4rem 1.5rem;
        }

        @media (min-width: 1024px) {
          .footer-content {
            padding: 4rem 2rem;
          }
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 3rem;
          }
        }

        /* Brand Section */
        .brand-section {
          grid-column: 1 / -1;
        }

        @media (min-width: 1024px) {
          .brand-section {
            grid-column: span 1;
          }
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .logo-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(to right, #f59e0b, #d97706);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          color: #0f172a;
          font-weight: bold;
          font-size: 1.125rem;
        }

        .brand-title {
          font-size: 1.5rem;
          font-weight: bold;
          background: linear-gradient(to right, #f59e0b, #d97706);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-description {
          color: #cbd5e1;
          line-height: 1.625;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: #1e293b;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #cbd5e1;
          border: 1px solid #334155;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .social-icon::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--hover-color, #f59e0b);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .social-icon:hover {
          color: white;
          border-color: var(--hover-color, #f59e0b);
          box-shadow: 0 0 20px var(--hover-color, #f59e0b);
        }

        .social-icon:hover::before {
          opacity: 0.2;
        }

        .icon {
          font-size: 0.875rem;
          position: relative;
          z-index: 1;
        }

        /* Links Sections */
        .links-section {
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: white;
          display: flex;
          align-items: center;
        }

        .title-indicator {
          width: 0.25rem;
          height: 1rem;
          background: linear-gradient(to bottom, #f59e0b, #fbbf24);
          margin-right: 0.75rem;
          border-radius: 9999px;
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(245, 158, 11, 0.5);
          }
          50% {
            box-shadow: 0 0 15px rgba(245, 158, 11, 0.8);
          }
        }

        .links-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .link-item {
          list-style: none;
        }

        .link {
          color: #cbd5e1;
          transition: color 0.3s ease;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .link:hover {
          color: #f59e0b;
        }

        .link-bullet {
          width: 0.375rem;
          height: 0.375rem;
          background: #475569;
          border-radius: 9999px;
          transition: all 0.3s ease;
        }

        .link:hover .link-bullet {
          background: #f59e0b;
          transform: scale(1.5);
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
        }

        .destination-link {
          color: #cbd5e1;
          transition: color 0.3s ease;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .destination-link:hover {
          color: #f59e0b;
        }

        .destination-arrow {
          color: #f59e0b;
          opacity: 0;
          transition: all 0.3s ease;
          transform: translateX(-10px);
        }

        .destination-link:hover .destination-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* Contact Section */
        .contact-section {
          margin-bottom: 1rem;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .contact-icon {
          width: 2rem;
          height: 2rem;
          background: #1e293b;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 0.125rem;
          position: relative;
          transition: all 0.3s ease;
        }

        .contact-item:hover .contact-icon {
          background: rgba(245, 158, 11, 0.1);
          transform: scale(1.1);
        }

        .contact-icon .icon {
          color: #f59e0b;
          font-size: 0.875rem;
          transition: transform 0.3s ease;
        }

        .contact-item:hover .contact-icon .icon {
          transform: scale(1.1);
        }

        .contact-label {
          color: #cbd5e1;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .contact-detail {
          color: #94a3b8;
          font-size: 0.75rem;
        }

        /* Newsletter Section */
        .newsletter-section {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(8px);
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid #334155;
        }

        .newsletter-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .newsletter-content {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 1.5rem;
          }
        }

        .newsletter-text {
          flex: 1;
        }

        .newsletter-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: white;
          margin-bottom: 0.5rem;
        }

        .newsletter-description {
          color: #cbd5e1;
          font-size: 0.875rem;
        }

        .newsletter-form {
          flex: 1;
          width: 100%;
          max-width: 28rem;
        }

        .form-container {
          display: flex;
          gap: 0.75rem;
        }

        .email-input {
          flex: 1;
          padding: 0.75rem 1rem;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 0.75rem;
          color: white;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .email-input:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
        }

        .email-input::placeholder {
          color: #94a3b8;
        }

        .subscribe-button {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(to right, #f59e0b, #d97706);
          color: white;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .subscribe-button:hover {
          background: linear-gradient(to right, #d97706, #b45309);
        }

        /* Bottom Bar */
        .bottom-bar {
          border-top: 1px solid #1e293b;
          padding-top: 2rem;
        }

        .bottom-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .bottom-content {
            flex-direction: row;
            justify-content: space-between;
            gap: 0;
          }
        }

        .copyright-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .copyright-section {
            flex-direction: row;
            gap: 1.5rem;
            align-items: center;
          }
        }

        .copyright-section span {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .legal-links {
          display: flex;
          gap: 1rem;
        }

        .legal-link {
          color: #94a3b8;
          font-size: 0.875rem;
          transition: color 0.3s ease;
        }

        .legal-link:hover {
          color: #f59e0b;
        }

        .developer-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        @media (min-width: 1024px) {
          .developer-section {
            flex-direction: row;
            align-items: center;
            gap: 1.5rem;
          }
        }

        .location-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .developer-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .developed-text {
          color: #94a3b8;
        }

        .developer-link {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05));
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .developer-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .developer-link:hover::before {
          opacity: 1;
        }

        .developer-link:hover {
          border-color: rgba(245, 158, 11, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
        }

        .developer-icon {
          font-size: 1rem;
          position: relative;
          z-index: 1;
        }

        .developer-name {
          color: #f59e0b;
          font-weight: 700;
          letter-spacing: 0.05em;
          font-size: 0.875rem;
          position: relative;
          z-index: 1;
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Floating Elements */
        .floating-element {
          position: absolute;
          border-radius: 9999px;
          filter: blur(40px);
          pointer-events: none;
        }

        .floating-element.amber {
          bottom: 10%;
          right: 10%;
          width: 12rem;
          height: 12rem;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.3), rgba(217, 119, 6, 0.1));
        }

        .floating-element.blue {
          top: 20%;
          left: 5%;
          width: 10rem;
          height: 10rem;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.1));
        }

        .floating-element.green {
          top: 50%;
          right: 20%;
          width: 8rem;
          height: 8rem;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.05));
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out both;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </>
  );
}