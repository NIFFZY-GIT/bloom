"use client";

import { useState } from 'react';

// --- Assets & Icons ---
const iconSet = {
  arrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
  ),
  phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  ),
  mapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  whatsapp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
  ),
  check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  star: () => (
     <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  )
};

// --- Data ---
const journeySteps = [
  {
    step: '01',
    title: 'The Wishlist',
    copy: 'Tell us your rhythm. Do you prefer sunrise hikes or slow mornings? Ancient ruins or boutique cafes? We start with your vision.'
  },
  {
    step: '02',
    title: 'The Blueprint',
    copy: 'Within 48 hours, receive a digital mood board and itinerary, complete with curated stays and logistics pricing.'
  },
  {
    step: '03',
    title: 'The Refinement',
    copy: 'Collaborate with your planner via WhatsApp or video call to tweak the details until the journey feels uniquely yours.'
  }
];

const offices = [
  {
    label: 'Experience Studio',
    address: '118/7 Stratford Ave, Colombo 06',
    note: 'By appointment only',
    icon: iconSet.mapPin
  },
  {
    label: 'Concierge Hotline',
    address: '+94 77 123 4567',
    note: '08:00 - 22:00 Daily',
    icon: iconSet.phone
  },
  {
    label: 'Planning Team',
    address: 'hello@tropicalbloom.lk',
    note: 'Itineraries & Quotes',
    icon: iconSet.mail
  }
];

