"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  // Avoid hydration mismatch issues by rendering the year dynamically after mounting
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const socials = [
    { Icon: FaFacebookF, label: "Facebook", href: "#" },
    { Icon: FaInstagram, label: "Instagram", href: "#" },
    { Icon: FaYoutube, label: "YouTube", href: "#" },
    { Icon: FaTwitter, label: "Twitter", href: "#" },
  ];

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/packages" },
    { label: "Tour Packages", href: "/packages" },
    { label: "Gallery", href: "/gallery" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact", href: "/contact-us" },
  ];

  return (
    <footer className="tb-footer">
      {/* Decorative Grid Lines */}
      <div className="tb-grid-overlay">
        <div className="tb-grid-line"></div>
        <div className="tb-grid-line"></div>
      </div>


      {/* --- Main Informational Column Deck --- */}
      <div className="tb-main-deck">
        {/* Brand Block */}
        <div className="tb-brand-block">
          <Link href="/" className="tb-logo-lockup">
         
            <div className="tb-logo-text">
              <span className="tb-brand-title">Tropical Bloom</span>
              <span className="tb-brand-subtitle">Tourism</span>
            </div>
          </Link>
          <p className="tb-brand-desc">
            Curating high-end, immersive journeys through the soul of Sri Lanka—from 
            pristine coastlines and misty highlands to heritage sanctuaries.
          </p>
          <div className="tb-social-strip">
            {socials.map(({ Icon, label, href }) => (
              <a key={label} href={href} aria-label={label} className="tb-social-item">
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Link Columns Split */}
        <div className="tb-links-grid">
          <nav className="tb-nav-col">
            <h3 className="tb-col-heading">Explore</h3>
            <ul className="tb-nav-list">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="tb-nav-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="tb-nav-col">
            <h3 className="tb-col-heading">Get in Touch</h3>
            <ul className="tb-contact-list">
             {/* Change </div> on line 149 to </li> */}
<li>
  <div className="tb-contact-icon"><FaMapMarkerAlt /></div>
  <span className="tb-contact-text">319/13 Boralugoda,<br /> Athurugiriya</span>
</li> {/* <-- Fixed here */}
<li>
  <div className="tb-contact-icon"><FaPhone /></div>
  <a href="tel:+94771234567" className="tb-contact-text tb-interactive-text">
    +94 77 733 1811
  </a>
</li>
              <li>
                <div className="tb-contact-icon"><FaEnvelope /></div>
                <a href="mailto:info@tropicalbloom.lk" className="tb-contact-text tb-interactive-text">
                  info@tropicalbloom.lk
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- Legal / Attribution Bottom Strip --- */}
      <div className="tb-bottom-strip">
        <div className="tb-bottom-inner">
          <div className="tb-copyright-block">
            <p>© {currentYear} Tropical Bloom Tourism. All rights reserved.</p>
            <div className="tb-legal-links">
              <a href="#">Privacy Policy</a>
              <span className="tb-separator">•</span>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          
          <div className="tb-attribution-block">
            <span className="attr-lbl">Powered by</span>
            <div className="attr-logos">
              <a
                href="https://zevarone.com"
                target="_blank"
                rel="noopener noreferrer"
                className="logo-wrapper-zev"
                aria-label="ZEVARONE"
              >
                <Image
                  src="/newlogos/Asset 13.svg"
                  alt="ZEVARONE"
                  width={100}
                  height={20}
                  className="img-zev"
                />
              </a>
              <span className="attr-amp">&amp;</span>
              <span className="attr-partner">Norwood Technologies</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tb-footer {
          --color-bg-dark: #091D26;
          --color-bg-gradient: #0D2A37;
          --color-accent: #C99646;
          --color-text-muted: #8FA3AB;
          --color-border: rgba(255, 255, 255, 0.08);
          
          position: relative;
          background-color: var(--color-bg-dark);
          background-image: 
            radial-gradient(circle at 80% 0%, rgba(201, 150, 70, 0.08) 0%, transparent 50%),
            linear-gradient(180deg, var(--color-bg-gradient) 0%, var(--color-bg-dark) 100%);
          color: var(--color-text-muted);
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Ambient structural grid-lines */
        .tb-grid-overlay {
          position: absolute; inset: 0; pointer-events: none; display: flex; justify-content: space-between; padding: 0 10%; z-index: 1;
        }
        .tb-grid-line { width: 1px; height: 100%; background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%); }

        /* --- Newsletter upper zone --- */
        .tb-cta-section {
          position: relative; z-index: 2; border-bottom: 1px solid var(--color-border);
        }
        .tb-cta-inner {
          max-width: 82rem; margin: 0 auto; padding: 4.5rem 2rem;
          display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: center;
        }
        @media (min-width: 1024px) {
          .tb-cta-inner { grid-template-columns: 1.1fr 0.9fr; gap: 4rem; }
        }
        .tb-eyebrow {
          display: inline-block; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.25em;
          text-transform: uppercase; color: var(--color-accent); margin-bottom: 1rem;
        }
        .tb-cta-title {
          color: #FFF; font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 1rem;
        }
        .tb-cta-sub { font-size: 1rem; line-height: 1.6; max-width: 36rem; color: #A0B3BB; }

        /* Modern input bar styling */
        .tb-form-pill {
          display: flex; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px; padding: 0.45rem; width: 100%; max-width: 32rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tb-form-pill:focus-within {
          border-color: var(--color-accent); box-shadow: 0 0 0 4px rgba(201, 150, 70, 0.15);
          background: rgba(255, 255, 255, 0.05);
        }
        .tb-form-pill input {
          flex: 1; background: transparent; border: none; outline: none; color: #FFF;
          font-size: 1rem; padding-left: 1.5rem; width: 100%;
        }
        .tb-form-pill input::placeholder { color: #58707A; }
        
        .tb-form-pill button {
          display: inline-flex; align-items: center; gap: 0.75rem; border: none; cursor: pointer;
          font-weight: 700; font-size: 0.95rem; color: #0A1E27; background: var(--color-accent);
          border-radius: 100px; padding: 0.85rem 1.75rem; transition: all 0.25s ease;
        }
        .tb-form-pill button:hover {
          background: #E0AB55; transform: translateY(-1px);
        }
        .btn-arr { transition: transform 0.2s; }
        .tb-form-pill button:hover .btn-arr { transform: translateX(3px); }

        .tb-thanks-card {
          display: flex; align-items: center; gap: 1rem; background: rgba(201, 150, 70, 0.08);
          border: 1px dashed rgba(201, 150, 70, 0.3); padding: 1.25rem 2rem; border-radius: 100px;
        }
        .tb-thanks-mark {
          width: 32px; height: 32px; background: var(--color-accent); color: #0A1E27;
          border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800;
        }
        .tb-thanks-card p { color: #FFF; font-weight: 600; margin: 0; font-size: 0.95rem; }

        /* --- Content column matrix deck --- */
        .tb-main-deck {
          position: relative; z-index: 2; max-width: 82rem; margin: 0 auto;
          padding: 5rem 2rem; display: grid; grid-template-columns: 1fr; gap: 4rem;
        }
        @media (min-width: 1024px) {
          .tb-main-deck { grid-template-columns: 1.2fr 1.8fr; gap: 6rem; }
        }
        
        .tb-brand-block { max-width: 28rem; }
        .tb-logo-lockup { display: inline-flex; align-items: center; gap: 1rem; margin-bottom: 1.75rem; text-decoration: none; }
        .tb-logo-frame { position: relative; width: 52px; height: 52px; border-radius: 14px; overflow: hidden; background: #FFF; }
        .tb-brand-title { display: block; color: #FFF; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.01em; }
        .tb-brand-subtitle { display: block; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: var(--color-accent); margin-top: 0.15rem; }
        .tb-brand-desc { line-height: 1.75; font-size: 1rem; margin-bottom: 2rem; color: var(--color-text-muted); }

        /* Premium Social Icons Interaction */
        .tb-social-strip { display: flex; gap: 0.75rem; }
        .tb-social-item {
          width: 42px; height: 42px; display: inline-flex; align-items: center; justify-content: center;
          border-radius: 12px; color: #A0B3BB; background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08); transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
        }
        .tb-social-item:hover {
          transform: translateY(-3px); background: #FFF; color: var(--color-bg-dark); border-color: #FFF;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        /* Links Columns Grid Alignment */
        .tb-links-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; }
        @media (min-width: 640px) { .tb-links-grid { grid-template-columns: 1fr 1.2fr; } }
        
        .tb-col-heading {
          font-size: 0.8rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
          color: #FFF; margin-bottom: 1.75rem; position: relative;
        }
        .tb-nav-list, .tb-contact-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1.1rem; }
        .tb-nav-link { text-decoration: none; color: var(--color-text-muted); font-size: 1rem; transition: color 0.2s ease, transform 0.2s ease; display: inline-block; }
        .tb-nav-link:hover { color: #FFF; transform: translateX(4px); }

        /* Contact Details Layout */
        .tb-contact-list li { display: flex; gap: 1rem; align-items: flex-start; }
        .tb-contact-icon { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 10px; background: rgba(201, 150, 70, 0.08); color: var(--color-accent); font-size: 0.85rem; flex-shrink: 0; margin-top: 0.1rem; }
        .tb-contact-text { font-size: 1rem; line-height: 1.5; color: var(--color-text-muted); }
        .tb-interactive-text { text-decoration: none; transition: color 0.2s; display: inline-block; }
        .tb-interactive-text:hover { color: #FFF; }

        /* --- Footer Bottom Strip --- */
        .tb-bottom-strip { border-top: 1px solid var(--color-border); position: relative; z-index: 2; }
        .tb-bottom-inner {
          max-width: 82rem; margin: 0 auto; padding: 2rem;
          display: flex; flex-direction: column; gap: 1.5rem; align-items: center; text-align: center; font-size: 0.875rem;
        }
        @media (min-width: 1024px) {
          .tb-bottom-inner { flex-direction: row; justify-content: space-between; text-align: left; }
        }

        .tb-copyright-block { display: flex; flex-direction: column; gap: 0.5rem; }
        @media (min-width: 640px) { .tb-copyright-block { flex-direction: row; gap: 1.5rem; align-items: center; } }
        .tb-legal-links { display: flex; align-items: center; gap: 1rem; }
        .tb-legal-links a { text-decoration: none; color: #58707A; transition: color 0.2s; }
        .tb-legal-links a:hover { color: var(--color-accent); }
        .tb-separator { color: rgba(255,255,255,0.1); }

        /* Dev Attribution block alignments */
        .tb-attribution-block { display: flex; align-items: center; gap: 0.75rem; color: #58707A; }
        .attr-logos { display: flex; align-items: center; gap: 0.6rem; }
        .logo-wrapper-zev { display: inline-flex; align-items: center; }
        .img-zev { filter: brightness(0) invert(1); opacity: 0.45; transition: opacity 0.22s ease; }
        .logo-wrapper-zev:hover .img-zev { opacity: 0.85; }
        .attr-amp { color: rgba(255,255,255,0.08); }
        .attr-partner { color: #58707A; font-weight: 500; }
      `}</style>
    </footer>
  );
}