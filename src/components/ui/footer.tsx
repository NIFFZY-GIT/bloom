"use client";

import { useState } from "react";
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
  FaArrowRight,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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

  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="tb-footer">
      {/* Newsletter band */}
      <div className="tb-cta">
        <div className="tb-cta-inner">
          <div className="tb-cta-copy">
            <span className="tb-eyebrow">Stay Inspired</span>
            <h2 className="tb-cta-title">Let the journey find you</h2>
            <p className="tb-cta-sub">
              Join our newsletter for handpicked destinations, seasonal offers and
              insider tips from the pearl of the Indian Ocean.
            </p>
          </div>

          {subscribed ? (
            <div className="tb-thanks">
              <span className="tb-thanks-mark">✓</span>
              You&apos;re on the list — welcome aboard!
            </div>
          ) : (
            <form className="tb-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button type="submit">
                Subscribe <FaArrowRight />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="tb-main">
        {/* Brand */}
        <div className="tb-brand">
          <Link href="/" className="tb-lockup">
            <Image
              src="/logo/logo1.jpg"
              alt="Tropical Bloom Tourism"
              width={54}
              height={54}
              className="tb-mark"
              style={{
                borderRadius: "20%",
                objectFit: "cover",
                background: "#fff",
                boxShadow: "0 6px 18px -6px rgba(0, 0, 0, 0.5)",
              }}
            />
            <span>
              <span className="tb-name">Tropical Bloom</span>
              <span className="tb-kicker">Tourism</span>
            </span>
          </Link>
          <p className="tb-desc">
            Curated journeys through the soul of Sri Lanka — from pristine
            coastlines and misty highlands to ancient heritage and wildlife.
          </p>
          <div className="tb-socials">
            {socials.map(({ Icon, label, href }) => (
              <a key={label} href={href} aria-label={label} className="tb-social">
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <nav className="tb-col">
          <h3>Explore</h3>
          <ul>
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

     

        {/* Contact */}
        <div className="tb-col tb-contact">
          <h3>Get in Touch</h3>
          <ul>
            <li>
              <span className="tb-ic"><FaMapMarkerAlt /></span>
              <span>Colombo 03,<br />Sri Lanka</span>
            </li>
            <li>
              <span className="tb-ic"><FaPhone /></span>
              <a href="tel:+94771234567">+94 77 123 4567</a>
            </li>
            <li>
              <span className="tb-ic"><FaEnvelope /></span>
              <a href="mailto:hello@tropicalbloom.lk">hello@tropicalbloom.lk</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="tb-bottom">
        <div className="tb-bottom-inner">
          <p>© {currentYear} Tropical Bloom Tourism. All rights reserved.</p>
          <div className="tb-legal">
            <a href="#">Privacy Policy</a>
            <span className="tb-dot">•</span>
            <a href="#">Terms of Service</a>
          </div>
          <div className="tb-dev">
            <span>Powered by</span>
            <a
              href="https://zevarone.com"
              target="_blank"
              rel="noopener noreferrer"
              className="tb-zev"
              aria-label="ZEVARONE"
            >
              <Image
                src="/newlogos/Asset 13.svg"
                alt="ZEVARONE"
                width={110}
                height={22}
                className="tb-zev-logo"
              />
            </a>
            <span className="tb-amp">&amp;</span>
            <span>Norwood Technologies</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tb-footer {
          position: relative;
          background:
            radial-gradient(120% 90% at 85% -10%, rgba(245, 158, 11, 0.12), transparent 60%),
            linear-gradient(180deg, #0d2a37 0%, #0a2230 55%, #081b26 100%);
          color: #a9bcc2;
          overflow: hidden;
        }

        /* ---- Newsletter band ---- */
        .tb-cta {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .tb-cta-inner {
          max-width: 80rem;
          margin: 0 auto;
          padding: 3.5rem 1.5rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }

        @media (min-width: 900px) {
          .tb-cta-inner {
            grid-template-columns: 1.1fr 0.9fr;
            gap: 3rem;
            padding: 3.75rem 2rem;
          }
        }

        .tb-eyebrow {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #f0c674;
          margin-bottom: 0.85rem;
        }

        .tb-cta-title {
          font-family: var(--font-display, Georgia, serif);
          color: #fff;
          font-size: clamp(1.7rem, 3.4vw, 2.5rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin-bottom: 0.75rem;
        }

        .tb-cta-sub {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #9fb2b9;
          max-width: 34rem;
        }

        .tb-form {
          display: flex;
          gap: 0.6rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          padding: 0.4rem 0.4rem 0.4rem 0.35rem;
          max-width: 30rem;
          width: 100%;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .tb-form:focus-within {
          border-color: rgba(245, 158, 11, 0.55);
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.12);
        }

        .tb-form input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 0.95rem;
          padding: 0.65rem 0.5rem 0.65rem 1.1rem;
        }

        .tb-form input::placeholder {
          color: #7c9198;
        }

        .tb-form button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          color: #1a1206;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border-radius: 9999px;
          padding: 0.7rem 1.4rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
          box-shadow: 0 8px 20px -8px rgba(245, 158, 11, 0.6);
        }

        .tb-form button:hover {
          transform: translateY(-1px);
          filter: brightness(1.04);
          box-shadow: 0 12px 26px -10px rgba(245, 158, 11, 0.75);
        }

        .tb-thanks {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          color: #e9d8a6;
          font-size: 0.98rem;
          font-weight: 500;
        }

        .tb-thanks-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.9rem;
          height: 1.9rem;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.16);
          border: 1px solid rgba(245, 158, 11, 0.5);
          color: #f59e0b;
          font-size: 0.85rem;
          font-weight: 700;
        }

        /* ---- Main columns ---- */
        .tb-main {
          max-width: 80rem;
          margin: 0 auto;
          padding: 3.5rem 1.5rem 2.5rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.75rem;
        }

        @media (min-width: 640px) {
          .tb-main {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1000px) {
          .tb-main {
            grid-template-columns: 2fr 1fr 1.4fr;
            gap: 3.5rem;
            padding: 4rem 2rem 2.75rem;
          }
        }

        .tb-lockup {
          display: inline-flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 1.35rem;
        }

        .tb-mark {
          border-radius: 50%;
          object-fit: cover;
          background: #fff;
          box-shadow: 0 6px 18px -6px rgba(0, 0, 0, 0.5);
        }

        .tb-name {
          display: block;
          font-family: var(--font-display, Georgia, serif);
          font-size: 1.35rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.05;
        }

        .tb-kicker {
          display: block;
          font-size: 0.64rem;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #f0c674;
          margin-top: 0.2rem;
        }

        .tb-desc {
          font-size: 0.92rem;
          line-height: 1.75;
          color: #9fb2b9;
          max-width: 26rem;
          margin-bottom: 1.6rem;
        }

        .tb-socials {
          display: flex;
          gap: 0.6rem;
        }

        .tb-social {
          width: 2.5rem;
          height: 2.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #c2d2d7;
          font-size: 0.9rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          transition: transform 0.25s ease, background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }

        .tb-social:hover {
          transform: translateY(-3px);
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border-color: transparent;
          color: #1a1206;
        }

        .tb-col h3 {
          font-family: var(--font-body, sans-serif);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 1.35rem;
          position: relative;
          padding-bottom: 0.7rem;
        }

        .tb-col h3::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 2rem;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #f59e0b, transparent);
        }

        .tb-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .tb-col a {
          font-size: 0.92rem;
          color: #9fb2b9;
          transition: color 0.2s ease, padding-left 0.2s ease;
        }

        .tb-col a:hover {
          color: #fff;
          padding-left: 5px;
        }

        .tb-contact li {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          font-size: 0.92rem;
          color: #9fb2b9;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .tb-ic {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.1rem;
          height: 2.1rem;
          flex-shrink: 0;
          border-radius: 9px;
          background: rgba(245, 158, 11, 0.12);
          color: #f59e0b;
          font-size: 0.82rem;
        }

        /* ---- Bottom bar ---- */
        .tb-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .tb-bottom-inner {
          max-width: 80rem;
          margin: 0 auto;
          padding: 1.6rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.85rem;
          font-size: 0.8rem;
          color: #7f959b;
          text-align: center;
        }

        @media (min-width: 1000px) {
          .tb-bottom-inner {
            flex-direction: row;
            justify-content: space-between;
            padding: 1.6rem 2rem;
            text-align: left;
          }
        }

        .tb-legal {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .tb-legal a:hover {
          color: #e9d8a6;
        }

        .tb-dot {
          opacity: 0.5;
        }

        .tb-dev {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          color: #7f959b;
        }

        .tb-zev {
          display: inline-flex;
          align-items: center;
        }

        .tb-zev-logo {
          height: 17px;
          width: auto;
          filter: brightness(0) invert(1);
          opacity: 0.85;
          transition: opacity 0.2s ease;
        }

        .tb-zev:hover .tb-zev-logo {
          opacity: 1;
        }

        .tb-amp {
          opacity: 0.55;
        }
      `}</style>
    </footer>
  );
}
