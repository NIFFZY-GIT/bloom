"use client";

import { useState, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowRight, FaPhone, FaEnvelope, 
  FaMapMarkerAlt, FaWhatsapp, FaCheck, FaStar,
  FaCompass, FaUsers
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
    value: '319/13 Boralugoda, Athurugiriya',
    sub: 'By appointment only',
    Icon: FaMapMarkerAlt,
    link: 'https://maps.app.goo.gl/xuT5D2PpfiAgcMaV6'
  },
  {
    label: 'Concierge Hotline',
    value: '+94 77 733 1811',
    sub: '08:00 - 22:00 Daily',
    Icon: FaPhone,
    link: 'tel:+94777331811'
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
    <div className="relative pt-20 text-[#091D26] bg-[#FAF8F5] antialiased overflow-x-hidden font-sans selection:bg-[#C99646]/20">
      
      {/* Background Noise simulation */}
      <div 
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* --- HERO SECTION --- */}
      <section className="relative z-20 px-8 pt-24 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] items-center gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block text-[0.75rem] font-semibold tracking-widest uppercase text-[#C99646] bg-[#C99646]/10 px-4 py-1.5 rounded-full mb-6">
              Est. Colombo, 2018
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Let’s design your <span className="bg-gradient-to-r from-[#C99646] to-[#8C6221] bg-clip-text text-transparent">next escape</span>.
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-[#334A54] max-w-[540px] mb-14">
              We bridge the gap between bespoke luxury and authentic local culture. 
              Share your vision, and we’ll craft the perfect itinerary.
            </p>

            <div className="flex flex-wrap gap-6 sm:gap-14 border-t border-[#E8E3DC] pt-8">
              <div className="flex flex-col">
                <span className="text-2xl font-bold flex items-center gap-1.5">
                  4.9 <FaStar className="text-[#C99646] text-lg" />
                </span>
                <span className="text-[0.75rem] uppercase tracking-wider text-[#334A54] mt-1">Guest Rating</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">&lt; 6 hrs</span>
                <span className="text-[0.75rem] uppercase tracking-wider text-[#334A54] mt-1">Response Time</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">100%</span>
                <span className="text-[0.75rem] uppercase tracking-wider text-[#334A54] mt-1">Tailor-Made</span>
              </div>
            </div>
          </motion.div>

          <div className="relative w-full h-full hidden lg:block">
            <div className="absolute w-[300px] h-[300px] bg-[#C99646]/10 rounded-full blur-[60px] -top-[50px] right-0" />
          </div>
        </div>
      </section>

      {/* --- MAIN SPLIT INTERACTION --- */}
      <section className="relative z-20 px-8 py-8 lg:pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-16 items-start">
          
          {/* Left Block: Communication Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <div>
              <span className="block text-[0.75rem] uppercase tracking-wider text-[#C99646] font-bold mb-2">Direct Channels</span>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4">Prefer a swift connection?</h2>
              <p className="text-[#334A54] leading-relaxed mb-10">Skip the forms entirely. Our Colombo studio planners are accessible via all major modern communication networks.</p>
            </div>

            <div className="flex flex-col gap-4 mb-10">
              {contactChannels.map((channel, i) => (
                <a 
                  href={channel.link} 
                  key={i} 
                  className="bg-white border border-[#E8E3DC] p-6 rounded-2xl flex gap-5 text-inherit no-underline transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) hover:-translate-y-0.5 hover:border-[#C99646] hover:shadow-xl hover:shadow-[#091D26]/5"
                  target="_blank" 
                  rel="noreferrer"
                >
                  <div className="w-11 h-11 bg-[#FAF8F5] rounded-xl flex items-center justify-center text-[#C99646] text-lg shrink-0">
                    <channel.Icon />
                  </div>
                  <div>
                    <span className="block text-[0.75rem] uppercase text-[#334A54] font-semibold">{channel.label}</span>
                    <span className="block font-bold text-[1.05rem] my-0.5">{channel.value}</span>
                    <span className="block text-sm text-gray-400">{channel.sub}</span>
                  </div>
                </a>
              ))}
            </div>

            <div className="bg-[#EAF7F1] border border-[#C6EAD7] p-7 rounded-[20px]">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-[#11663B] font-bold text-sm">
                  <FaWhatsapp /> Live Concierge
                </div>
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-ping" />
              </div>
              <p className="text-sm text-[#1E5136] leading-relaxed mb-5">On-the-ground support is available instantly via WhatsApp for rapid queries.</p>
              <a href="#" className="inline-flex items-center gap-2 font-bold text-[#11663B] text-sm no-underline group">
                Launch Chat 
                <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          {/* Right Block: Minimalist Glassmorphic Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/75 backdrop-blur-xl border border-white/60 p-6 sm:p-14 rounded-[32px] shadow-2xl shadow-[#091D26]/5"
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-[70px] h-[70px] bg-[#D1FAE5] text-[#10B981] rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                    <FaCheck />
                  </div>
                  <h3 className="text-2xl font-extrabold mb-3">Blueprint Initiated</h3>
                  <p className="text-[#334A54] leading-relaxed max-w-[400px] mx-auto mb-10">
                    Thank you, <strong>{formData.name}</strong>. A dedicated curator will review your preferences and drop a digital mood board into your inbox within 6 hours.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)} 
                    className="bg-transparent border border-[#E8E3DC] text-[#091D26] px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-white hover:border-[#091D26]"
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <h3 className="text-3xl font-extrabold mb-1.5">The Itinerary Brief</h3>
                    <p className="text-[#334A54] text-sm">Provide your fundamental parameters to initiate creative design.</p>
                  </div>

                  {/* Input Element */}
                  <div className={`relative border-b transition-colors duration-300 pt-5 pb-2 ${activeField === 'name' || formData.name ? 'border-[#091D26]' : 'border-[#E8E3DC]'}`}>
                    <label className={`absolute left-0 pointer-events-none transition-all duration-[250ms] cubic-bezier(0.16, 1, 0.3, 1) ${activeField === 'name' || formData.name ? 'top-0 text-[0.75rem] font-bold text-[#091D26] uppercase tracking-wider' : 'top-5 text-base text-gray-400'}`}>
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onFocus={() => setActiveField('name')}
                      onBlur={() => setActiveField(null)}
                      onChange={handleChange}
                      className="w-full border-none bg-transparent text-lg font-medium text-[#091D26] py-1 focus:outline-none"
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className={`relative border-b transition-colors duration-300 pt-5 pb-2 ${activeField === 'email' || formData.email ? 'border-[#091D26]' : 'border-[#E8E3DC]'}`}>
                      <label className={`absolute left-0 pointer-events-none transition-all duration-[250ms] cubic-bezier(0.16, 1, 0.3, 1) ${activeField === 'email' || formData.email ? 'top-0 text-[0.75rem] font-bold text-[#091D26] uppercase tracking-wider' : 'top-5 text-base text-gray-400'}`}>
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onFocus={() => setActiveField('email')}
                        onBlur={() => setActiveField(null)}
                        onChange={handleChange}
                        className="w-full border-none bg-transparent text-lg font-medium text-[#091D26] py-1 focus:outline-none"
                        required 
                      />
                    </div>

                    <div className={`relative border-b transition-colors duration-300 pt-5 pb-2 ${activeField === 'phone' || formData.phone ? 'border-[#091D26]' : 'border-[#E8E3DC]'}`}>
                      <label className={`absolute left-0 pointer-events-none transition-all duration-[250ms] cubic-bezier(0.16, 1, 0.3, 1) ${activeField === 'phone' || formData.phone ? 'top-0 text-[0.75rem] font-bold text-[#091D26] uppercase tracking-wider' : 'top-5 text-base text-gray-400'}`}>
                        Phone Number (Optional)
                      </label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone}
                        onFocus={() => setActiveField('phone')}
                        onBlur={() => setActiveField(null)}
                        onChange={handleChange}
                        className="w-full border-none bg-transparent text-lg font-medium text-[#091D26] py-1 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                    <div className="flex flex-col gap-2">
                      <label className="text-[0.75rem] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FaUsers /> Number of Guests
                      </label>
                      <select 
                        name="travelers" 
                        value={formData.travelers} 
                        onChange={handleChange}
                        className="p-3.5 border border-[#E8E3DC] rounded-xl text-base font-medium bg-white text-[#091D26] outline-none transition-colors duration-200 focus:border-[#C99646] cursor-pointer appearance-none"
                      >
                        {[1,2,3,4,5,6,'7+'].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-[#091D26]/[0.02] border border-dashed border-[#E8E3DC] rounded-xl p-4 flex gap-3 items-center text-[0.85rem] text-[#334A54]">
                      <FaCompass className="text-[#C99646] text-xl shrink-0" />
                      <span>Every detail is engineered 100% custom around your chosen speed.</span>
                    </div>
                  </div>

                  <div className={`relative border-b transition-colors duration-300 pt-8 pb-2 ${activeField === 'message' || formData.message ? 'border-[#091D26]' : 'border-[#E8E3DC]'}`}>
                    <label className={`absolute left-0 pointer-events-none transition-all duration-[250ms] cubic-bezier(0.16, 1, 0.3, 1) ${activeField === 'message' || formData.message ? 'top-0 text-[0.75rem] font-bold text-[#091D26] uppercase tracking-wider' : 'top-4 text-base text-gray-400'}`}>
                      Tell us about your dream trip
                    </label>
                    <textarea 
                      name="message" 
                      rows={4}
                      value={formData.message}
                      onFocus={() => setActiveField('message')}
                      onBlur={() => setActiveField(null)}
                      onChange={handleChange}
                      placeholder="Approximate dates, core interests (wildlife safari, tea estate stays, hidden beaches)..."
                      className="w-full border-none bg-transparent text-base font-medium text-[#091D26] mt-2 resize-none leading-relaxed placeholder-gray-300 focus:outline-none focus:placeholder-gray-400 transition-opacity duration-200"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#091D26] text-white border-none p-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1] hover:bg-[#C99646] hover:-translate-y-0.5 group"
                  >
                    {isSubmitting ? (
                      <span className="w-6 h-6 border-3 border-white/30 rounded-full border-t-white animate-spin" />
                    ) : (
                      <>
                        <span>Request Custom Itinerary</span>
                        <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
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
      <section className="px-8 py-24 bg-white border-t border-[#E8E3DC]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="block text-[0.75rem] uppercase tracking-wider text-[#C99646] font-bold mb-2">The Methodology</span>
            <h2 className="text-4xl font-extrabold tracking-tight">How your escape is materialized</h2>
          </div>

          <div className="flex flex-col gap-10">
            {journeySteps.map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-10 items-start p-8 bg-[#FAF8F5] rounded-[20px] border border-[#E8E3DC]"
              >
                <div className="text-xl font-extrabold text-[#C99646] bg-white border border-[#E8E3DC] w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                  {step.step}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1.5">{step.title}</h4>
                  <p className="text-[#334A54] leading-relaxed">{step.copy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- INTEGRATED MAP & FOOTER STRIP --- */}
      <section className="relative min-h-[500px] lg:h-[500px] flex flex-col lg:flex-row items-center px-0 lg:px-16">
        <div className="absolute inset-0 w-full h-full z-10 grayscale contrast-[1.1] brightness-[0.95] opacity-85 hidden lg:block">
          <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467112139!2d79.85275541532638!3d6.92706619500827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259130df8cb3d%3A0xcb2d5bceae83c41!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1633021634345!5m2!1sen!2us"
             loading="lazy"
             title="Colombo Studio Map Location"
             className="w-full h-full border-0"
          />
        </div>
        
        {/* Mobile alternative map layout container */}
        <div className="w-full h-[350px] grayscale contrast-[1.1] brightness-[0.95] opacity-85 block lg:hidden">
          <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467112139!2d79.85275541532638!3d6.92706619500827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259130df8cb3d%3A0xcb2d5bceae83c41!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1633021634345!5m2!1sen!2us"
             loading="lazy"
             title="Colombo Studio Map Location Mobile"
             className="w-full h-full border-0"
          />
        </div>

        <div className="relative z-20 bg-white p-12 w-full lg:max-w-[380px] lg:rounded-3xl lg:shadow-3xl lg:shadow-[#091D26]/15 border-t lg:border border-[#E8E3DC]">
          <span className="text-[0.7rem] font-bold uppercase tracking-widest text-[#C99646]">Headquarters</span>
          <h3 className="text-2xl font-extrabold mt-1 mb-3">Colombo, Sri Lanka</h3>
          <p className="text-sm text-[#334A54] leading-relaxed mb-6">Drop by the Experience Studio for a premium tea infusion tasting while we blueprint.</p>
          <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-[#091D26] font-bold text-sm no-underline hover:text-[#C99646] transition-colors">
            Get Navigation Data →
          </a>
        </div>
      </section>
    </div>
  );
}