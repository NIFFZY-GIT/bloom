'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState('mission');

  const stats = [
    { number: '15+', label: 'Years of Excellence' },
    { number: '50K+', label: 'Global Travelers' },
    { number: '200+', label: 'Curated Destinations' },
    { number: '98%', label: 'Retention & Satisfaction' }
  ];

  const values = [
    {
      icon: '🌱',
      title: 'Sustainable Tourism',
      description: 'We prioritize low-impact, eco-sensitive operational methodologies while actively supporting community-led preservation initiatives.'
    },
    {
      icon: '💎',
      title: 'Uncompromising Authenticity',
      description: 'Our deep local integration unlocks exclusive, uncompromised access to the authentic heritage of Sri Lanka.'
    },
    {
      icon: '🤝',
      title: 'Bespoke Private Service',
      description: 'Every itinerary is meticulously engineered entirely from the ground up to match precise stakeholder expectations.'
    },
    {
      icon: '🛡️',
      title: 'Risk Management & Safety',
      description: 'A comprehensive operational infrastructure engineered to guarantee traveler safety, comfort, and logistical continuity.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] antialiased selection:bg-[#C5A880]/20 font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="h-[85vh] relative flex items-center justify-center text-center text-white overflow-hidden pt-20">
        <div 
          className="absolute inset-0 w-full h-full bg-[url('/images/about-hero.jpg')] bg-center bg-cover bg-no-repeat transition-transform duration-1000"
          aria-hidden="true"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#1E293B]/60 via-[#1E293B]/70 to-[#1E293B]/90" />
        </div>
        
        <div className="relative z-10 max-w-4xl px-6 flex flex-col items-center justify-center h-full">
          <div className="space-y-4">
            <span className="text-[0.8rem] font-bold tracking-[0.25em] text-[#C5A880] uppercase block animate-[fadeInUp_0.8s_ease-out]">
              Corporate Profile
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight mb-6 drop-shadow-sm uppercase text-white animate-[fadeInUp_0.8s_ease-out_0.1s_both]">
              Our Institutional Story
            </h1>
            <p className="text-lg sm:text-xl font-normal opacity-90 max-w-3xl leading-relaxed text-slate-200 font-serif italic tracking-wide animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
              Architecting bespoke luxury expeditions across the Sri Lankan subcontinent since 2010.
            </p>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-2 text-slate-400 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
            <span className="text-[0.7rem] tracking-[0.2em] uppercase font-bold">
              Explore Enterprise Profile
            </span>
            <div className="text-lg animate-bounce">↓</div>
          </div>
        </div>
      </section>

      {/* --- CORPORATE OVERVIEW SECTION --- */}
      <section className="py-28 bg-white border-b border-slate-100 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[0.75rem] font-bold tracking-widest text-[#C5A880] uppercase block">
                Executive Overview
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#1E293B] tracking-tight">
                Tropical Bloom Corporate Governance
              </h2>
              <p className="text-base leading-relaxed text-slate-500">
                Established in 2010, Tropical Bloom Tourism was conceptualized with a clear corporate mandate: 
                to structuralize, modernize, and elevate the standard of custom destination management inside Sri Lanka. 
                What originated as a private boutique portfolio has systematically evolved into one of the country&apos;s 
                most authoritative assets in custom holiday engineering.
              </p>
              <p className="text-base leading-relaxed text-slate-500">
                We assert that modern executive travel must satisfy three key pillars: absolute operational precision, 
                environmental stewardship, and flawless experiential curation. Every asset deployment under our stewardship 
                is guaranteed to offer exceptional luxury, from remote highland reserve access to curated historical asset encounters.
              </p>
            </div>
            
            <div className="lg:col-span-5 relative w-full max-w-md lg:max-w-none mx-auto">
              <div className="relative w-full h-[420px]">
                {/* Structural Abstract Frame Overlap */}
                <div className="w-full h-full  rounded-lg relative z-20 ">
                  <Image
                    src="/logo/logo1.jpg"
                    alt="Tropical Bloom logo"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-contain p-12 mix-blend-multiply"
                    priority
                  />
                </div>
                <div className="absolute w-32 h-32 bg-slate-100 -top-6 -left-6 z-10 border border-slate-200 rounded" />
                <div className="absolute w-32 h-32 bg-[#C5A880]/10 -bottom-6 -right-6 z-10 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ANALYTICS / STATS SECTION --- */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 divide-x-0 sm:divide-x divide-slate-200">
            {stats.map((stat, index) => (
              <div key={index} className="text-center sm:first:pl-0 sm:pl-4">
                <div className="text-4xl sm:text-5xl font-light text-[#1E293B] mb-2 tracking-tight">
                  {stat.number}
                </div>
                <div className="text-[0.75rem] font-bold text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VALUES SECTION --- */}
      <section className="py-28 bg-white relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20 space-y-3">
            <span className="text-[0.75rem] font-bold tracking-widest text-[#C5A880] uppercase block">
              Operational Philosophies
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1E293B] tracking-tight">
              Our Core Principles
            </h2>
            <p className="text-base text-slate-400 max-w-xl mx-auto">
              The fundamental criteria that dictate risk mitigation and design mechanics across our entire corporate network.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="text-left p-10 bg-[#F8FAFC] border border-slate-100 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200/60"
              >
                <div className="text-4xl mb-6 text-[#C5A880]">{value.icon}</div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-3 tracking-tight">{value.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MISSION STRATEGY TABS SECTION --- */}
      <section className="py-28 bg-[#F8FAFC] border-t border-b border-slate-200 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center mb-16">
            <div className="flex flex-col sm:flex-row bg-white rounded-lg p-1.5 border border-slate-200 shadow-sm w-full sm:w-auto overflow-hidden">
              <button 
                className={`px-8 py-4 font-semibold transition-all duration-200 flex items-center justify-center gap-3 min-w-[180px] text-xs uppercase tracking-wider rounded ${activeTab === 'mission' ? 'bg-[#1E293B] text-white shadow-sm' : 'text-slate-500 hover:text-[#1E293B]'}`}
                onClick={() => setActiveTab('mission')}
              >
                <span>Our Mission</span>
              </button>
              
              <button 
                className={`px-8 py-4 font-semibold transition-all duration-200 flex items-center justify-center gap-3 min-w-[180px] text-xs uppercase tracking-wider rounded ${activeTab === 'vision' ? 'bg-[#1E293B] text-white shadow-sm' : 'text-slate-500 hover:text-[#1E293B]'}`}
                onClick={() => setActiveTab('vision')}
              >
                <span>Our Vision</span>
              </button>
              
              <button 
                className={`px-8 py-4 font-semibold transition-all duration-200 flex items-center justify-center gap-3 min-w-[180px] text-xs uppercase tracking-wider rounded ${activeTab === 'approach' ? 'bg-[#1E293B] text-white shadow-sm' : 'text-slate-500 hover:text-[#1E293B]'}`}
                onClick={() => setActiveTab('approach')}
              >
                <span>Our Approach</span>
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-white p-10 sm:p-16 rounded-xl border border-slate-200/60 shadow-md">
            {activeTab === 'mission' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-[#1E293B] tracking-tight">Fostering Transnational Integration</h3>
                <p className="text-base leading-relaxed text-slate-500">
                  Our professional mandate is to orchestrate strategic links between global travelers and the socio-cultural fabric of Sri Lanka. 
                  We surpass conventional commercial leisure limits to generate highly optimized, high-yielding experiential solutions that inform, empower, and deliver absolute structural value.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  {['Implement strict verification protocols', 'Subsidize regional infrastructure', 'Protect national heritage frameworks', 'Deliver multi-generational value'].map((item, idx) => (
                    <li key={idx} className="relative pl-6 text-sm text-slate-500 font-medium">
                      <span className="absolute left-0 text-[#C5A880] font-bold">▪</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-[#1E293B] tracking-tight">Pioneering Responsible Industry Metrics</h3>
                <p className="text-base leading-relaxed text-slate-500">
                  We look ahead toward an integrated destination framework where premium travel behaves as an intentional driver for sustainable local advancement—safeguarding unique natural typography, elevating host capability parameters, and developing transparent carbon-neutral micro-economies.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  {['Attain Net-Zero operating indexes', 'Formulate community equity shares', 'Inaugurate carbon-neutral private fleets', 'Enforce rigorous fair-trade labor codes'].map((item, idx) => (
                    <li key={idx} className="relative pl-6 text-sm text-slate-500 font-medium">
                      <span className="absolute left-0 text-[#C5A880] font-bold">▪</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'approach' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-[#1E293B] tracking-tight">Analytical & High-Touch Customization</h3>
                <p className="text-base leading-relaxed text-slate-500">
                  Every asset design sequence initiates with an exhaustive discovery phase detailing client expectations. 
                  Our corporate planning apparatus subsequently builds a closed-loop itinerary structure that successfully aligns ground dynamics, specialized navigation support, and elite security compliance.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  {['Exhaustive intake diagnostics', 'Verified sovereign guide access', 'Certified sustainable asset lists', '24/7 dedicated mission control centers'].map((item, idx) => (
                    <li key={idx} className="relative pl-6 text-sm text-slate-500 font-medium">
                      <span className="absolute left-0 text-[#C5A880] font-bold">▪</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- EXECUTIVE LEADERSHIP SECTION ---
      <section className="py-28 bg-white relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20 space-y-3">
            <span className="text-[0.75rem] font-bold tracking-widest text-[#C5A880] uppercase block">
              Corporate Registry
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1E293B] tracking-tight">
              Executive Directorate
            </h2>
            <p className="text-base text-slate-400 max-w-xl mx-auto">
              A leadership group combining cross-border hospitality execution, local asset governance, and compliance mastery.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-left p-6 bg-[#F8FAFC] rounded border border-slate-100">
                <div className="w-[80px] h-[80px] mb-6 rounded-full bg-gradient-to-br from-[#1E293B] to-slate-700 flex items-center justify-center text-white text-xl font-semibold shadow-inner border border-slate-800">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-[#1E293B] tracking-tight">{member.name}</h3>
                  <div className="text-[#C5A880] font-bold text-[0.7rem] uppercase tracking-wider">{member.role}</div>
                  <div className="w-10 h-[2px] bg-slate-200 my-3" />
                  <p className="text-slate-500 text-xs leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* --- ENTERPRISE CALL TO ACTION --- */}
      {/* <section className="py-24 bg-[#1E293B] text-white text-center relative z-10 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight uppercase">Initiate Private Consultation</h2>
            <p className="text-base opacity-80 leading-relaxed text-slate-300 font-light">
              Engage our project engineering desk to formulate a distinct, highly secure, and optimized corporate package or independent tour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <button className="bg-[#C5A880] text-white border-none py-3.5 px-8 text-xs uppercase tracking-widest font-bold rounded shadow-md transition-all duration-200 hover:bg-[#B3956D] hover:-translate-y-0.5 w-full sm:w-auto">
                Review Portfolios
              </button>
              <button className="bg-transparent text-slate-200 border border-slate-700 py-3.5 px-8 text-xs uppercase tracking-widest font-bold rounded transition-all duration-200 hover:bg-white hover:text-[#1E293B] hover:-translate-y-0.5 w-full sm:w-auto">
                Corporate Inquiries
              </button>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}