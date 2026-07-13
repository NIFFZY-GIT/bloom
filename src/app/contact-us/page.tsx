"use client";

import { useState, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowRight, FaPhone, FaEnvelope, 
  FaMapMarkerAlt, FaWhatsapp, FaCheck, FaStar,
  FaCalendarAlt, FaUsers, FaCompass
} from 'react-icons/fa';

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

const contactChannels = [
  {
    label: 'Experience Studio',
    value: '118/7 Stratford Ave, Colombo 06',
    sub: 'By appointment only',
    Icon: FaMapMarkerAlt,
    link: 'https://maps.google.com'
  },
  {
    label: 'Concierge Hotline',
    value: '+94 77 123 4567',
    sub: '08:00 - 22:00 Daily',
    Icon: FaPhone,
    link: 'tel:+94771234567'
  },
  {
    label: 'Planning Team',
    value: 'hello@tropicalbloom.lk',
    sub: 'Itineraries & Quotes',
    Icon: FaEnvelope,
    link: 'mailto:hello@tropicalbloom.lk'
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
  const [activeField, setActiveField] = useState<string | null>(null);
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
      <section className="hero-section">
        <div className="hero-grid">
          <motion.div 
            className="hero-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="pill-badge">Est. Colombo, 2018</div>
            <h1>Let’s design your <span className="text-gradient">next escape</span>.</h1>
            <p className="hero-subtitle">
              We bridge the gap between bespoke luxury and authentic local culture. 
              Share your vision, and we’ll craft the perfect itinerary.
            </p>

            <div className="stats-strip">
              <div className="stat-item">
                <span className="stat-num">4.9 <FaStar className="star" /></span>
                <span className="stat-lbl">Guest Rating</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">&lt; 6 hrs</span>
                <span className="stat-lbl">Response Time</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">100%</span>
                <span className="stat-lbl">Tailor-Made</span>
              </div>
            </div>
          </motion.div>

          <div className="hero-right-deco">
            <div className="blob-1"></div>
            <div className="blob-2"></div>
          </div>
        </div>
      </section>

      {/* --- MAIN SPLIT INTERACTION --- */}
      <section className="interactive-section">
        <div className="split-grid">
          
          {/* Left Block: Communication Cards */}
          <motion.div 
            className="info-sidebar"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-intro">
              <span className="pre-title">Direct Channels</span>
              <h2>Prefer a swift connection?</h2>
              <p>Skip the forms entirely. Our Colombo studio planners are accessible via all major modern communication networks.</p>
            </div>

            <div className="channels-stack">
              {contactChannels.map((channel, i) => (
                <a href={channel.link} key={i} className="channel-card" target="_blank" rel="noreferrer">
                  <div className="channel-icon-wrapper">
                    <channel.Icon />
                  </div>
                  <div className="channel-meta">
                    <span className="channel-label">{channel.label}</span>
                    <span className="channel-value">{channel.value}</span>
                    <span className="channel-sub">{channel.sub}</span>
                  </div>
                </a>
              ))}
            </div>

            <div className="whatsapp-card-modern">
              <div className="wa-top">
                <div className="wa-badge"><FaWhatsapp /> Live Concierge</div>
                <div className="pulse-indicator"></div>
              </div>
              <p>On-the-ground support is available instantly via WhatsApp for rapid queries.</p>
              <a href="#" className="wa-action-btn">Launch Chat <FaArrowRight /></a>
            </div>
          </motion.div>

          {/* Right Block: Minimalist Glassmorphic Form */}
          <motion.div 
            className="form-container-glass"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div 
                  className="success-state"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  <div className="success-lottie-replacement">
                    <FaCheck />
                  </div>
                  <h3>Blueprint Initiated</h3>
                  <p>Thank you, <strong>{formData.name}</strong>. A dedicated curator will review your preferences and drop a digital mood board into your inbox within 6 hours.</p>
                  <button onClick={() => setIsSubmitted(false)} className="secondary-btn">Submit Another Request</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="modern-form">
                  <div className="form-head">
                    <h3>The Itinerary Brief</h3>
                    <p>Provide your fundamental parameters to initiate creative design.</p>
                  </div>

                  {/* Input Element */}
                  <div className={`floating-group ${activeField === 'name' || formData.name ? 'is-active' : ''}`}>
                    <label>Your Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onFocus={() => setActiveField('name')}
                      onBlur={() => setActiveField(null)}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className="grid-2-col">
                    <div className={`floating-group ${activeField === 'email' || formData.email ? 'is-active' : ''}`}>
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onFocus={() => setActiveField('email')}
                        onBlur={() => setActiveField(null)}
                        onChange={handleChange}
                        required 
                      />
                    </div>

                    <div className={`floating-group ${activeField === 'phone' || formData.phone ? 'is-active' : ''}`}>
                      <label>Phone Number (Optional)</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone}
                        onFocus={() => setActiveField('phone')}
                        onBlur={() => setActiveField(null)}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid-2-col">
                    <div className="custom-select-wrapper">
                      <label className="select-label"><FaUsers /> Number of Guests</label>
                      <select name="travelers" value={formData.travelers} onChange={handleChange}>
                        {[1,2,3,4,5,6,'7+'].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>

                    <div className="info-helper-box">
                      <FaCompass />
                      <span>Every detail is engineered 100% custom around your chosen speed.</span>
                    </div>
                  </div>

                  <div className={`floating-group textarea-group ${activeField === 'message' || formData.message ? 'is-active' : ''}`}>
                    <label>Tell us about your dream trip</label>
                    <textarea 
                      name="message" 
                      rows={4}
                      value={formData.message}
                      onFocus={() => setActiveField('message')}
                      onBlur={() => setActiveField(null)}
                      onChange={handleChange}
                      placeholder="Approximate dates, core interests (wildlife safari, tea estate stays, hidden beaches)..."
                      required
                    />
                  </div>

                  <button type="submit" className="prime-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="spinner"></span>
                    ) : (
                      <>
                        <span>Request Custom Itinerary</span>
                        <FaArrowRight className="arrow-icon" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* --- THE TIMELINE PROCESS --- */}
      <section className="process-section">
        <div className="container-narrow">
          <div className="process-header">
            <span className="pre-title">The Methodology</span>
            <h2>How your escape is materialized</h2>
          </div>

          <div className="modern-timeline">
            {journeySteps.map((step, i) => (
              <motion.div 
                key={i} 
                className="timeline-card-wrapper"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="timeline-index">{step.step}</div>
                <div className="timeline-body">
                  <h4>{step.title}</h4>
                  <p>{step.copy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- INTEGRATED MAP & FOOTER STRIP --- */}
      <section className="immersive-map-section">
        <div className="map-embed-container">
          <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467112139!2d79.85275541532638!3d6.92706619500827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259130df8cb3d%3A0xcb2d5bceae83c41!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1633021634345!5m2!1sen!2us"
             loading="lazy"
             title="Colombo Studio Map Location"
          ></iframe>
        </div>
        <div className="map-floating-details">
          <span className="tag">Headquarters</span>
          <h3>Colombo, Sri Lanka</h3>
          <p>Drop by the Experience Studio for a premium tea infusion tasting while we blueprint.</p>
          <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-link">Get Navigation Data →</a>
        </div>
      </section>

      {/* --- COMPREHENSIVE STYLING --- */}
      <style jsx>{`
        .page-wrapper {
          --nav-height: 80px;
          --clr-bg: #FAF8F5;
          --clr-surface: #FFFFFF;
          --clr-dark: #091D26;
          --clr-dark-muted: #334A54;
          --clr-accent: #C99646;
          --clr-accent-hover: #AF7E33;
          --clr-border: #E8E3DC;
          --clr-glass: rgba(255, 255, 255, 0.75);
          
          color: var(--clr-dark);
          background-color: var(--clr-bg);
          padding-top: var(--nav-height);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow-x: hidden;
        }

        .bg-noise {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        /* --- HERO --- */
        .hero-section {
          padding: 6rem 2rem 4rem;
          position: relative;
          z-index: 2;
        }
        .hero-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
        }
        .pill-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--clr-accent);
          background: rgba(201, 150, 70, 0.1);
          padding: 0.4rem 1rem;
          border-radius: 100px;
          margin-bottom: 1.5rem;
        }
        h1 {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
        }
        .text-gradient {
          color: var(--clr-accent);
          background: linear-gradient(135deg, var(--clr-accent), #8C6221);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 1.2rem;
          line-height: 1.6;
          color: var(--clr-dark-muted);
          max-width: 540px;
          margin-bottom: 3.5rem;
        }
        .stats-strip {
          display: flex;
          gap: 3.5rem;
          border-top: 1px solid var(--clr-border);
          padding-top: 2rem;
        }
        .stat-item { display: flex; flex-direction: column; }
        .stat-num { font-size: 1.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; }
        .star { color: var(--clr-accent); font-size: 1.1rem; }
        .stat-lbl { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--clr-dark-muted); margin-top: 0.25rem; }

        .hero-right-deco { position: relative; width: 100%; height: 100%; }
        .blob-1 {
          position: absolute; width: 300px; height: 300px; background: rgba(201, 150, 70, 0.08);
          border-radius: 50%; filter: blur(60px); top: -50px; right: 0;
        }

        /* --- SPLIT GRID INTERACTION --- */
        .interactive-section {
          padding: 2rem 2rem 6rem;
          position: relative;
          z-index: 2;
        }
        .split-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 450px 1fr;
          gap: 5rem;
          align-items: start;
        }
        .pre-title {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--clr-accent);
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .section-intro h2 { font-size: 2rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.01em; }
        .section-intro p { color: var(--clr-dark-muted); line-height: 1.6; margin-bottom: 2.5rem; }

        .channels-stack { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.5rem; }
        .channel-card {
          background: var(--clr-surface);
          border: 1px solid var(--clr-border);
          padding: 1.5rem;
          border-radius: 16px;
          display: flex;
          gap: 1.25rem;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .channel-card:hover {
          transform: translateY(-2px);
          border-color: var(--clr-accent);
          box-shadow: 0 12px 30px rgba(9, 29, 38, 0.04);
        }
        .channel-icon-wrapper {
          width: 44px; height: 44px; background: var(--clr-bg); border-radius: 12px;
          display: flex; align-items: center; justify-content: center; color: var(--clr-accent);
          font-size: 1.1rem; flex-shrink: 0;
        }
        .channel-label { display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--clr-dark-muted); font-weight: 600; }
        .channel-value { display: block; font-weight: 700; font-size: 1.05rem; margin: 0.15rem 0; }
        .channel-sub { display: block; font-size: 0.8rem; color: #888; }

        .whatsapp-card-modern {
          background: #EAF7F1;
          border: 1px solid #C6EAD7;
          padding: 1.75rem;
          border-radius: 20px;
        }
        .wa-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .wa-badge { display: flex; align-items: center; gap: 0.5rem; color: #11663B; font-weight: 700; font-size: 0.9rem; }
        .pulse-indicator {
          width: 8px; height: 8px; background: #10B981; border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          animation: pulse 1.6s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .whatsapp-card-modern p { font-size: 0.9rem; color: #1E5136; line-height: 1.5; margin-bottom: 1.25rem; }
        .wa-action-btn {
          display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 700; color: #11663B;
          text-decoration: none; font-size: 0.9rem; transition: transform 0.2s;
        }
        .wa-action-btn:hover { transform: translateX(3px); }

        /* --- GLASS FORM --- */
        .form-container-glass {
          background: var(--clr-glass);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          padding: 3.5rem;
          border-radius: 32px;
          box-shadow: 0 40px 100px -30px rgba(9, 29, 38, 0.08);
        }
        .form-head { margin-bottom: 2.5rem; }
        .form-head h3 { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.35rem; }
        .form-head p { color: var(--clr-dark-muted); font-size: 0.95rem; }

        .floating-group {
          position: relative;
          border-bottom: 1px solid var(--clr-border);
          padding: 1.25rem 0 0.5rem;
          margin-bottom: 2rem;
          transition: border-color 0.3s;
        }
        .floating-group label {
          position: absolute; left: 0; top: 1.5rem; color: #888; font-size: 1rem;
          pointer-events: none; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .floating-group input, .floating-group textarea {
          width: 100%; border: none; background: transparent; font-size: 1.1rem;
          font-weight: 500; color: var(--clr-dark); padding: 0.25rem 0;
        }
        .floating-group input:focus, .floating-group textarea:focus { outline: none; }
        
        /* Active States for Inputs */
        .floating-group.is-active { border-color: var(--clr-accent); }
        .floating-group.is-active label { top: 0; font-size: 0.75rem; font-weight: 700; color: var(--clr-accent); text-transform: uppercase; letter-spacing: 0.05em; }
        
        .grid-2-col { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        
        /* Modern Select Stylings */
        .custom-select-wrapper { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2rem; }
        .select-label { font-size: 0.75rem; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.4rem; }
        .custom-select-wrapper select {
          padding: 0.85rem 1rem; border: 1px solid var(--clr-border); border-radius: 12px;
          font-size: 1rem; font-weight: 500; background: var(--clr-surface); color: var(--clr-dark);
          outline: none; transition: border-color 0.2s; cursor: pointer;
        }
        .custom-select-wrapper select:focus { border-color: var(--clr-accent); }
        
        .info-helper-box {
          background: rgba(9, 29, 38, 0.02);
          border-radius: 12px; padding: 1rem 1.25rem; display: flex; gap: 0.75rem;
          align-items: center; font-size: 0.85rem; color: var(--clr-dark-muted);
          margin-bottom: 2rem; border: 1px dashed var(--clr-border);
        }
        .info-helper-box svg { color: var(--clr-accent); font-size: 1.2rem; flex-shrink: 0; }

        .textarea-group { padding-top: 2rem; }
        .textarea-group textarea { resize: none; margin-top: 0.5rem; font-size: 1rem; line-height: 1.5; }
        .textarea-group textarea::placeholder { color: #BBB; opacity: 0; transition: opacity 0.2s; }
        .floating-group.is-active textarea::placeholder { opacity: 1; }

        .prime-submit-btn {
          width: 100%; background: var(--clr-dark); color: #FFF; border: none;
          padding: 1.25rem; border-radius: 14px; font-weight: 700; font-size: 1.05rem;
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .prime-submit-btn:hover { background: var(--clr-accent); transform: translateY(-2px); }
        .arrow-icon { transition: transform 0.2s; }
        .prime-submit-btn:hover .arrow-icon { transform: translateX(4px); }

        /* --- SUCCESS STATE --- */
        .success-state { text-align: center; padding: 2rem 0; }
        .success-lottie-replacement {
          width: 70px; height: 70px; background: #D1FAE5; color: #10B981;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: 1.75rem; margin: 0 auto 1.5rem;
        }
        .success-state h3 { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.75rem; }
        .success-state p { color: var(--clr-dark-muted); line-height: 1.6; max-width: 400px; margin: 0 auto 2.5rem; }
        .secondary-btn {
          background: transparent; border: 1px solid var(--clr-border); color: var(--clr-dark);
          padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .secondary-btn:hover { background: var(--clr-surface); border-color: var(--clr-dark); }

        /* Spinner */
        .spinner {
          width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%; border-top-color: #fff; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* --- TIMELINE METHODOLOGY --- */
        .process-section { padding: 6rem 2rem; background: var(--clr-surface); border-top: 1px solid var(--clr-border); }
        .container-narrow { max-width: 900px; margin: 0 auto; }
        .process-header { text-align: center; margin-bottom: 4.5rem; }
        .process-header h2 { font-size: 2.25rem; font-weight: 800; letter-spacing: -0.02em; }

        .modern-timeline { display: flex; flex-direction: column; gap: 2.5rem; }
        .timeline-card-wrapper {
          display: flex; gap: 2.5rem; align-items: flex-start;
          padding: 2rem; background: var(--clr-bg); border-radius: 20px;
          border: 1px solid var(--clr-border);
        }
        .timeline-index {
          font-size: 1.25rem; font-weight: 800; color: var(--clr-accent);
          background: var(--clr-surface); border: 1px solid var(--clr-border);
          width: 48px; height: 48px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .timeline-body h4 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.4rem; }
        .timeline-body p { color: var(--clr-dark-muted); line-height: 1.6; }

        /* --- IMMERSIVE MAP --- */
        .immersive-map-section { position: relative; height: 500px; display: flex; align-items: center; padding: 0 4rem; }
        .map-embed-container { position: absolute; top:0; left:0; width:100%; height:100%; z-index:1; filter: grayscale(1) contrast(1.1) brightness(0.95); opacity: 0.85; }
        .map-embed-container iframe { width: 100%; height: 100%; border: 0; }
        
        .map-floating-details {
          position: relative; z-index: 2; background: var(--clr-surface);
          padding: 3rem; border-radius: 24px; max-width: 380px;
          box-shadow: 0 30px 70px rgba(9, 29, 38, 0.15);
          border: 1px solid var(--clr-border);
        }
        .map-floating-details .tag { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--clr-accent); }
        .map-floating-details h3 { font-size: 1.5rem; font-weight: 800; margin: 0.35rem 0 0.75rem; }
        .map-floating-details p { font-size: 0.95rem; color: var(--clr-dark-muted); line-height: 1.5; margin-bottom: 1.5rem; }
        .text-link { color: var(--clr-dark); font-weight: 700; text-decoration: none; font-size: 0.95rem; }
        .text-link:hover { color: var(--clr-accent); }

        /* --- RESPONSIVE ADJUSTMENTS --- */
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr; }
          .hero-right-deco { display: none; }
          .split-grid { grid-template-columns: 1fr; gap: 4rem; }
          .form-container-glass { padding: 2.5rem; }
          .immersive-map-section { height: auto; flex-direction: column; padding: 0; }
          .map-embed-container { position: relative; height: 350px; }
          .map-floating-details { max-width: 100%; border-radius: 0; width: 100%; box-shadow: none; }
        }

        @media (max-width: 640px) {
          .stats-strip { gap: 1.5rem; flex-wrap: wrap; }
          .grid-2-col { grid-template-columns: 1fr; gap: 0; }
          .timeline-card-wrapper { flex-direction: column; gap: 1rem; padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
}