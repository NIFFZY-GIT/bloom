'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import styles from './AdminSidebar.module.css';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/packages', label: 'Packages', icon: '📦' },
  { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { href: '/admin/places', label: 'Add Custom Places', icon: '📍' },
  { href: '/admin/custompackages', label: 'Custom Packages', icon: '✅' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/admingallery', label: 'Gallery', icon: '📸' },
  { href: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  { href: '/admin/categories', label: 'Add Categories', icon: '📂' },
  { href: '/admin/home_places', label: 'Add Places', icon: '📍' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className={`${styles.hamburgerButton} ${isMobileMenuOpen ? styles.open : ''}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileMenuOpen}
      >
        <div className={styles.hamburgerLine} />
        <div className={styles.hamburgerLine} />
        <div className={styles.hamburgerLine} />
      </button>

      {/* Mobile overlay */}
      <div
        className={`${styles.mobileOverlay} ${isMobileMenuOpen ? styles.visible : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`${styles.adminSidebar} ${isMobileMenuOpen ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🌴</span>
          <div className={styles.logoText}>
            <span className={styles.logoName}>Admin Panel</span>
            <span className={styles.logoSubtitle}>Tropical Bloom</span>
          </div>
        </div>
      </div>

      <nav className={styles.sidebarNav}>
        {NAV_ITEMS.map(item => {
          const isActive = pathname.startsWith(item.href);
          const className = [
            styles.navItem,
            isActive ? styles.active : '',
            item.disabled ? styles.disabled : '',
          ].filter(Boolean).join(' ');

          if (item.disabled) {
            return (
              <span key={item.href} className={className}>
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </span>
            );
          }

          return (
            <Link key={item.href} href={item.href} className={className}>
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <Link href="/" className={[styles.navItem, styles.footerLink].join(' ')}>
          <span className={styles.navIcon}>🏠</span>
          <span>Back to Site</span>
        </Link>
      </div>
    </aside>
    </>
  );
}
