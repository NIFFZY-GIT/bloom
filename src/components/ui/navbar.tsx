'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, CSSProperties } from 'react';

// --- Helper function to combine styles ---
const combineStyles = (...styleObjects: CSSProperties[]): CSSProperties => {
  return Object.assign({}, ...styleObjects);
};

interface NavbarProps {
  isAuthenticated: boolean;
  userRole: string | null;
}

export default function Navbar({ isAuthenticated, userRole }: NavbarProps) {
  // --- State Management ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBookingsDropdownOpen, setIsBookingsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  // State for hover effects
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  
  // State for responsive design
  const [isMobile, setIsMobile] = useState(false);

  // --- Refs ---
  const bookingsDropdownRef = useRef<HTMLDivElement | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);
  // MODIFICATION: Add a ref to manage the dropdown close timer
  const bookingsTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const router = useRouter();
  const pathname = usePathname();

  // --- Effects ---

  // Effect for scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Effect for responsive breakpoint
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Effect to close menu on route change
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    setIsBookingsDropdownOpen(false);
    setIsProfileDropdownOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Effect to disable body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (isBookingsDropdownOpen && bookingsDropdownRef.current && !bookingsDropdownRef.current.contains(target)) {
        setIsBookingsDropdownOpen(false);
      }
      if (isProfileDropdownOpen && profileDropdownRef.current && !profileDropdownRef.current.contains(target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isBookingsDropdownOpen, isProfileDropdownOpen]);

  // --- Handlers ---
  const handleAuthClick = () => {
    if (isAuthenticated) {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    } else {
      setIsMenuOpen(false);
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Logout failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsProfileDropdownOpen(false);
      setIsMenuOpen(false);
      setHoveredItemId(null);
      router.push('/');
      router.refresh();
    }
  };

  const handleBookNow = () => {
    setIsMenuOpen(false);
    router.push('/create_pkg');
  };

  // MODIFICATION START: Handlers for the bookings dropdown with delay
  const handleBookingsMouseEnter = () => {
    if (bookingsTimeoutRef.current) {
      clearTimeout(bookingsTimeoutRef.current);
    }
    setIsBookingsDropdownOpen(true);
  };

  const handleBookingsMouseLeave = () => {
    bookingsTimeoutRef.current = setTimeout(() => {
      setIsBookingsDropdownOpen(false);
    }, 200); // 200ms delay before closing
  };
  // MODIFICATION END

  // --- Navigation Data ---
  const navItems = [
    { id: '/', label: 'Home' },
    { id: '/about-us', label: 'About Us' },
    {
      id: 'bookings',
      label: 'Bookings',
      dropdown: [
        { id: '/packages', label: 'Packages' },
        { id: '/create_pkg', label: 'Create Package' }
      ]
    },
    { id: '/gallery', label: 'Gallery' },
    { id: '/contact-us', label: 'Contact Us' }
  ];
  
  // --- Inline Styles Object ---
  const styles: { [key: string]: CSSProperties } = {
    nav: {
      position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000,
      transition: 'background-color 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
      backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.85)' : '#ffffff',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      WebkitBackdropFilter: isScrolled ? 'blur(10px)' : 'none',
      boxShadow: isScrolled ? '0 2px 20px rgba(0, 0, 0, 0.07)' : 'none',
      borderBottom: isScrolled ? '1px solid transparent' : '1px solid #e2e8f0',
    },
    container: { maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' },
    flexBetween: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '5.5rem' },
    logoContainer: { display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' },
    logoTextPrimary: { fontSize: '1.25rem', fontWeight: 700, color: '#1a202c' },
    logoTextSecondary: { fontSize: '0.7rem', fontWeight: 400, color: '#718096', letterSpacing: '0.05em', textTransform: 'uppercase' },
    desktopNavContainer: { display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '0.5rem' },
    navLink: {
      position: 'relative', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem',
      fontWeight: 500, textDecoration: 'none', color: '#4a5568', backgroundColor: 'transparent',
      border: 'none', cursor: 'pointer', transition: 'color 0.3s ease, background-color 0.3s ease',
    },
    navLinkActive: { color: '#00796B' },
    dropdownContainer: {
      position: 'absolute', left: 0, top: '100%', marginTop: '1rem', width: '12rem',
      borderRadius: '0.75rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
      backgroundColor: '#ffffff', border: '1px solid #edf2f7', padding: '0.5rem',
      opacity: isBookingsDropdownOpen ? 1 : 0, visibility: isBookingsDropdownOpen ? 'visible' : 'hidden',
      transform: isBookingsDropdownOpen ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease',
      zIndex: 1001, pointerEvents: isBookingsDropdownOpen ? 'auto' : 'none',
    },
    dropdownLink: { display: 'block', padding: '0.6rem 1rem', fontSize: '0.9rem', borderRadius: '0.5rem', textDecoration: 'none', color: '#4a5568' },
    authContainer: { display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '0.75rem' },
    ctaButton: {
      padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#ffffff',
      backgroundColor: '#00796B', border: 'none', borderRadius: '9999px', cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease', boxShadow: '0 4px 15px -5px rgba(0, 121, 107, 0.5)',
    },
    authButton: {
      padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#2d3748',
      backgroundColor: '#edf2f7', border: 'none', borderRadius: '9999px', cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.3s ease',
    },
    profileDropdown: {
      position: 'absolute', right: 0, top: 'calc(100% + 0.75rem)', width: '12rem',
      borderRadius: '0.75rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
      backgroundColor: '#ffffff', border: '1px solid #edf2f7', padding: '0.5rem',
      display: 'flex', flexDirection: 'column', gap: '0.25rem',
      opacity: isProfileDropdownOpen ? 1 : 0, visibility: isProfileDropdownOpen ? 'visible' : 'hidden',
      transform: isProfileDropdownOpen ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease',
      zIndex: 1002, pointerEvents: isProfileDropdownOpen ? 'auto' : 'none',
    },
    profileDropdownItem: {
      display: 'block', width: '100%', padding: '0.65rem 0.75rem', borderRadius: '0.5rem',
      fontSize: '0.9rem', textDecoration: 'none', backgroundColor: 'transparent',
      color: '#2d3748', border: 'none', textAlign: 'left', cursor: 'pointer',
      transition: 'background-color 0.2s ease, color 0.2s ease',
    },
    profileDropdownDivider: { height: '1px', backgroundColor: '#e2e8f0', margin: '0.35rem 0' },
    hamburgerButton: {
      display: isMobile ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'space-around',
      width: '2rem', height: '2rem', background: 'transparent', border: 'none',
      cursor: 'pointer', padding: 0, zIndex: 1001,
    },
    hamburgerLine: { width: '2rem', height: '2px', borderRadius: '10px', backgroundColor: '#2d3748', transition: 'all 0.3s linear', position: 'relative', transformOrigin: '1px' },
    mobileMenuOverlay: {
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: '#ffffff', zIndex: 999, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.3s ease-in-out',
      opacity: isMenuOpen ? 1 : 0, visibility: isMenuOpen ? 'visible' : 'hidden',
    },
    mobileNavLinksContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', textAlign: 'center' },
    mobileNavLink: { fontSize: '1.5rem', fontWeight: 600, color: '#2d3748', textDecoration: 'none' },
    mobileActionsContainer: { width: '100%', marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0 2rem' },
    mobilePrimaryButton: {
      width: '100%', padding: '0.9rem 1.5rem', fontSize: '1rem', fontWeight: 600, color: '#ffffff',
      backgroundColor: '#00796B', border: 'none', borderRadius: '9999px', cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease', boxShadow: '0 4px 15px -5px rgba(0, 121, 107, 0.5)',
    },
    mobileSecondaryButton: {
      width: '100%', padding: '0.9rem 1.5rem', fontSize: '1rem', fontWeight: 600, color: '#2d3748',
      backgroundColor: '#edf2f7', border: 'none', borderRadius: '9999px', cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
  };

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.container}>
          <div style={styles.flexBetween}>
            {/* Logo */}
            <Link href="/" style={styles.logoContainer}>
              <span style={{ fontSize: '2.25rem' }}>🌺</span>
              <div>
                <div style={styles.logoTextPrimary}>Tropical Bloom</div>
                <div style={styles.logoTextSecondary}>Tourism</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div style={styles.desktopNavContainer}>
              {navItems.map((item) => (
                <div
                  key={item.id}
                  style={{ position: 'relative' }}
                  // MODIFICATION: Use the new delayed handlers
                  onMouseEnter={item.dropdown ? handleBookingsMouseEnter : undefined}
                  onMouseLeave={item.dropdown ? handleBookingsMouseLeave : undefined}
                  ref={item.dropdown ? bookingsDropdownRef : null}
                >
                  {item.dropdown ? (
                    <button
                      type="button"
                      style={combineStyles(
                        styles.navLink,
                        pathname.startsWith('/packages') || pathname.startsWith('/create_pkg') ? styles.navLinkActive : {},
                        (hoveredItemId === item.id || isBookingsDropdownOpen) ? { backgroundColor: '#f7fafc' } : {}
                      )}
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      aria-haspopup="true"
                      aria-expanded={isBookingsDropdownOpen}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={item.id}
                      style={combineStyles(
                        styles.navLink,
                        pathname === item.id ? styles.navLinkActive : {},
                        hoveredItemId === item.id ? { backgroundColor: '#f7fafc' } : {}
                      )}
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                    >
                      {item.label}
                    </Link>
                  )}
                  {item.dropdown && (
                    <div style={styles.dropdownContainer}>
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.id}
                          href={subItem.id}
                          style={combineStyles(
                            styles.dropdownLink,
                            pathname === subItem.id ? { color: '#00796B' } : {},
                            hoveredItemId === subItem.id ? { backgroundColor: '#f7fafc', color: '#00796B'} : {}
                          )}
                          onMouseEnter={() => setHoveredItemId(subItem.id)}
                          onMouseLeave={() => setHoveredItemId(null)}
                          onClick={() => setIsBookingsDropdownOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Auth and CTA (No changes here) */}
            <div style={styles.authContainer}>
              <button type="button" style={combineStyles(styles.ctaButton, hoveredItemId === 'cta' ? { transform: 'translateY(-2px)', boxShadow: '0 8px 20px -5px rgba(0, 121, 107, 0.6)' } : {})} onClick={handleBookNow} onMouseEnter={() => setHoveredItemId('cta')} onMouseLeave={() => setHoveredItemId(null)}>
                Book Now
              </button>
              <div style={{ position: 'relative' }} ref={profileDropdownRef}>
                <button type="button" onClick={handleAuthClick} style={combineStyles(styles.authButton, hoveredItemId === 'auth' ? { backgroundColor: '#e2e8f0', transform: 'translateY(-2px)' } : {}, isProfileDropdownOpen ? { backgroundColor: '#e2e8f0' } : {})} onMouseEnter={() => setHoveredItemId('auth')} onMouseLeave={() => setHoveredItemId(null)} aria-haspopup="true" aria-expanded={isProfileDropdownOpen}>
                  {isAuthenticated ? (userRole === 'ADMIN' ? 'Admin' : 'Profile') : 'Login'}
                </button>
                {isAuthenticated && (
                  <div style={styles.profileDropdown} role="menu">
                    <Link href={userRole === 'ADMIN' ? '/admin/dashboard' : '/user_dashboard'} style={combineStyles(styles.profileDropdownItem, hoveredItemId === 'profile-dashboard' ? { backgroundColor: '#f7fafc', color: '#00796B' } : {})} onClick={() => setIsProfileDropdownOpen(false)} onMouseEnter={() => setHoveredItemId('profile-dashboard')} onMouseLeave={() => setHoveredItemId(null)} role="menuitem">
                      {userRole === 'ADMIN' ? 'Admin Dashboard' : 'My Trips'}
                    </Link>
                    {userRole === 'ADMIN' && (
                      <Link href="/admin/packages" style={combineStyles(styles.profileDropdownItem, hoveredItemId === 'profile-packages' ? { backgroundColor: '#f7fafc', color: '#00796B' } : {})} onClick={() => setIsProfileDropdownOpen(false)} onMouseEnter={() => setHoveredItemId('profile-packages')} onMouseLeave={() => setHoveredItemId(null)} role="menuitem">
                        Manage Packages
                      </Link>
                    )}
                    <div style={styles.profileDropdownDivider} />
                    <button type="button" style={combineStyles(styles.profileDropdownItem, hoveredItemId === 'profile-logout' ? { backgroundColor: '#fff5f5', color: '#c53030' } : {})} onClick={handleLogout} onMouseEnter={() => setHoveredItemId('profile-logout')} onMouseLeave={() => setHoveredItemId(null)} role="menuitem">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button (No changes here) */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={styles.hamburgerButton}>
                <div style={combineStyles(styles.hamburgerLine, isMenuOpen ? { transform: 'rotate(45deg)', backgroundColor: '#4a5568' } : { transform: 'rotate(0)' })} />
                <div style={combineStyles(styles.hamburgerLine, isMenuOpen ? { opacity: 0, transform: 'translateX(20px)' } : { opacity: 1, transform: 'translateX(0)' })} />
                <div style={combineStyles(styles.hamburgerLine, isMenuOpen ? { transform: 'rotate(-45deg)', backgroundColor: '#4a5568' } : { transform: 'rotate(0)' })} />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-Screen Mobile Menu (No changes here) */}
      {isMobile && (
        <div style={styles.mobileMenuOverlay}>
            <div style={styles.mobileNavLinksContainer}>
                {navItems.map((item) => (
                     <div key={item.id} style={{textAlign: 'center'}}>
                     {item.dropdown ? (
                       <>
                         <span style={combineStyles(styles.mobileNavLink, {color: '#a0aec0', fontSize: '1rem', textTransform: 'uppercase'})}>{item.label}</span>
                         <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                           {item.dropdown.map(subItem => (
                             <Link key={subItem.id} href={subItem.id} style={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                               {subItem.label}
                             </Link>
                           ))}
                         </div>
                       </>
                     ) : (
                       <Link href={item.id} style={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                         {item.label}
                       </Link>
                     )}
                   </div>
                ))}
            </div>
            <div style={styles.mobileActionsContainer}>
              <button type="button" style={styles.mobilePrimaryButton} onClick={() => { setIsMenuOpen(false); router.push('/create_pkg'); }}>
                Book Now
              </button>
              {isAuthenticated ? (
                <>
                  <button type="button" style={styles.mobileSecondaryButton} onClick={() => { setIsMenuOpen(false); router.push(userRole === 'ADMIN' ? '/admin/dashboard' : '/user_dashboard'); }}>
                    {userRole === 'ADMIN' ? 'Admin Dashboard' : 'My Trips'}
                  </button>
                  <button type="button" style={combineStyles(styles.mobileSecondaryButton, { backgroundColor: '#fff5f5', color: '#c53030' })} onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <button type="button" style={styles.mobileSecondaryButton} onClick={() => { setIsMenuOpen(false); router.push('/login'); }}>
                  Login
                </button>
              )}
            </div>
        </div>
      )}
    </>
  );
}