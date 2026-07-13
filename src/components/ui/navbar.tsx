'use client';


import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, CSSProperties } from 'react';
import { signOut } from 'next-auth/react';

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
  // Mobile accordion state to make it explicit that Packages/Create Package
  // are children of Bookings in the mobile menu
  const [isMobileBookingsOpen, setIsMobileBookingsOpen] = useState(false);
 
  // State for hover effects
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
 
  // State for responsive design (enhanced with screen size categories)
  const [screenSize, setScreenSize] = useState<'xs' | 'sm' | 'md' | 'lg'>('lg');
 
  // --- Refs ---
  const bookingsDropdownRef = useRef<HTMLDivElement | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);
  // MODIFICATION: Add a ref to manage the dropdown close timer
  const bookingsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const pathname = usePathname();
 
  // Derived state for mobile check
  const isMobile = screenSize === 'xs' || screenSize === 'sm';
 
  // --- Effects ---
  // Effect for scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
 
  // Effect for responsive breakpoints (xs <640, sm 640-768, md 768-1024, lg >1024)
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('xs');
      } else if (width < 768) {
        setScreenSize('sm');
      } else if (width < 1024) {
        setScreenSize('md');
      } else {
        setScreenSize('lg');
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
 
  // Effect to close menu on route change
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    setIsBookingsDropdownOpen(false);
    setIsProfileDropdownOpen(false);
    setIsMobileBookingsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
 
  // Effect to disable body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  // Close mobile bookings submenu when mobile menu closes
  useEffect(() => {
    if (!isMenuOpen) {
      setIsMobileBookingsOpen(false);
    }
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
      // Sign out from NextAuth (this handles NextAuth sessions)
      await signOut({ redirect: false });
      
      // Also clear legacy auth token via API
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
 
  // --- Inline Styles Object (CSS Part - Conditional based on screenSize) ---
  const styles: { [key: string]: CSSProperties } = {
    nav: {
      position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000,
      transition: 'box-shadow 0.4s ease',
      backgroundColor: '#ffffff',
      boxShadow: isScrolled ? '0 2px 20px rgba(0, 0, 0, 0.07)' : 'none',
      borderBottom: '1px solid #e2e8f0',
    },
    container: { 
      maxWidth: '1280px', 
      margin: '0 auto', 
      padding: screenSize === 'xs' ? '0 0.5rem' : screenSize === 'sm' ? '0 1rem' : screenSize === 'md' ? '0 1.5rem' : '0 2rem'
    },
    flexBetween: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: isMobile ? '4.5rem' : '6rem' },
    logoContainer: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: screenSize === 'xs' ? '0.5rem' : '0.75rem', 
      textDecoration: 'none' 
    },
    logoTextPrimary: {
      fontFamily: 'var(--font-display)',
      fontSize: screenSize === 'xs' ? '1.1rem' : screenSize === 'sm' ? '1.25rem' : '1.4rem',
      fontWeight: 700,
      color: 'var(--navy)',
      letterSpacing: '-0.01em',
      lineHeight: 1.05,
    },
    logoTextSecondary: {
      fontSize: screenSize === 'xs' ? '0.6rem' : '0.68rem',
      fontWeight: 600,
      color: 'var(--brand)',
      letterSpacing: '0.22em',
      textTransform: 'uppercase'
    },
    desktopNavContainer: { 
      display: isMobile ? 'none' : 'flex', 
      alignItems: 'center', 
      gap: screenSize === 'md' ? '0.75rem' : '1rem' 
    },
    navLink: {
      position: 'relative', 
      padding: screenSize === 'md' ? '0.5rem 0.75rem' : '0.5rem 1rem', 
      borderRadius: '0.5rem', 
      fontSize: screenSize === 'md' ? '0.875rem' : '0.9rem',
      fontWeight: 500, 
      textDecoration: 'none', 
      color: '#4a5568', 
      backgroundColor: 'transparent',
      border: 'none', 
      cursor: 'pointer', 
      transition: 'color 0.3s ease, background-color 0.3s ease',
    },
    navLinkActive: { color: '#f59e0b' },
    dropdownContainer: {
      position: 'absolute', 
      left: 0, 
      top: '100%', 
      marginTop: '1rem', 
      width: '12rem',
      borderRadius: '0.75rem', 
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
      backgroundColor: '#ffffff', 
      border: '1px solid #edf2f7', 
      padding: '0.5rem',
      opacity: isBookingsDropdownOpen ? 1 : 0, 
      visibility: isBookingsDropdownOpen ? 'visible' : 'hidden',
      transform: isBookingsDropdownOpen ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease',
      zIndex: 1001, 
      pointerEvents: isBookingsDropdownOpen ? 'auto' : 'none',
    },
    dropdownLink: { 
      display: 'block', 
      padding: screenSize === 'md' ? '0.5rem 0.75rem' : '0.6rem 1rem', 
      fontSize: screenSize === 'md' ? '0.875rem' : '0.9rem', 
      borderRadius: '0.5rem', 
      textDecoration: 'none', 
      color: '#4a5568' 
    },
    authContainer: { 
      display: isMobile ? 'none' : 'flex', 
      alignItems: 'center', 
      gap: screenSize === 'md' ? '0.5rem' : '0.75rem' 
    },
    ctaButton: {
      padding: screenSize === 'md' ? '0.625rem 1.25rem' : '0.75rem 1.5rem', 
      fontSize: screenSize === 'md' ? '0.875rem' : '0.9rem', 
      fontWeight: 600, 
      color: '#ffffff',
      backgroundColor: '#f59e0b', 
      border: 'none', 
      borderRadius: '9999px', 
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
      boxShadow: '0 4px 15px -5px rgba(245, 158, 11, 0.5)',
    },
    authButton: {
      padding: screenSize === 'md' ? '0.625rem 1.25rem' : '0.75rem 1.5rem', 
      fontSize: screenSize === 'md' ? '0.875rem' : '0.9rem', 
      fontWeight: 600, 
      color: '#2d3748',
      backgroundColor: '#edf2f7', 
      border: 'none', 
      borderRadius: '9999px', 
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.3s ease',
    },
    profileDropdown: {
      position: 'absolute', 
      right: 0, 
      top: 'calc(100% + 0.75rem)', 
      width: '12rem',
      borderRadius: '0.75rem', 
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
      backgroundColor: '#ffffff', 
      border: '1px solid #edf2f7', 
      padding: '0.5rem',
      display: 'flex', 
      flexDirection: 'column', 
      gap: '0.25rem',
      opacity: isProfileDropdownOpen ? 1 : 0, 
      visibility: isProfileDropdownOpen ? 'visible' : 'hidden',
      transform: isProfileDropdownOpen ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease',
      zIndex: 1002, 
      pointerEvents: isProfileDropdownOpen ? 'auto' : 'none',
    },
    profileDropdownItem: {
      display: 'block', 
      width: '100%', 
      padding: screenSize === 'md' ? '0.5rem 0.625rem' : '0.65rem 0.75rem', 
      borderRadius: '0.5rem',
      fontSize: screenSize === 'md' ? '0.875rem' : '0.9rem', 
      textDecoration: 'none', 
      backgroundColor: 'transparent',
      color: '#2d3748', 
      border: 'none', 
      textAlign: 'left', 
      cursor: 'pointer',
      transition: 'background-color 0.2s ease, color 0.2s ease',
    },
    profileDropdownDivider: { height: '1px', backgroundColor: '#e2e8f0', margin: '0.35rem 0' },
    hamburgerButton: {
      display: isMobile ? 'flex' : 'none', 
      flexDirection: 'column', 
      justifyContent: 'space-around',
      width: screenSize === 'xs' ? '1.75rem' : '2rem', 
      height: screenSize === 'xs' ? '1.75rem' : '2rem', 
      background: 'transparent', 
      border: 'none',
      cursor: 'pointer', 
      padding: 0, 
      zIndex: 1001,
    },
    hamburgerLine: { 
      width: screenSize === 'xs' ? '1.75rem' : '2rem', 
      height: screenSize === 'xs' ? '1.5px' : '2px', 
      borderRadius: '10px', 
      backgroundColor: '#2d3748', 
      transition: 'all 0.3s linear', 
      position: 'relative', 
      transformOrigin: '1px' 
    },
    mobileMenuOverlay: {
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh',
      backgroundColor: '#ffffff', 
      zIndex: 999, 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      transition: 'opacity 0.3s ease-in-out',
      opacity: isMenuOpen ? 1 : 0, 
      visibility: isMenuOpen ? 'visible' : 'hidden',
    },
    mobileNavLinksContainer: { 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: screenSize === 'xs' ? '1.5rem' : '2rem', 
      textAlign: 'center',
      padding: screenSize === 'xs' ? '0 1rem' : '0' 
    },
    // Mobile-specific dropdown / accordion styles
    mobileDropdownParent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      color: '#2d3748',
      fontSize: screenSize === 'xs' ? '1.15rem' : '1.35rem',
      fontWeight: 600,
      width: '100%',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '1rem 1.25rem',
      borderRadius: '1rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: 'none',
    },
    mobileDropdownChevron: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1.75rem',
      height: '1.75rem',
      borderRadius: '50%',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontSize: '0.75rem',
      color: '#f59e0b',
      fontWeight: 'bold',
    },
    mobileDropdownContainer: {
      width: '100%',
      borderRadius: '1.25rem',
      padding: '0',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '2px solid transparent',
    },
    mobileDropdownList: {
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '0.5rem',
      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      maxHeight: 0,
      opacity: 0,
      marginTop: 0,
      padding: '0',
    },
    mobileDropdownItem: {
      width: '100%',
      textAlign: 'left',
      paddingLeft: '3rem',
      paddingRight: '1.5rem',
      paddingTop: '0.875rem',
      paddingBottom: '0.875rem',
      fontSize: screenSize === 'xs' ? '0.95rem' : '1.05rem',
      fontWeight: 500,
      color: '#4a5568',
      textDecoration: 'none',
      borderRadius: '0.75rem',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      backdropFilter: 'blur(8px)',
    },
    mobileDropdownItemIcon: {
      position: 'absolute',
      left: '1.25rem',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '1rem',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    mobileNavLink: { 
      fontSize: screenSize === 'xs' ? '1.15rem' : '1.35rem', 
      fontWeight: 600, 
      color: '#2d3748', 
      textDecoration: 'none',
      padding: '1rem 1.25rem',
      borderRadius: '1rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'inline-block',
    },
    mobileActionsContainer: { 
      width: '100%', 
      marginTop: screenSize === 'xs' ? '2rem' : '3rem', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: screenSize === 'xs' ? '1rem' : '1.25rem', 
      padding: screenSize === 'xs' ? '0 1rem' : '0 2rem' 
    },
    mobilePrimaryButton: {
      width: '100%', 
      padding: screenSize === 'xs' ? '0.75rem 1.25rem' : '0.9rem 1.5rem', 
      fontSize: screenSize === 'xs' ? '0.875rem' : '1rem', 
      fontWeight: 600, 
      color: '#ffffff',
      backgroundColor: '#f59e0b', 
      border: 'none', 
      borderRadius: '9999px', 
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
      boxShadow: '0 4px 15px -5px rgba(245, 158, 11, 0.5)',
    },
    mobileSecondaryButton: {
      width: '100%', 
      padding: screenSize === 'xs' ? '0.75rem 1.25rem' : '0.9rem 1.5rem', 
      fontSize: screenSize === 'xs' ? '0.875rem' : '1rem', 
      fontWeight: 600, 
      color: '#2d3748',
      backgroundColor: '#edf2f7', 
      border: 'none', 
      borderRadius: '9999px', 
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
  };
 
  // --- JSX Rendering (Functional Part) ---
  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.container}>
          <div style={styles.flexBetween}>
            {/* Logo */}
            <Link href="/" style={styles.logoContainer}>
              <Image 
                src="/logo/logo1.jpg" 
                alt="Tropical Bloom Logo" 
                width={screenSize === 'xs' ? 48 : screenSize === 'sm' ? 56 : 70} 
                height={screenSize === 'xs' ? 48 : screenSize === 'sm' ? 56 : 70}
                style={{ borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                priority
              />
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
                            pathname === subItem.id ? { color: '#f59e0b' } : {},
                            hoveredItemId === subItem.id ? { backgroundColor: '#f7fafc', color: '#f59e0b'} : {}
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
            {/* Auth and CTA */}
            <div style={styles.authContainer}>
              <button type="button" style={combineStyles(styles.ctaButton, hoveredItemId === 'cta' ? { transform: 'translateY(-2px)', boxShadow: '0 8px 20px -5px rgba(245, 158, 11, 0.6)' } : {})} onClick={handleBookNow} onMouseEnter={() => setHoveredItemId('cta')} onMouseLeave={() => setHoveredItemId(null)}>
                Book Now
              </button>
              <div style={{ position: 'relative' }} ref={profileDropdownRef}>
                <button type="button" onClick={handleAuthClick} style={combineStyles(styles.authButton, hoveredItemId === 'auth' ? { backgroundColor: '#e2e8f0', transform: 'translateY(-2px)' } : {}, isProfileDropdownOpen ? { backgroundColor: '#e2e8f0' } : {})} onMouseEnter={() => setHoveredItemId('auth')} onMouseLeave={() => setHoveredItemId(null)} aria-haspopup="true" aria-expanded={isProfileDropdownOpen}>
                  {isAuthenticated ? (userRole === 'ADMIN' ? 'Admin' : 'Profile') : 'Login'}
                </button>
                {isAuthenticated && (
                  <div style={styles.profileDropdown} role="menu">
                    <Link href={userRole === 'ADMIN' ? '/admin/dashboard' : '/user_dashboard'} style={combineStyles(styles.profileDropdownItem, hoveredItemId === 'profile-dashboard' ? { backgroundColor: '#f7fafc', color: '#f59e0b' } : {})} onClick={() => setIsProfileDropdownOpen(false)} onMouseEnter={() => setHoveredItemId('profile-dashboard')} onMouseLeave={() => setHoveredItemId(null)} role="menuitem">
                      {userRole === 'ADMIN' ? 'Admin Dashboard' : 'My Trips'}
                    </Link>
                    {userRole === 'ADMIN' && (
                      <Link href="/admin/packages" style={combineStyles(styles.profileDropdownItem, hoveredItemId === 'profile-packages' ? { backgroundColor: '#f7fafc', color: '#f59e0b' } : {})} onClick={() => setIsProfileDropdownOpen(false)} onMouseEnter={() => setHoveredItemId('profile-packages')} onMouseLeave={() => setHoveredItemId(null)} role="menuitem">
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
            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={styles.hamburgerButton}>
                <div style={combineStyles(styles.hamburgerLine, isMenuOpen ? { transform: 'rotate(45deg)', backgroundColor: '#4a5568' } : { transform: 'rotate(0)' })} />
                <div style={combineStyles(styles.hamburgerLine, isMenuOpen ? { opacity: 0, transform: 'translateX(20px)' } : { opacity: 1, transform: 'translateX(0)' })} />
                <div style={combineStyles(styles.hamburgerLine, isMenuOpen ? { transform: 'rotate(-45deg)', backgroundColor: '#4a5568' } : { transform: 'rotate(0)' })} />
            </button>
          </div>
        </div>
      </nav>
      {/* Full-Screen Mobile Menu */}
      {isMobile && (
        <div style={styles.mobileMenuOverlay}>
            <div style={styles.mobileNavLinksContainer}>
                {navItems.map((item) => (
                     <div key={item.id} style={{textAlign: 'center', width: '100%', maxWidth: '400px'}}>
                     {item.dropdown ? (
                       <div style={combineStyles(
                         styles.mobileDropdownContainer,
                         isMobileBookingsOpen ? { 
                           backgroundColor: 'rgba(240, 253, 244, 0.95)', 
                           padding: '0.5rem',
                           borderColor: 'rgba(245, 158, 11, 0.2)',
                           boxShadow: '0 4px 16px rgba(245, 158, 11, 0.08)'
                         } : {}
                       )}>
                         <button
                           type="button"
                           onClick={() => setIsMobileBookingsOpen(prev => !prev)}
                           style={combineStyles(
                             styles.mobileDropdownParent,
                             isMobileBookingsOpen ? { 
                               backgroundColor: 'rgba(245, 158, 11, 0.08)',
                               color: '#f59e0b'
                             } : {}
                           )}
                           aria-expanded={isMobileBookingsOpen}
                           aria-label={`${item.label} menu, ${isMobileBookingsOpen ? 'expanded' : 'collapsed'}`}
                         >
                           <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                             <span style={{fontSize: '1.1rem'}}>📋</span>
                             {item.label}
                           </span>
                           <span style={combineStyles(
                             styles.mobileDropdownChevron, 
                             isMobileBookingsOpen ? { 
                               transform: 'rotate(180deg)',
                               backgroundColor: '#f59e0b',
                               color: '#ffffff'
                             } : { transform: 'rotate(0)' }
                           )}>▾</span>
                         </button>
                         <div style={combineStyles(
                           styles.mobileDropdownList, 
                           isMobileBookingsOpen ? { 
                             maxHeight: '500px', 
                             opacity: 1, 
                             marginTop: '0.5rem',
                             padding: '0.5rem',
                             pointerEvents: 'auto' 
                           } : { 
                             maxHeight: 0, 
                             opacity: 0, 
                             marginTop: 0,
                             padding: '0',
                             pointerEvents: 'none' 
                           }
                         )}>
                           {item.dropdown.map((subItem) => (
                             <Link 
                               key={subItem.id} 
                               href={subItem.id} 
                               style={combineStyles(
                                 styles.mobileDropdownItem,
                                 pathname === subItem.id ? { 
                                   backgroundColor: '#f59e0b', 
                                   color: '#ffffff',
                                   fontWeight: 600,
                                   borderColor: '#f59e0b',
                                   boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                                 } : {}
                               )}
                               onClick={() => { setIsMenuOpen(false); setIsMobileBookingsOpen(false); }}
                               onMouseEnter={(e) => {
                                 if (pathname !== subItem.id) {
                                   e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.12)';
                                   e.currentTarget.style.color = '#f59e0b';
                                   e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                                   e.currentTarget.style.transform = 'translateX(8px) scale(1.02)';
                                   e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.15)';
                                   const icon = e.currentTarget.querySelector('[data-icon]') as HTMLElement;
                                   if (icon) icon.style.transform = 'translateY(-50%) scale(1.2)';
                                 }
                               }}
                               onMouseLeave={(e) => {
                                 if (pathname !== subItem.id) {
                                   e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                                   e.currentTarget.style.color = '#4a5568';
                                   e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                                   e.currentTarget.style.transform = 'translateX(0) scale(1)';
                                   e.currentTarget.style.boxShadow = 'none';
                                   const icon = e.currentTarget.querySelector('[data-icon]') as HTMLElement;
                                   if (icon) icon.style.transform = 'translateY(-50%) scale(1)';
                                 }
                               }}
                             >
                               <span 
                                 data-icon
                                 style={combineStyles(
                                   styles.mobileDropdownItemIcon,
                                   pathname === subItem.id ? { color: '#ffffff' } : { color: '#f59e0b' }
                                 )}
                               >
                                 {subItem.label === 'Packages' ? '📦' : '✨'}
                               </span>
                               {subItem.label}
                             </Link>
                           ))}
                         </div>
                       </div>
                     ) : (
                       <Link 
                         href={item.id} 
                         style={combineStyles(
                           styles.mobileNavLink,
                           pathname === item.id ? {
                             backgroundColor: 'rgba(245, 158, 11, 0.08)',
                             color: '#f59e0b'
                           } : {}
                         )}
                         onClick={() => setIsMenuOpen(false)}
                         onMouseEnter={(e) => {
                           if (pathname !== item.id) {
                             e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.05)';
                             e.currentTarget.style.color = '#f59e0b';
                           }
                         }}
                         onMouseLeave={(e) => {
                           if (pathname !== item.id) {
                             e.currentTarget.style.backgroundColor = 'transparent';
                             e.currentTarget.style.color = '#2d3748';
                           }
                         }}
                       >
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