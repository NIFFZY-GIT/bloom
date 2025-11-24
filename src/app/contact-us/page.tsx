"use client";

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

  const iconSet = {
    location: () => (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M12 22s7-6.1 7-12A7 7 0 0 0 5 10c0 5.9 7 12 7 12z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="10" r="2.5" fill="currentColor" />
      </svg>
    ),
    phone: () => (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M6.5 5.1c-.3-1 .6-2 1.7-1.7l2.3.6c.8.2 1.3 1.1 1 1.9l-.5 1.3a1.4 1.4 0 0 0 .3 1.5l4.4 4.4a1.4 1.4 0 0 0 1.5.3l1.3-.5c.8-.3 1.7.2 1.9 1l.6 2.3c.3 1-.7 2-1.7 1.7-4.1-1-7.8-3.3-10.7-6.2C9.8 10 7.5 6.3 6.5 2.2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    mail: () => (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="5" width="18" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    clock: () => (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v4l2.5 1.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    chat: () => (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M5 18v-8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-4l-4 3v-3H8a3 3 0 0 1-3-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    calendar: () => (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="5" width="18" height="16" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 3v4m8-4v4M3 11h18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  } as const;

  type IconKey = keyof typeof iconSet;

  const contactInfo = [
    {
      icon: 'location' as IconKey,
      title: 'Visit Us',
      details: 'No. 123, Galle Road\nColombo 03, Sri Lanka'
    },
    {
      icon: 'phone' as IconKey,
      title: 'Call Us',
      details: '+94 11 234 5678\n+94 77 123 4567'
    },
    {
      icon: 'mail' as IconKey,
      title: 'Email Us',
      details: 'info@srilankatourism.lk\nbookings@srilankatourism.lk'
    },
    {
      icon: 'clock' as IconKey,
      title: 'Business Hours',
      details: 'Monday - Friday: 8:00 AM - 6:00 PM\nWeekends: 9:00 AM - 4:00 PM'
    }
  ];

  const quickContacts = [
    {
      icon: 'chat' as IconKey,
      title: 'Live Chat',
      description: 'Chat with our travel experts in real-time',
      button: 'Start Chat'
    },
    {
      icon: 'phone' as IconKey,
      title: 'WhatsApp',
      description: 'Message us directly on WhatsApp',
      button: '+94 77 123 4567'
    },
    {
      icon: 'phone' as IconKey,
      title: 'Call Back',
      description: 'Request a free callback from our team',
      button: 'Request Call'
    },
    {
      icon: 'calendar' as IconKey,
      title: 'Visit Office',
      description: 'Schedule an in-person consultation',
      button: 'Book Appointment'
    }
  ];


  const highlightStats = [
    { label: 'Average response', value: '< 12 hrs' },
    { label: 'Happy travelers', value: '25K+' },
    { label: 'Countries served', value: '18' }
  ];

  const contactPerks = [
    'Dedicated travel concierge assigned to every enquiry',
    'Tailor-made itineraries delivered within 48 hours',
    'Multilingual consultants available across time zones'
  ];

  const conciergeCta = {
    phoneLabel: '+94 77 123 4567',
    phoneHref: 'tel:+94771234567',
    emailLabel: 'hello@tropicalbloom.lk',
    emailHref: 'mailto:hello@tropicalbloom.lk'
  };

  return (
    <div className="contact-page">
      {/* Full Screen Hero Section */}
      <section className="fullscreen-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-pill">Sri Lanka&apos;s boutique travel studio</span>
            <h1 className="hero-title">Get In Touch</h1>
            <p className="hero-subtitle">
              Ready to plan your perfect Sri Lankan adventure? Let&apos;s start the conversation.
            </p>
            <ul className="hero-meta-list">
              <li>Dedicated travel concierge on every enquiry</li>
              <li>Response guaranteed within 12 business hours</li>
            </ul>
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
                <p>We&apos;ll get back to you within 24 hours</p>
              </div>
              <ul className="form-perks">
                {contactPerks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>

              {isSubmitted ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for contacting us. We&apos;ll get back to you soon.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
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
                        <div className="contact-icon">
                          {iconSet[item.icon] ? iconSet[item.icon]() : item.title.charAt(0)}
                        </div>
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

          {/* Quick Contact Section */}
          <section className="quick-contact-section">
            <div className="section-header">
              <h2>Other Ways to Connect</h2>
              <p>Choose your preferred way to reach out to us</p>
            </div>
            
            <div className="quick-contact-grid">
              {quickContacts.map((contact, index) => (
                <div key={index} className="quick-card">
                  <div className="card-icon">
                    {iconSet[contact.icon] ? iconSet[contact.icon]() : contact.title.charAt(0)}
                  </div>
                  <h4>{contact.title}</h4>
                  <p>{contact.description}</p>
                  <button className="card-btn">{contact.button}</button>
                </div>
              ))}
            </div>
          </section>

          <section className="concierge-section">
            <div className="concierge-card">
              <div className="concierge-copy">
                <p className="eyebrow">Need immediate support?</p>
                <h3>Speak with our concierge team</h3>
                <p className="concierge-note">Available daily 08:00 – 22:00 (GMT+5:30)</p>
              </div>
              <div className="concierge-actions">
                <a href={conciergeCta.phoneHref} className="concierge-btn primary">
                  Call {conciergeCta.phoneLabel}
                </a>
                <a href={conciergeCta.emailHref} className="concierge-btn secondary">
                  Email {conciergeCta.emailLabel}
                </a>
              </div>
            </div>
          </section>
        </div>
      </section>

      <style jsx>{`
        .contact-page {
          min-height: 100vh;
          margin-top: 0;
        }

        /* Container */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* Full Screen Hero Section - Mobile First */
        .fullscreen-hero {
          height: 100vh;
          min-height: 600px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
          margin-top: 0;
          padding: 1rem;
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
          width: 100%;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        }

        .hero-text {
          margin-bottom: 2rem;
          text-align: center;
          width: 100%;
        }

        .hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 1.15rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          background: rgba(17, 24, 39, 0.45);
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }

        .hero-meta-list {
          list-style: none;
          padding: 0;
          margin: 1.5rem auto 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.95rem;
          color: rgba(255,255,255,0.85);
        }

        .hero-meta-list li {
          display: flex;
          justify-content: center;
          gap: 0.4rem;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
          line-height: 1.1;
          animation: fadeInUp 1s ease-out;
          text-align: center;
          width: 100%;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          font-weight: 300;
          opacity: 0.95;
          margin-bottom: 2rem;
          text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
          animation: fadeInUp 1s ease-out 0.2s both;
          line-height: 1.5;
          text-align: center;
          width: 100%;
        }

        /* FIXED: Hero Scroll Indicator - Proper Centering */
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
          font-size: 0.8rem;
          opacity: 0.8;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
          text-align: center;
          white-space: nowrap;
        }

        .scroll-arrow {
          font-size: 1.2rem;
          animation: bounce 2s infinite;
          display: flex;
          justify-content: center;
          width: 100%;
        }

        /* Contact Main Section */
        .contact-main-section {
          padding: 3rem 0;
          background: white;
          position: relative;
          z-index: 1;
        }

        .contact-grid {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          margin-bottom: 4rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-perks {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-perks li {
          font-size: 0.95rem;
          color: #475569;
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .form-perks li::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          display: inline-flex;
        }

        .section-header h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .section-header p {
          font-size: 1rem;
          color: #6b7280;
        }

        /* Contact Form Section */
        .contact-form-section {
          background: #f8fafc;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
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

        /* Submit Button */
        .submit-btn {
          background: #f59e0b;
          color: white;
          border: none;
          padding: 1.2rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
          width: 100%;
        }

        .submit-btn:hover:not(:disabled) {
          background: #d97706;
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(245, 158, 11, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .submit-btn.submitting {
          background: #6b7280;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Success Message */
        .success-message {
          text-align: center;
          padding: 2.5rem 1.5rem;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 16px;
          color: white;
        }

        .success-icon {
          width: 70px;
          height: 70px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 1.5rem;
          animation: bounceIn 0.6s ease-out;
        }

        .success-message h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .success-message p {
          font-size: 1rem;
          line-height: 1.5;
        }

        /* Contact Info Section */
        .contact-info-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .contact-info-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .contact-info-card h3 {
          font-size: 1.5rem;
          color: #1f2937;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .contact-items {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
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
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: white;
        }

        .contact-icon svg {
          width: 22px;
          height: 22px;
        }

        .contact-details h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .contact-details p {
          color: #6b7280;
          line-height: 1.5;
          font-size: 0.9rem;
        }

        /* Social Links */
        .social-links {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .social-links h4 {
          text-align: center;
          margin-bottom: 1.25rem;
          color: #374151;
          font-size: 1.1rem;
        }

        .social-icons {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .social-icon {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }

        .social-icon:hover {
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 6px 15px rgba(245, 158, 11, 0.3);
        }

        /* Map Section */
        .map-section {
          background: #f8fafc;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .map-section h3 {
          font-size: 1.3rem;
          color: #1f2937;
          margin-bottom: 1.25rem;
          text-align: center;
        }

        .map-container {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }

        .map-frame {
          border-radius: 10px;
          overflow: hidden;
        }

        /* Quick Contact Section */
        .quick-contact-section {
          margin-top: 3rem;
        }

        .quick-contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .quick-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 2rem 1.5rem;
          text-align: center;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .quick-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .card-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: rgba(245, 158, 11, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          color: var(--primary);
        }

        .card-icon svg {
          width: 26px;
          height: 26px;
        }

        .quick-card h4 {
          font-size: 1.2rem;
          color: #1f2937;
          margin-bottom: 0.75rem;
        }

        .quick-card p {
          color: #6b7280;
          margin-bottom: 1.5rem;
          line-height: 1.5;
          font-size: 0.95rem;
        }

        .card-btn {
          background: #f59e0b;
          color: white;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          width: 100%;
          font-size: 0.9rem;
        }

        .card-btn:hover {
          background: #d97706;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(245, 158, 11, 0.3);
        }

        .concierge-section {
          margin-top: 3rem;
        }

        .concierge-card {
          background: linear-gradient(135deg, #0f172a, #1e293b);
          color: white;
          border-radius: 24px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.4);
        }

        .concierge-copy h3 {
          font-size: 1.6rem;
          margin: 0.4rem 0;
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
        }

        .concierge-note {
          color: rgba(255,255,255,0.8);
          margin: 0;
        }

        .concierge-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .concierge-btn {
          text-decoration: none;
          padding: 0.85rem 1.5rem;
          border-radius: 999px;
          font-weight: 600;
          text-align: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .concierge-btn.primary {
          background: white;
          color: #0f172a;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.25);
        }

        .concierge-btn.secondary {
          border: 1px solid rgba(255,255,255,0.4);
          color: white;
        }

        .concierge-btn:hover {
          transform: translateY(-2px);
        }

        /* Animations */
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
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

        /* Tablet Styles */
        @media (min-width: 768px) {
          .container {
            padding: 0 2rem;
          }

          .fullscreen-hero {
            padding: 2rem;
          }

          .hero-title {
            font-size: 3.5rem;
          }

          .hero-subtitle {
            font-size: 1.4rem;
          }

          .contact-main-section {
            padding: 4rem 0;
          }

          .contact-grid {
            gap: 4rem;
            margin-bottom: 5rem;
          }

          .section-header h2 {
            font-size: 2.2rem;
          }

          .section-header p {
            font-size: 1.1rem;
          }

          .contact-form-section {
            padding: 2.5rem;
          }

          .form-row {
            flex-direction: row;
          }

          .submit-btn {
            width: auto;
            padding: 1.2rem 2.5rem;
          }

          .contact-info-card,
          .map-section {
            padding: 2.5rem;
          }

          .quick-contact-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }

          .quick-card {
            padding: 2.5rem 2rem;
          }

          .concierge-card {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          .concierge-actions {
            flex-direction: row;
            align-items: center;
            gap: 1rem;
          }

          .concierge-btn {
            min-width: 180px;
          }
        }

        /* Desktop Styles */
        @media (min-width: 1024px) {
          .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            margin-bottom: 6rem;
          }

          .contact-main-section {
            padding: 6rem 0;
          }

          .hero-title {
            font-size: 4.5rem;
          }

          .hero-subtitle {
            font-size: 1.6rem;
          }

          .contact-form-section {
            padding: 3rem;
          }

          .contact-info-card,
          .map-section {
            padding: 2.5rem;
          }

          .quick-contact-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
          }

          .quick-card {
            padding: 2.5rem 2rem;
          }

          .quick-card h4 {
            font-size: 1.3rem;
          }

          .hero-meta-list {
            flex-direction: row;
            justify-content: center;
          }
        }

        /* Large Desktop Styles */
        @media (min-width: 1280px) {
          .container {
            max-width: 1200px;
          }

          .hero-title {
            font-size: 5rem;
          }
        }

        /* Small Mobile Adjustments */
        @media (max-width: 380px) {
          .hero-title {
            font-size: 2.2rem;
          }

          .hero-subtitle {
            font-size: 1rem;
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
            gap: 0.75rem;
          }

          .contact-icon {
            margin: 0 auto;
          }

          .social-icons {
            gap: 0.5rem;
          }

          .social-icon {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}