export default function ContactRedesign() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelers: '2',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="page-wrapper">
      
      {/* Background Decorative Elements */}
      <div className="bg-noise"></div>
      
      {/* --- HERO SECTION --- */}
      <section className="hero">
        <div className="hero-content">
          <span className="pill">Est. Colombo, 2018</span>
          <h1>Curate your escape.</h1>
          <p className="hero-sub">
            We bridge the gap between boutique luxury and authentic local culture. 
            Tell us where you want to go, and we'll handle the how.
          </p>
          
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-val">4.9<span className="star-icon">{iconSet.star()}</span></span>
              <span className="stat-label">Guest Rating</span>
            </div>
            <div className="divider"></div>
            <div className="stat">
              <span className="stat-val">&lt; 6 hrs</span>
              <span className="stat-label">Reply Time</span>
            </div>
            <div className="divider"></div>
            <div className="stat">
              <span className="stat-val">100%</span>
              <span className="stat-label">Tailor Made</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN INTERACTION CARD --- */}
      <section className="overlap-section">
        <div className="main-card">
          
          {/* Left: Contact Info */}
          <div className="card-sidebar">
            <div className="sidebar-header">
              <h3>Get in touch</h3>
              <p>Prefer a direct line? Reach our Colombo studio directly.</p>
            </div>
            
            <div className="office-list">
              {offices.map((office, i) => (
                <div key={i} className="office-item">
                  <div className="icon-box">
                    <office.icon />
                  </div>
                  <div className="office-details">
                    <span className="office-label">{office.label}</span>
                    <span className="office-addr">{office.address}</span>
                    <span className="office-note">{office.note}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="sidebar-footer">
              <div className="wa-box">
                <div className="wa-header">
                  <iconSet.whatsapp />
                  <span>Quick Chat</span>
                </div>
                <p>Need a quick answer? WhatsApp our on-ground concierge.</p>
                <a href="#" className="link-arrow">Start chat →</a>
              </div>
            </div>
          </div>

          {/* Right: The Form */}
          <div className="card-form">
            {isSubmitted ? (
              <div className="success-message">
                <div className="check-circle">{iconSet.check()}</div>
                <h2>Request Received</h2>
                <p>Thank you, {formData.name}. Our planning team is reviewing your details. Expect a personal blueprint in your inbox within 6 hours.</p>
                <button onClick={() => setIsSubmitted(false)} className="reset-btn">Start new enquiry</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-header">
                  <h2>Start planning</h2>
                  <p>Share a few details to get the ball rolling.</p>
                </div>

                <div className="input-group">
                  <div className="field">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="e.g. Suren Perera" 
                      required 
                    />
                  </div>
                  <div className="field">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="e.g. hello@tropicalbloom.lk" 
                      required 
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="field">
                    <label>Phone (Optional)</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="+94 ..." 
                    />
                  </div>
                  <div className="field">
                    <label>No. of Travelers</label>
                    <select name="travelers" value={formData.travelers} onChange={handleChange}>
                      {[1,2,3,4,5,6,'7+'].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                    </select>
                  </div>
                </div>

                <div className="field full">
                  <label>Tell us about your dream trip</label>
                  <textarea 
                    name="message" 
                    rows={4} 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="Approximate dates, interests (beaches, tea country, safari), or specific hotels you love..."
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className={`submit-btn ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Request Itinerary'}
                    {!isSubmitting && <iconSet.arrowRight />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* --- TIMELINE SECTION --- */}
      <section className="timeline-section">
        <div className="timeline-header">
          <h2>How we craft your journey</h2>
        </div>
        <div className="steps-container">
          <div className="center-line"></div>
          {journeySteps.map((step, i) => (
            <div key={i} className="step-row">
              <div className="step-marker">{step.step}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER STRIP --- */}
      <section className="map-strip">
        <div className="map-overlay">
          <p>Tropical Bloom — Experience Studio</p>
          <h3>Colombo, Sri Lanka</h3>
          <a href="#">View on Google Maps</a>
        </div>
        <div className="map-frame">
          <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467112139!2d79.85275541532638!3d6.92706619500827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259130df8cb3d%3A0xcb2d5bceae83c41!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1633021634345!5m2!1sen!2us"
             loading="lazy"
             title="Map"
          ></iframe>
        </div>
      </section>

      <style jsx>{`
        /* --- DESIGN TOKENS --- */
        .page-wrapper {
          --sand-50: #fcfbf9;
          --sand-100: #f3f0eb;
          --sand-200: #e6e2db;
          --jungle-900: #0f2a1f;
          --jungle-800: #1a4133;
          --amber-500: #d97706;
          --amber-600: #b45309;
          
          --font-serif: "Georgia", "Times New Roman", serif;
          --font-sans: system-ui, -apple-system, sans-serif;
          
          color: var(--jungle-900);
          background-color: var(--sand-50);
          font-family: var(--font-sans);
          overflow-x: hidden;
        }

        /* --- UTILS --- */
        .bg-noise {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          opacity: 0.03;
          pointer-events: none;
          z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        /* --- HERO --- */
        .hero {
          position: relative;
          z-index: 1;
          background-color: var(--jungle-900);
          color: var(--sand-50);
          padding: 6rem 1.5rem 10rem; /* Bottom padding creates overlap space */
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .pill {
          display: inline-block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 0.5rem 1rem;
          border-radius: 99px;
          margin-bottom: 2rem;
          color: rgba(255,255,255,0.8);
        }

        h1 {
          font-family: var(--font-serif);
          font-size: clamp(3rem, 6vw, 4.5rem);
          font-weight: 400;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .hero-sub {
          font-size: 1.15rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          max-width: 50ch;
          margin: 0 auto 3.5rem;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-val {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .star-icon {
          color: var(--amber-500);
          width: 16px;
          height: 16px;
        }

        .stat-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.5;
          margin-top: 0.2rem;
        }

        .divider {
          width: 1px;
          height: 30px;
          background: rgba(255,255,255,0.15);
        }

        /* --- OVERLAP SECTION (The Card) --- */
        .overlap-section {
          position: relative;
          z-index: 2;
          margin-top: -6rem; /* The overlap magic */
          padding: 0 1.5rem 4rem;
        }

        .main-card {
          max-width: 1100px;
          margin: 0 auto;
          background: white;
          border-radius: 4px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          display: grid;
          grid-template-columns: 350px 1fr;
          overflow: hidden;
        }

        /* Sidebar Styles */
        .card-sidebar {
          background: var(--sand-100);
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 3rem;
          border-right: 1px solid var(--sand-200);
        }

        .sidebar-header h3 {
          font-family: var(--font-serif);
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          font-weight: 400;
        }

        .sidebar-header p {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.5;
        }

        .office-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .office-item {
          display: flex;
          gap: 1rem;
        }

        .icon-box {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          border: 1px solid var(--sand-200);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--amber-600);
          flex-shrink: 0;
        }
        
        .icon-box svg { width: 18px; height: 18px; }

        .office-details {
          display: flex;
          flex-direction: column;
        }

        .office-label {
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 0.2rem;
        }
        
        .office-addr {
          font-size: 0.9rem;
          color: #444;
        }

        .office-note {
          font-size: 0.8rem;
          color: #888;
          margin-top: 0.2rem;
        }

        .wa-box {
          background: #dcfce7; /* Light green */
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #bbf7d0;
        }

        .wa-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #166534;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .wa-header svg { width: 20px; height: 20px; }

        .wa-box p {
          font-size: 0.85rem;
          color: #14532d;
          line-height: 1.4;
          margin-bottom: 1rem;
        }

        .link-arrow {
          font-size: 0.85rem;
          font-weight: 700;
          color: #166534;
          text-decoration: none;
        }
        .link-arrow:hover { text-decoration: underline; }

        /* Form Styles */
        .card-form {
          padding: 3rem 4rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .form-header {
          margin-bottom: 2.5rem;
        }

        .form-header h2 {
          font-family: var(--font-serif);
          font-size: 2rem;
          margin-bottom: 0.5rem;
          font-weight: 400;
        }
        
        .form-header p {
          color: #666;
        }

        .input-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .field.full {
          margin-bottom: 2.5rem;
        }

        label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          color: #888;
        }

        input, select, textarea {
          width: 100%;
          border: none;
          border-bottom: 1px solid #ddd;
          padding: 0.75rem 0;
          font-family: var(--font-serif); /* Serif inputs feel more elegant */
          font-size: 1.1rem;
          background: transparent;
          color: var(--jungle-900);
          transition: border-color 0.2s;
          border-radius: 0;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-bottom-color: var(--amber-500);
        }
        
        textarea {
          resize: vertical;
        }

        .submit-btn {
          background: var(--jungle-900);
          color: white;
          border: none;
          padding: 1rem 2rem;
          font-size: 1rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: background 0.2s, transform 0.2s;
        }

        .submit-btn svg { width: 18px; height: 18px; }

        .submit-btn:hover {
          background: var(--jungle-800);
          transform: translateY(-2px);
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        /* Success State */
        .success-message {
          text-align: center;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .check-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #dcfce7;
          color: #166534;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .check-circle svg { width: 30px; height: 30px; }

        .success-message h2 {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }
        
        .success-message p {
          color: #555;
          line-height: 1.6;
          max-width: 400px;
          margin-bottom: 2rem;
        }

        .reset-btn {
          background: none;
          border: none;
          color: var(--amber-600);
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }

        /* --- TIMELINE --- */
        .timeline-section {
          padding: 4rem 1.5rem 6rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .timeline-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .timeline-header h2 {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          font-weight: 400;
        }

        .steps-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        .center-line {
          position: absolute;
          left: 24px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: #ddd;
          z-index: 0;
        }

        .step-row {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 2rem;
        }

        .step-marker {
          width: 50px;
          height: 50px;
          background: var(--sand-50);
          border: 1px solid var(--amber-500);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-serif);
          font-weight: 600;
          color: var(--amber-600);
          flex-shrink: 0;
        }

        .step-content h3 {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          font-weight: 400;
        }

        .step-content p {
          color: #666;
          line-height: 1.6;
        }

        /* --- MAP STRIP --- */
        .map-strip {
          position: relative;
          height: 350px;
          background: #e5e5e5;
        }

        .map-frame {
          width: 100%;
          height: 100%;
        }
        
        .map-frame iframe {
          width: 100%;
          height: 100%;
          border: 0;
          filter: grayscale(100%); /* Elegant B&W map */
          opacity: 0.8;
        }

        .map-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 2rem 3rem;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          z-index: 10;
        }

        .map-overlay h3 {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          margin: 0.5rem 0 1rem;
        }

        .map-overlay a {
          color: var(--amber-600);
          font-weight: 600;
          text-decoration: none;
        }

        /* --- MEDIA QUERIES --- */
        @media (max-width: 900px) {
          .main-card {
            grid-template-columns: 1fr;
          }
          
          .card-sidebar {
            flex-direction: row;
            flex-wrap: wrap;
            padding: 2rem;
            gap: 2rem;
          }
          
          .sidebar-footer {
            width: 100%;
          }

          .card-form {
            padding: 2rem;
          }
        }

        @media (max-width: 600px) {
          .input-group {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .card-sidebar {
            flex-direction: column;
          }

          h1 {
            font-size: 2.5rem;
          }

          .map-overlay {
            width: 90%;
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}