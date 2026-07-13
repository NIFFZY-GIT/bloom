"use client";

import { useState, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { 
  FaArrowRight, FaPhone, FaEnvelope, 
  FaMapMarkerAlt, FaWhatsapp, FaCheck, FaStar 
} from 'react-icons/fa';

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
    Icon: FaMapMarkerAlt
  },
  {
    label: 'Concierge Hotline',
    address: '+94 77 123 4567',
    note: '08:00 - 22:00 Daily',
    Icon: FaPhone
  },
  {
    label: 'Planning Team',
    address: 'hello@tropicalbloom.lk',
    note: 'Itineraries & Quotes',
    Icon: FaEnvelope
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      <div className="bg-noise"></div>
      
      {/* --- HERO SECTION --- */}
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="pill">Est. Colombo, 2018</span>
          <h1>Curate your escape.</h1>
          <p className="hero-sub">
            We bridge the gap between boutique luxury and authentic local culture. 
            Tell us where you want to go, and we&apos;ll handle the how.
          </p>
          
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-val">4.9 <FaStar className="star-icon" /></span>
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
        </motion.div>
      </section>

      {/* --- MAIN INTERACTION CARD --- */}
      <section className="overlap-section">
        <motion.div 
          className="main-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          
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
                    <office.Icon />
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
                  <FaWhatsapp size={20} />
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
              <motion.div 
                className="success-message"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="check-circle"><FaCheck /></div>
                <h2>Request Received</h2>
                <p>Thank you, {formData.name}. Our planning team is reviewing your details. Expect a personal blueprint in your inbox within 6 hours.</p>
                <button onClick={() => setIsSubmitted(false)} className="reset-btn">Start new enquiry</button>
              </motion.div>
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
                    placeholder="Approximate dates, interests (beaches, tea country, safari)..."
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className={`submit-btn ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Request Itinerary'}
                    {!isSubmitting && <FaArrowRight />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </section>

      {/* --- TIMELINE SECTION --- */}
      <section className="timeline-section">
        <div className="timeline-header">
          <h2>How we craft your journey</h2>
        </div>
        <div className="steps-container">
          <div className="center-line"></div>
          {journeySteps.map((step, i) => (
            <motion.div 
              key={i} 
              className="step-row"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="step-marker">{step.step}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- MAP STRIP --- */}
      <section className="map-strip">
        <div className="map-overlay">
          <p className="text-amber-600 font-bold text-xs uppercase tracking-widest">Experience Studio</p>
          <h3>Colombo, Sri Lanka</h3>
          <a href="https://maps.google.com" target="_blank" rel="noreferrer">View on Google Maps</a>
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
        .page-wrapper {
          --nav-height: 80px; /* Adjust this to match your actual navbar height */
          --sand-50: #fdfcfb;
          --sand-100: #f7f3ef;
          --sand-200: #ece7e0;
          --jungle-900: #0c2a38;
          --jungle-800: #163d4f;
          --amber-500: #f59e0b;
          --amber-600: #d97706;
          
          color: var(--jungle-900);
          background-color: var(--sand-50);
          padding-top: var(--nav-height); /* FIX: This pushes content below navbar */
        }

        .bg-noise {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          opacity: 0.04;
          pointer-events: none;
          z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        /* --- HERO --- */
        .hero {
          background-color: var(--jungle-900);
          color: #fff;
          padding: 5rem 1.5rem 12rem;
          text-align: center;
          position: relative;
        }

        .pill {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 0.6rem 1.2rem;
          border-radius: 99px;
          margin-bottom: 2.5rem;
          color: var(--amber-500);
        }

        h1 {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 800;
          line-height: 1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
        }

        .hero-sub {
          font-size: 1.2rem;
          line-height: 1.6;
          color: #a7bcc0;
          max-width: 600px;
          margin: 0 auto 4rem;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
        }

        .stat { display: flex; flex-direction: column; align-items: center; }
        .stat-val { font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
        .star-icon { color: var(--amber-500); font-size: 1rem; }
        .stat-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #7f979c; margin-top: 0.4rem; }
        .divider { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }

        /* --- CARD --- */
        .overlap-section {
          margin-top: -8rem;
          padding: 0 1.5rem 6rem;
          position: relative;
          z-index: 10;
        }

        .main-card {
          max-width: 1200px;
          margin: 0 auto;
          background: #fff;
          display: grid;
          grid-template-columns: 380px 1fr;
          border-radius: 20px;
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.15);
          overflow: hidden;
        }

        .card-sidebar {
          background: var(--sand-100);
          padding: 4rem 3rem;
          border-right: 1px solid var(--sand-200);
        }

        .sidebar-header h3 { font-size: 1.8rem; font-weight: 800; margin-bottom: 0.75rem; }
        .sidebar-header p { font-size: 0.95rem; color: #666; line-height: 1.5; margin-bottom: 3rem; }

        .office-list { display: flex; flex-direction: column; gap: 2.5rem; }
        .office-item { display: flex; gap: 1.25rem; }
        .icon-box { 
          width: 48px; height: 48px; background: #fff; border-radius: 12px; 
          display: flex; align-items: center; justify-content: center; 
          color: var(--amber-600); box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          flex-shrink: 0;
        }
        .office-label { display: block; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.25rem; }
        .office-addr { display: block; font-size: 0.95rem; color: #333; }
        .office-note { display: block; font-size: 0.8rem; color: #999; margin-top: 0.25rem; }

        .wa-box { 
          margin-top: 4rem; background: #eefdf5; padding: 1.5rem; 
          border-radius: 16px; border: 1px solid #d1fae5; 
        }
        .wa-header { display: flex; align-items: center; gap: 0.75rem; color: #065f46; font-weight: 700; margin-bottom: 0.5rem; }
        .wa-box p { font-size: 0.85rem; color: #065f46; margin-bottom: 1rem; }
        .link-arrow { font-weight: 700; color: #059669; text-decoration: none; }

        /* --- FORM --- */
        .card-form { padding: 4rem 5rem; }
        .form-header { margin-bottom: 3rem; }
        .form-header h2 { font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem; }
        .form-header p { color: #666; }

        .input-group { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
        .field { display: flex; flex-direction: column; gap: 0.6rem; }
        .field.full { margin-bottom: 2.5rem; }
        
        label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #999; letter-spacing: 0.05em; }
        input, select, textarea {
          padding: 1rem 0; border: none; border-bottom: 2px solid var(--sand-200);
          font-size: 1rem; font-weight: 500; transition: all 0.3s; background: transparent;
        }
        input:focus, select:focus, textarea:focus { outline: none; border-bottom-color: var(--amber-500); }

        .submit-btn {
          background: var(--jungle-900); color: #fff; border: none;
          padding: 1.25rem 2.5rem; border-radius: 12px; font-weight: 700;
          display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: 0.3s;
        }
        .submit-btn:hover { background: var(--amber-600); transform: translateY(-3px); }

        /* --- TIMELINE --- */
        .timeline-section { padding: 4rem 1.5rem 8rem; max-width: 900px; margin: 0 auto; }
        .timeline-header { text-align: center; margin-bottom: 5rem; }
        .timeline-header h2 { font-size: 2.5rem; font-weight: 800; }
        
        .steps-container { position: relative; display: flex; flex-direction: column; gap: 5rem; }
        .center-line { position: absolute; left: 24px; top: 0; bottom: 0; width: 2px; background: var(--sand-200); }
        .step-row { display: flex; gap: 3rem; position: relative; z-index: 1; }
        .step-marker { 
          width: 50px; height: 50px; background: #fff; border: 2px solid var(--amber-500); 
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-weight: 800; color: var(--amber-600); flex-shrink: 0;
        }
        .step-content h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
        .step-content p { line-height: 1.7; color: #666; }

        /* --- MAP --- */
        .map-strip { position: relative; height: 450px; overflow: hidden; }
        .map-frame { width: 100%; height: 100%; filter: grayscale(0.5) contrast(1.1); }
        .map-frame iframe { width: 100%; height: 100%; border: 0; }
        .map-overlay {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          background: #fff; padding: 2.5rem 4rem; border-radius: 20px; text-align: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1); z-index: 20;
        }
        .map-overlay h3 { font-size: 1.5rem; font-weight: 800; margin: 0.5rem 0 1rem; }
        .map-overlay a { color: var(--amber-600); font-weight: 700; text-decoration: none; border-bottom: 2px solid; }

        /* --- SUCCESS --- */
        .success-message { text-align: center; padding: 3rem 0; }
        .check-circle { 
          width: 80px; height: 80px; background: #d1fae5; color: #059669; 
          border-radius: 50%; display: flex; align-items: center; justify-content: center; 
          font-size: 2rem; margin: 0 auto 2rem; 
        }

        @media (max-width: 1024px) {
          .main-card { grid-template-columns: 1fr; }
          .card-sidebar { border-right: none; border-bottom: 1px solid var(--sand-200); }
          .card-form { padding: 3rem 2rem; }
        }

        @media (max-width: 640px) {
          .input-group { grid-template-columns: 1fr; }
          .hero-stats { flex-wrap: wrap; gap: 1.5rem; }
          .divider { display: none; }
          .map-overlay { width: 90%; padding: 2rem; }
        }
      `}</style>
    </div>
  );
}