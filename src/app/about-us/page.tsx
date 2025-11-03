
'use client';

import { useState } from 'react';



export default function AboutUs() {
  const [activeTab, setActiveTab] = useState('mission');

  const stats = [
    { number: '15+', label: 'Years Experience' },
    { number: '50K+', label: 'Happy Travelers' },
    { number: '200+', label: 'Destinations' },
    { number: '98%', label: 'Satisfaction Rate' }
  ];

  const values = [
    {
      icon: '🌱',
      title: 'Sustainable Tourism',
      description: 'We prioritize eco-friendly practices and support local communities.'
    },
    {
      icon: '💎',
      title: 'Authentic Experiences',
      description: 'Discover the real Sri Lanka through curated local experiences.'
    },
    {
      icon: '🤝',
      title: 'Personalized Service',
      description: 'Tailored journeys designed specifically for your preferences.'
    },
    {
      icon: '🛡️',
      title: 'Trust & Safety',
      description: 'Your safety and comfort are our highest priorities.'
    }
  ];

  const team = [
    {
      name: 'Sarah Perera',
      role: 'Founder & CEO',
      image: '/images/team/sarah.jpg',
      description: '15+ years in sustainable tourism'
    },
    {
      name: 'Rajiv Fernando',
      role: 'Head of Operations',
      image: '/images/team/rajiv.jpg',
      description: 'Expert in logistics and customer experience'
    },
    {
      name: 'Maya Silva',
      role: 'Travel Curator',
      image: '/images/team/maya.jpg',
      description: 'Local culture and adventure specialist'
    },
    {
      name: 'David Chen',
      role: 'Sustainability Director',
      image: '/images/team/david.jpg',
      description: 'Environmental conservation advocate'
    }
  ];

  return (
    <div className="about-us-page">
      {/* Full Screen Hero Section */}
      <section className="fullscreen-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Our Story</h1>
            <p className="hero-subtitle">
              Crafting unforgettable journeys through the heart of Sri Lanka since 2010
            </p>

            
            <div className="hero-scroll-indicator">
              <span>Scroll to explore</span>
              <div className="scroll-arrow">↓</div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="introduction-section">
        <div className="container">
          <div className="intro-grid">
            <div className="intro-content">
              <h2>Welcome to Tropical Bloom Tourism</h2>
              <p>
                Founded in 2010, Tropical Bloom Tourism emerged from a simple passion: 
                to share the breathtaking beauty and rich cultural tapestry of Sri Lanka 
                with the world. What started as a small family-run operation has blossomed 
                into one of Sri Lanka&apos;s most trusted travel curators.
              </p>
              <p>
                We believe that travel should be transformative, sustainable, and deeply 
                personal. Every journey we craft is a carefully woven tapestry of authentic 
                experiences, from misty mountain treks to golden beach sunsets, ancient 
                temple explorations to vibrant local market encounters.
              </p>
            </div>
            <div className="intro-image">
              <div className="image-frame">
                <div className="main-image"></div>
                <div className="accent-shape shape-1"></div>
                <div className="accent-shape shape-2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
            <p>The principles that guide every journey we create</p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Tabs Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-tabs">
            <button 
              className={`tab-button ${activeTab === 'mission' ? 'active' : ''}`}
              onClick={() => setActiveTab('mission')}
            >
              Our Mission
            </button>
            <button 
              className={`tab-button ${activeTab === 'vision' ? 'active' : ''}`}
              onClick={() => setActiveTab('vision')}
            >
              Our Vision
            </button>
            <button 
              className={`tab-button ${activeTab === 'approach' ? 'active' : ''}`}
              onClick={() => setActiveTab('approach')}
            >
              Our Approach
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'mission' && (
              <div className="content-panel">
                <h3>Creating Meaningful Connections</h3>
                <p>
                  Our mission is to bridge cultures and create meaningful connections 
                  between travelers and the soul of Sri Lanka. We go beyond typical 
                  tourism to deliver experiences that inspire, educate, and transform.
                </p>
                <ul>
                  <li>Promote sustainable travel practices</li>
                  <li>Support local communities and economies</li>
                  <li>Preserve cultural heritage</li>
                  <li>Create lifelong memories</li>
                </ul>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="content-panel">
                <h3>Leading Sustainable Tourism</h3>
                <p>
                  We envision a future where tourism becomes a powerful force for 
                  positive change - protecting natural wonders, empowering local 
                  communities, and creating economic opportunities while preserving 
                  cultural authenticity.
                </p>
                <ul>
                  <li>Become Sri Lanka&apos;s most sustainable tour operator by 2025</li>
                  <li>Expand community-based tourism initiatives</li>
                  <li>Pioneer carbon-neutral travel experiences</li>
                  <li>Set new standards for ethical tourism</li>
                </ul>
              </div>
            )}

            {activeTab === 'approach' && (
              <div className="content-panel">
                <h3>Personalized & Responsible</h3>
                <p>
                  Every journey begins with understanding your dreams and preferences. 
                  Our team of local experts then crafts a personalized itinerary that 
                  balances adventure, relaxation, culture, and sustainability.
                </p>
                <ul>
                  <li>In-depth consultation and planning</li>
                  <li>Local expert guides and hosts</li>
                  <li>Eco-friendly accommodations and transport</li>
                  <li>24/7 support throughout your journey</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Team</h2>
            <p>Passionate locals dedicated to creating your perfect Sri Lankan adventure</p>
          </div>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-image">
                  <div className="image-placeholder">{member.name.split(' ').map(n => n[0]).join('')}</div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <div className="member-role">{member.role}</div>
                  <p>{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Begin Your Journey?</h2>
            <p>
              Let us craft your perfect Sri Lankan adventure. Share your dreams, 
              and we&apos;ll make them a reality.
            </p>
            <div className="cta-buttons">
              <button className="explore-button">Explore Packages</button>
              <button className="contact-button">Contact Us</button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-us-page {
          min-height: 100vh;
          margin-top: 0; /* Remove any margin that might cause overlap */
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
  background: url('/images/about-hero.jpg') center/cover no-repeat;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6));
}

/* Centered hero content */
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

/* Hero text styling */
.hero-text {
  margin-bottom: 80px; /* Adds space above scroll text */
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

/* Scroll indicator placed at bottom of hero */
.hero-scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 0%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.4rem;
  width: 100%;
  animation: fadeInUp 1s ease-out 0.4s both;
}

.hero-scroll-indicator span {
  font-size: 0.9rem;
  opacity: 0.8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: block;
  width: 100%;
  text-align: center;
}

.scroll-arrow {
  font-size: 1.5rem;
  animation: bounce 2s infinite;
  display: flex;
  justify-content: center;
  width: 100%;
}

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

        /* Introduction Section */
        .introduction-section {
          padding: 6rem 0;
          background: white;
          position: relative;
          z-index: 1; /* Ensure it's above the hero */
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .intro-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .intro-content h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .intro-content p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        .intro-image {
          position: relative;
        }

        .image-frame {
          position: relative;
          width: 100%;
          height: 400px;
        }

        .main-image {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-radius: 20px;
          position: relative;
          z-index: 2;
        }

        .accent-shape {
          position: absolute;
          border-radius: 15px;
          background: linear-gradient(135deg, #059669, #10b981);
        }

        .shape-1 {
          width: 100px;
          height: 100px;
          top: -20px;
          left: -20px;
          z-index: 1;
        }

        .shape-2 {
          width: 80px;
          height: 80px;
          bottom: -15px;
          right: -15px;
          z-index: 1;
        }

        /* Stats Section */
        .stats-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #fefce8, #fef3c7);
          position: relative;
          z-index: 1;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .stat-card {
          text-align: center;
          padding: 2rem;
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 800;
          color: #d97706;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 1.1rem;
          color: #92400e;
          font-weight: 600;
        }

        /* Values Section */
        .values-section {
          padding: 6rem 0;
          background: white;
          position: relative;
          z-index: 1;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
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

        .values-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3rem;
        }

        .value-card {
          text-align: center;
          padding: 3rem 2rem;
          background: #f8fafc;
          border-radius: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .value-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        .value-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .value-card p {
          color: #6b7280;
          line-height: 1.6;
        }

        /* Story Section */
        .story-section {
          padding: 6rem 0;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          position: relative;
          z-index: 1;
        }

        .story-tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 3rem;
          background: white;
          border-radius: 50px;
          padding: 0.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .tab-button {
          padding: 1rem 2rem;
          border: none;
          background: none;
          border-radius: 25px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab-button.active {
          background: #059669;
          color: white;
        }

        .tab-content {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .content-panel h3 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .content-panel p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .content-panel ul {
          list-style: none;
          padding: 0;
        }

        .content-panel li {
          padding: 0.5rem 0;
          color: #6b7280;
          position: relative;
          padding-left: 2rem;
        }

        .content-panel li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #059669;
          font-weight: bold;
        }

        /* Team Section */
        .team-section {
          padding: 6rem 0;
          background: white;
          position: relative;
          z-index: 1;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .team-card {
          text-align: center;
          padding: 2rem;
          background: #f8fafc;
          border-radius: 20px;
          transition: transform 0.3s ease;
        }

        .team-card:hover {
          transform: translateY(-5px);
        }

        .member-image {
          width: 120px;
          height: 120px;
          margin: 0 auto 1.5rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          font-weight: bold;
        }

        .member-info h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .member-role {
          color: #059669;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .member-info p {
          color: #6b7280;
          font-size: 0.9rem;
        }

        /* CTA Section */
        .cta-section {
          padding: 6rem 0;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: white;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .cta-content p {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .explore-button {
          background: #f59e0b;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .explore-button:hover {
          background: #d97706;
          transform: translateY(-2px);
        }

        .contact-button {
          background: transparent;
          color: white;
          border: 2px solid white;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .contact-button:hover {
          background: white;
          color: #1e293b;
          transform: translateY(-2px);
        }

        /* Animations */
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

        /* Responsive Design */
        @media (max-width: 1024px) {
          .intro-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }

          .team-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .fullscreen-hero {
            padding-top: 70px; /* Adjust for mobile navbar */
          }

          .hero-title {
            font-size: 3.5rem;
          }

          .hero-subtitle {
            font-size: 1.4rem;
          }

          .hero-content {
            margin-top: -20px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .story-tabs {
            flex-direction: column;
            border-radius: 15px;
          }

          .tab-button {
            border-radius: 10px;
            margin-bottom: 0.5rem;
          }

          .tab-content {
            padding: 2rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .explore-button,
          .contact-button {
            width: 100%;
            max-width: 300px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2.8rem;
          }

          .hero-subtitle {
            font-size: 1.2rem;
          }

          .container {
            padding: 0 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .team-grid {
            grid-template-columns: 1fr;
          }

          .value-card {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}