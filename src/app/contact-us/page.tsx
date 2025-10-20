'use client';

import { useState } from 'react';


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Visit Us',
      details: 'No. 123, Galle Road\nColombo 03, Sri Lanka'
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: '+94 11 234 5678\n+94 77 123 4567'
    },
    {
      icon: '✉️',
      title: 'Email Us',
      details: 'info@srilankatourism.lk\nbookings@srilankatourism.lk'
    },
    {
      icon: '🕒',
      title: 'Business Hours',
      details: 'Monday - Friday: 8:00 AM - 6:00 PM\nWeekends: 9:00 AM - 4:00 PM'
    }
  ];

  const quickContacts = [
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our travel experts in real-time',
      button: 'Start Chat'
    },
    {
      icon: '📱',
      title: 'WhatsApp',
      description: 'Message us directly on WhatsApp',
      button: '+94 77 123 4567'
    },
    {
      icon: '📞',
      title: 'Call Back',
      description: 'Request a free callback from our team',
      button: 'Request Call'
    },
    {
      icon: '👥',
      title: 'Visit Office',
      description: 'Schedule an in-person consultation',
      button: 'Book Appointment'
    }
  ];

  return (
    <div className="contact-page">
    
      
      {/* Full Screen Hero Section */}
      <section className="fullscreen-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Get In Touch</h1>
            <p className="hero-subtitle">
              Ready to plan your perfect Sri Lankan adventure? Let's start the conversation.
            </p>
          </div>
          
          <div className="hero-scroll-indicator">
            <span>Scroll to connect</span>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </section>

      {/* Contact Main Section */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="section-header">
                <h2>Send Us a Message</h2>
                <p>We'll get back to you within 24 hours</p>
              </div>

              {isSubmitted ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for contacting us. We'll get back to you soon.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Full Name"
                    />
                    <div className="input-underline"></div>
                  </div>

                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email Address"
                    />
                    <div className="input-underline"></div>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Subject"
                    />
                    <div className="input-underline"></div>
                  </div>

                  <div className="form-group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us about your dream Sri Lankan adventure..."
                    ></textarea>
                    <div className="input-underline"></div>
                  </div>

                  <button 
                    type="submit" 
                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner"></div>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="contact-info-section">
              <div className="contact-info-card">
                <h3>Contact Information</h3>
                
                <div className="contact-items">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="contact-item">
                      <div className="contact-icon">{item.icon}</div>
                      <div className="contact-details">
                        <h4>{item.title}</h4>
                        <p>{item.details.split('\n').map((line, i) => (
                          <span key={i}>{line}<br /></span>
                        ))}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="social-links">
                  <h4>Follow Our Journey</h4>
                  <div className="social-icons">
                    {['📘', '📷', '🐦', '📺'].map((icon, index) => (
                      <a key={index} href="#" className="social-icon">
                        {icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="map-section">
                <h3>Find Us</h3>
                <div className="map-container">
                  <div className="map-placeholder">
                    <div className="map-overlay">
                      <div className="map-pin">📍</div>
                      <p>Interactive Map Loading...</p>
                      <small>Colombo, Sri Lanka</small>
                    </div>
                    <div className="map-frame">
                     // Replace the map placeholder section with:
<div className="map-frame">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467112139!2d79.85275541532638!3d6.92706619500827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259130df8cb3d%3A0xcb2d5bceae83c41!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1633021634345!5m2!1sen!2sus"
    width="100%"
    height="300"
    style={{ border: 0, borderRadius: '12px' }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Sri Lanka Tourism Office Location"
  ></iframe>
</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact Section */}
          <section className="quick-contact-section">
            <div className="section-header">
              <h2>Other Ways to Connect</h2>
              <p>Choose your preferred way to reach out to us</p>
            </div>
            
            <div className="quick-contact-grid">
              {quickContacts.map((contact, index) => (
                <div key={index} className="quick-card">
                  <div className="card-icon">{contact.icon}</div>
                  <h4>{contact.title}</h4>
                  <p>{contact.description}</p>
                  <button className="card-btn">{contact.button}</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <style jsx>{`
        .contact-page {
          min-height: 100vh;
          margin-top: 0;
        }

        /* Full Screen Hero Section */
        .fullscreen-hero {
          height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
          margin-top: 0;
          padding-top: 80px;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('/images/contact-hero.jpg') center/cover no-repeat;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6));
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .hero-text {
          margin-bottom: 0;
          text-align: center;
        }

        .hero-title {
          font-size: 4.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
          line-height: 1.1;
          animation: fadeInUp 1s ease-out;
        }

        .hero-subtitle {
          font-size: 1.6rem;
          font-weight: 300;
          opacity: 0.95;
          margin-bottom: 3rem;
          text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
          animation: fadeInUp 1s ease-out 0.2s both;
        }

        .hero-scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 0.4rem;
          animation: fadeInUp 1s ease-out 0.4s both;
        }

        .hero-scroll-indicator span {
          font-size: 0.9rem;
          opacity: 0.8;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .scroll-arrow {
          font-size: 1.5rem;
          animation: bounce 2s infinite;
        }

        /* Contact Main Section */
        .contact-main-section {
          padding: 6rem 0;
          background: white;
          position: relative;
          z-index: 1;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          margin-bottom: 6rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .section-header p {
          font-size: 1.2rem;
          color: #6b7280;
        }

        /* Contact Form Section */
        .contact-form-section {
          background: #f8fafc;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-group {
          position: relative;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 1rem 0;
          border: none;
          background: transparent;
          font-size: 1rem;
          color: #1f2937;
          border-bottom: 2px solid #e5e7eb;
          transition: all 0.3s ease;
          resize: vertical;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-bottom-color: #f59e0b;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #9ca3af;
        }

        .input-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #f59e0b, #d97706);
          transition: width 0.3s ease;
        }

        .form-group input:focus ~ .input-underline,
        .form-group textarea:focus ~ .input-underline {
          width: 100%;
        }

        /* Submit Button - Yellow Theme */
        .submit-btn {
          background: #f59e0b;
          color: white;
          border: none;
          padding: 1.2rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
        }

        .submit-btn:hover:not(:disabled) {
          background: #d97706;
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(245, 158, 11, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .submit-btn.submitting {
          background: #6b7280;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Success Message */
        .success-message {
          text-align: center;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 20px;
          color: white;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          margin: 0 auto 1.5rem;
          animation: bounceIn 0.6s ease-out;
        }

        .success-message h3 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }

        /* Contact Info Section */
        .contact-info-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .contact-info-card {
          background: #f8fafc;
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .contact-info-card h3 {
          font-size: 1.8rem;
          color: #1f2937;
          margin-bottom: 2rem;
          text-align: center;
        }

        .contact-items {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .contact-item:hover {
          background: rgba(245, 158, 11, 0.05);
          transform: translateX(5px);
        }

        .contact-icon {
          font-size: 1.5rem;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .contact-details h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .contact-details p {
          color: #6b7280;
          line-height: 1.5;
        }

        /* Social Links */
        .social-links {
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .social-links h4 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #374151;
        }

        .social-icons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .social-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
        }

        /* Map Section */
        .map-section {
          background: #f8fafc;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .map-section h3 {
          font-size: 1.5rem;
          color: #1f2937;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .map-container {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .map-placeholder {
          position: relative;
          height: 300px;
          background: linear-gradient(135deg, #e5e7eb, #d1d5db);
        }

        .map-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(245, 158, 11, 0.1);
          color: #1f2937;
          z-index: 2;
        }

        .map-pin {
          font-size: 3rem;
          margin-bottom: 1rem;
          animation: bounce 2s infinite;
        }

        .map-frame {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .map-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.7;
        }

        /* Quick Contact Section */
        .quick-contact-section {
          margin-top: 4rem;
        }

        .quick-contact-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .quick-card {
          background: #f8fafc;
          border-radius: 20px;
          padding: 2.5rem 2rem;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .quick-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .card-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        .quick-card h4 {
          font-size: 1.3rem;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .quick-card p {
          color: #6b7280;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .card-btn {
          background: #f59e0b;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          width: 100%;
        }

        .card-btn:hover {
          background: #d97706;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
        }

        /* Animations */
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .quick-contact-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .fullscreen-hero {
            padding-top: 70px;
          }

          .hero-title {
            font-size: 3.5rem;
          }

          .hero-subtitle {
            font-size: 1.4rem;
          }

          .contact-form-section,
          .contact-info-card,
          .map-section {
            padding: 2rem;
          }

          .quick-contact-grid {
            grid-template-columns: 1fr;
          }

          .container {
            padding: 0 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2.8rem;
          }

          .hero-subtitle {
            font-size: 1.2rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .contact-form-section,
          .contact-info-card,
          .map-section,
          .quick-card {
            padding: 1.5rem;
          }

          .contact-item {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .social-icons {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}