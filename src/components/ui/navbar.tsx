'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface NavbarProps {
  isAuthenticated: boolean;
  userRole: string | null;
}

export default function Navbar({ isAuthenticated, userRole }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [isBookingsDropdownOpen, setIsBookingsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    } else {
      router.push('/login');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
  await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error('Failed to logout user:', error);
    } finally {
      setIsProfileDropdownOpen(false);
      setIsMenuOpen(false);
      router.push('/');
      router.refresh();
    }
  };

  const handleDashboardClick = () => {
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
    router.push('/admin/dashboard');
  };

  // Track current pathname to set active link state
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) setActiveLink(pathname);
  }, [pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsProfileDropdownOpen(false);
    }
  }, [isAuthenticated]);

  const navItems = [
    { id: '/', label: 'HOME' },
    { id: '/about-us', label: 'ABOUT US' },
    { 
      id: 'bookings', 
      label: 'BOOKINGS',
      dropdown: [
        { id: '/packages', label: 'PACKAGES' },
        { id: '/create_pkg', label: 'CREATE PACKAGE' }
      ]
    },
    { id: '/gallery', label: 'GALLERY' },
    { id: '/contact-us', label: 'CONTACT US' }
  ];

  const handleNavClick = (id: string) => {
    setActiveLink(id);
    setIsMenuOpen(false);
    setIsBookingsDropdownOpen(false);
  };

  const handleBookingsHover = (show: boolean) => {
    setIsBookingsDropdownOpen(show);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Tropical Bloom Logo */}
        <div className="logo">
          <div className="logo-icon">🌺</div>
          <div className="logo-text">
            <span className="logo-line-1">TROPICAL</span>
            <span className="logo-line-2">BLOOM</span>
            <span className="logo-line-3">TOURISM</span>
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className={`nav-links ${isMenuOpen ? 'nav-links-active' : ''}`}>
          {navItems.map((item) => (
            <div 
              key={item.id}
              className={`nav-item ${item.dropdown ? 'has-dropdown' : ''}`}
              onMouseEnter={() => item.dropdown && handleBookingsHover(true)}
              onMouseLeave={() => item.dropdown && handleBookingsHover(false)}
            >
              {item.dropdown ? (
                // Dropdown trigger should be a button (not a navigation link)
                <button
                  type="button"
                  className={`nav-link ${activeLink === item.id ? 'active' : ''} dropdown-toggle`}
                  onClick={() => setIsBookingsDropdownOpen(!isBookingsDropdownOpen)}
                >
                  <span className="nav-link-text">{item.label}</span>
                  <span className="dropdown-arrow">▼</span>
                  <span className="nav-link-underline"></span>
                </button>
              ) : (
                <Link
                  href={item.id}
                  className={`nav-link ${activeLink === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span className="nav-link-text">{item.label}</span>
                  <span className="nav-link-underline"></span>
                </Link>
              )}

              {/* Dropdown Menu for Bookings */}
              {item.dropdown && (
                <div className={`dropdown-menu ${isBookingsDropdownOpen ? 'show' : ''}`}>
                  {item.dropdown.map((dropdownItem) => (
                    <Link
                      key={dropdownItem.id}
                      href={dropdownItem.id}
                      className={`dropdown-link ${activeLink === dropdownItem.id ? 'active' : ''}`}
                      onClick={() => handleNavClick(dropdownItem.id)}
                    >
                      {dropdownItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* CTA Button in mobile menu */}
          <button className="book-now-button mobile-cta">
            <span>Book Now</span>
            <div className="cta-icon">✈️</div>
          </button>
        </div>

        {/* Desktop CTA Button */}
        <button className="book-now-button desktop-cta">
          <span>Book Now</span>
          <div className="cta-icon">✈️</div>
        </button>

        {/* Auth Button (Login / Profile / Admin) */}
        <div className="auth-dropdown-container">
          <button
            className="book-now-button auth-button ml-3"
            onClick={handleAuthClick}
            aria-label={isAuthenticated ? (userRole === 'ADMIN' ? 'Admin menu' : 'Profile') : 'Login'}
          >
            <span>{isAuthenticated ? (userRole === 'ADMIN' ? 'Admin' : 'Profile') : 'Login'}</span>
            <div className="cta-icon">{userRole === 'ADMIN' ? '👑' : '👤'}</div>
          </button>
          
          {isAuthenticated && isProfileDropdownOpen && (
            <div className="profile-dropdown">
              {userRole === 'ADMIN' && (
                <button onClick={handleDashboardClick} className="dashboard-btn">
                  <span>Dashboard</span>
                  <div className="dashboard-icon">📊</div>
                </button>
              )}
              <button onClick={handleLogout} className="logout-btn">
                <span>Logout</span>
                <div className="logout-icon">🚪</div>
              </button>
            </div>
          )}
        </div>

        {/* Animated Hamburger Menu */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="menu-line line-1"></span>
          <span className="menu-line line-2"></span>
          <span className="menu-line line-3"></span>
        </button>
      </div>

      <style jsx>{`
        .navbar {
          background: rgba(254, 254, 254, 0); /* Solid white background */
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1); /* Darker border for contrast */
          padding: 1rem 0;
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.98); /* More solid white when scrolled */
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          padding: 0.75rem 0;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Tropical Bloom Logo Styles */
        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: translateY(-2px);
        }

        .logo-icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          animation: bloom 4s ease-in-out infinite;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .logo-line-1 {
          font-size: 1.1rem;
          font-weight: 800;
          color: #2E8B57;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .logo-line-2 {
          font-size: 1.4rem;
          font-weight: 900;
          color: #00f646ff;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin: -2px 0;
        }

        .logo-line-3 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #4169E1;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Navigation Links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background: rgba(255, 255, 255, 0.9); /* White background for nav links */
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 50px;
          padding: 0.5rem 1.5rem;
          border: 1px solid rgba(0, 0, 0, 0.1); /* Darker border */
        }

        .navbar.scrolled .nav-links {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.15);
        }

        .nav-item {
          position: relative;
        }

        .nav-item.has-dropdown:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        /* Reset anchor pseudo-states to avoid browser defaults (blue/underline) */
        .nav-link,
        .nav-link:link,
        .nav-link:visited,
        .nav-link:active,
        .nav-link:focus {
          position: relative;
          text-decoration: none !important;
          color: #2E8B57;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.025em;
          transition: color 0.25s ease, transform 0.25s ease;
          padding: 0.5rem 0.75rem;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          border-radius: 8px;
          outline: none;
        }

        .navbar.scrolled .nav-link {
          color: #f59e0b;
        }

        .nav-link:hover {
          color: #f59e0b;
          transform: translateY(-1px);
          background: rgba(255, 182, 193, 0.1);
        }

        .nav-link.active {
          color: #f59e0b;
        }

        .nav-link-underline {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #f59e0b, #f59e0b);
          border-radius: 2px;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-link:hover .nav-link-underline,
        .nav-link.active .nav-link-underline {
          width: 100%;
        }

        .dropdown-arrow {
          font-size: 0.7rem;
          transition: transform 0.3s ease;
        }

        .nav-item.has-dropdown:hover .dropdown-arrow {
          transform: rotate(180deg);
        }

        /* Dropdown Menu */
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: rgba(255, 255, 255, 0.98); /* White dropdown */
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          padding: 0.5rem 0;
          min-width: 180px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        /* Dropdown links: reset pseudo-states too */
        .dropdown-link,
        .dropdown-link:link,
        .dropdown-link:visited,
        .dropdown-link:active,
        .dropdown-link:focus {
          display: block;
          padding: 0.75rem 1.5rem;
          color: #2E8B57;
          text-decoration: none !important;
          font-weight: 500;
          font-size: 0.9rem;
          transition: color 0.2s ease, background 0.2s ease;
          border-left: 3px solid transparent;
          outline: none;
        }

        .dropdown-link:hover {
          background: rgba(255, 182, 193, 0.1);
          color: #f59e0b;
          border-left-color: #f59e0b;
        }

        .dropdown-link.active {
          background: rgba(255, 182, 193, 0.15);
          color: #FF69B4;
          border-left-color: #FF69B4;
        }

        /* Book Now Button - Green */
        .book-now-button {
          background: rgba(245, 158, 11, 0.95);
          color: white !important;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 6px 18px rgba(217,119,6,0.18);
          position: relative;
          overflow: hidden;
        }

        .book-now-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .book-now-button:hover::before {
          left: 100%;
        }

        .book-now-button:hover {
             background: #d97706; /* Darker yellow on hover */
          transform: translateY(-3px);
          box-shadow: 0 12px 35px #d97706;
        }

        .cta-icon {
          transition: transform 0.3s ease;
          font-size: 1.1rem;
        }

        .book-now-button:hover .cta-icon {
          transform: translateX(3px) rotate(15deg);
        }

        .auth-button {
          background: linear-gradient(90deg,#06b6d4,#3b82f6);
          box-shadow: 0 6px 18px rgba(59,130,246,0.16);
          padding: 0.6rem 1.1rem;
          font-size: 0.9rem;
        }

        .auth-button .cta-icon {
          font-size: 1rem;
        }

        .auth-dropdown-container {
          position: relative;
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          padding: 0.5rem;
          min-width: 150px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          animation: dropdownSlide 0.3s ease;
          z-index: 1001;
        }

        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(90deg, #ef4444, #dc2626);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        .logout-btn:hover {
          background: linear-gradient(90deg, #dc2626, #b91c1c);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
        }

        .logout-icon {
          font-size: 1rem;
          transition: transform 0.3s ease;
        }

        .logout-btn:hover .logout-icon {
          transform: translateX(3px);
        }

        .dashboard-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
          margin-bottom: 0.5rem;
        }

        .dashboard-btn:hover {
          background: linear-gradient(90deg, #2563eb, #1d4ed8);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
        }

        .dashboard-icon {
          font-size: 1rem;
          transition: transform 0.3s ease;
        }

        .dashboard-btn:hover .dashboard-icon {
          transform: scale(1.1);
        }

        .mobile-cta {
          display: none;
          width: 100%;
          justify-content: center;
          margin-top: 1rem;
        }

        /* Animated Hamburger Menu */
        .menu-toggle {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          gap: 4px;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .menu-toggle:hover {
          background: rgba(255, 182, 193, 0.1);
        }

        .menu-line {
          width: 25px;
          height: 2px;
          background: #2E8B57;
          border-radius: 2px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }

        .navbar.scrolled .menu-line {
          background: #2E8B57;
        }

        .menu-toggle.active .line-1 {
          transform: rotate(45deg) translate(6px, 6px);
          background: #FF69B4;
        }

        .menu-toggle.active .line-2 {
          opacity: 0;
          transform: scale(0);
        }

        .menu-toggle.active .line-3 {
          transform: rotate(-45deg) translate(6px, -6px);
          background: #FF69B4;
        }

        /* Mobile Styles */
        @media (max-width: 1024px) {
          .nav-links {
            gap: 1rem;
            padding: 0.5rem 1rem;
          }
          
          .nav-link {
            font-size: 0.85rem;
            padding: 0.5rem;
          }
        }

        @media (max-width: 768px) {
          .nav-container {
            padding: 0 1.5rem;
          }

          .desktop-cta {
            display: none;
          }

          .auth-button {
            display: none;
          }

          .nav-links {
            position: fixed;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.98); /* White mobile menu */
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-top: none;
            flex-direction: column;
            padding: 2rem;
            gap: 1rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            transform: translateY(-20px);
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 0 0 20px 20px;
          }

          .nav-links-active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          .nav-item {
            width: 100%;
          }

          .nav-link {
            font-size: 1.1rem;
            padding: 0.75rem 0;
            text-align: center;
            width: 100%;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            justify-content: center;
          }

          .nav-link:last-child {
            border-bottom: none;
          }

          .nav-link-underline {
            display: none;
          }

          .dropdown-menu {
            position: static;
            background: transparent;
            box-shadow: none;
            border: none;
            opacity: 1;
            visibility: visible;
            transform: none;
            padding: 0.5rem 0 0 1rem;
            min-width: auto;
          }

          .dropdown-link {
            padding: 0.5rem 1rem;
            border-left: 2px solid rgba(255, 182, 193, 0.3);
            font-size: 1rem;
          }

          .dropdown-arrow {
            display: none;
          }

          .mobile-cta {
            display: flex;
          }

          .menu-toggle {
            display: flex;
          }

          /* Adjust logo for mobile */
          .logo-line-1 {
            font-size: 0.95rem;
          }

          .logo-line-2 {
            font-size: 1.2rem;
          }

          .logo-line-3 {
            font-size: 0.8rem;
          }

          .logo-icon {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            padding: 0 1rem;
          }

          /* Hide full logo text on very small screens, show icon only */
          .logo-text {
            display: none;
          }

          .nav-links {
            padding: 1.5rem 1rem;
          }
        }

        /* Animations */
        @keyframes bloom {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.1) rotate(5deg);
          }
          50% {
            transform: scale(1.05) rotate(-5deg);
          }
          75% {
            transform: scale(1.1) rotate(3deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </nav>
  );
}