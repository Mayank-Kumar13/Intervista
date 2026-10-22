import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({
  currentPage = 'home',
  currentView,
  onNavigate,
  onStartInterview,
  onOpenLogin,
  onOpenContact,
  onNavigateToDashboard,
  onNavigateToHome,
}) {
  const activePage = currentView || currentPage || 'home';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (item.isContact) {
      if (onOpenContact) onOpenContact();
      return;
    }

    if (item.page === 'dashboard') {
      if (onNavigate) onNavigate('dashboard');
      else if (onNavigateToDashboard) onNavigateToDashboard();
      return;
    }

    if (item.page === 'companies') {
      if (onNavigate) onNavigate('companies');
      return;
    }

    if (item.page === 'plans') {
      if (onNavigate) onNavigate('plans');
      else window.location.hash = '#plans';
      return;
    }

    // Navigating to a section on home (e.g. hero, reviews)
    if (onNavigate) {
      onNavigate('home', item.id);
    } else if (onNavigateToHome) {
      onNavigateToHome();
      if (item.id && item.id !== 'hero') {
        setTimeout(() => {
          const el = document.getElementById(item.id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    } else {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { label: 'HOME', page: 'home', id: 'hero' },
    { label: 'DASHBOARD', page: 'dashboard', id: 'dashboard' },
    { label: 'COMPANIES', page: 'companies', id: 'companies' },
    { label: 'PLANS', page: 'plans', id: 'plans' },
    { label: 'CONTACT US', id: 'contact', isContact: true },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        backgroundColor: scrolled ? 'rgba(9, 9, 9, 0.92)' : 'rgba(9, 9, 9, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 'var(--nav-height)',
        }}
      >
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('home', 'hero');
            else if (onNavigateToHome) onNavigateToHome();
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
        >
          {/* Intervista Official Logo */}
          <div
            style={{
              position: 'relative',
              width: '30px',
              height: '30px',
              borderRadius: '7px',
              overflow: 'hidden',
              border: '1px solid rgba(217, 183, 122, 0.4)',
              boxShadow: '0 0 12px rgba(217, 183, 122, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0a0a0a',
              flexShrink: 0,
            }}
          >
            <img
              src="/logo.png"
              alt="Intervista"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
            }}
          >
            Intervista
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="desktop-nav"
        >
          {navItems.map((item) => {
            const isActive =
              (item.page === 'companies' && activePage === 'companies') ||
              (item.page === 'dashboard' && activePage === 'dashboard') ||
              (item.page === 'plans' && activePage === 'plans') ||
              (item.page === 'home' && item.id === 'hero' && activePage === 'home' && !scrolled);

            return (
              <a
                key={item.label}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item)}
                style={{
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  transition: 'color var(--transition-fast)',
                  position: 'relative',
                  padding: '0.4rem 0',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {item.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '16px',
                      height: '2px',
                      backgroundColor: 'var(--accent-gold)',
                      borderRadius: '9999px',
                      boxShadow: '0 0 8px rgba(217, 183, 122, 0.6)',
                    }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Buttons */}
        <div
          className="desktop-actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
          }}
        >
          <button
            onClick={onOpenLogin}
            className="btn-ghost-outline"
            style={{
              padding: '0.52rem 1.25rem',
              fontSize: '0.86rem',
              color: 'var(--text-primary)',
            }}
          >
            Log in
          </button>
          <button
            onClick={() => onStartInterview()}
            className="btn-primary"
            style={{
              padding: '0.55rem 1.25rem',
              fontSize: '0.86rem',
              fontWeight: 600,
            }}
          >
            Start Interview
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="mobile-toggle"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#0F0F0F',
            borderBottom: '1px solid var(--border-card)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {navItems.map((item) => {
            const isActive =
              (item.page === 'companies' && activePage === 'companies') ||
              (item.page === 'dashboard' && activePage === 'dashboard') ||
              (item.page === 'plans' && activePage === 'plans') ||
              (item.page === 'home' && item.id === 'hero' && activePage === 'home' && !scrolled);

            return (
              <a
                key={item.label}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item)}
                style={{
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  padding: '0.25rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-gold)',
                      boxShadow: '0 0 6px var(--accent-gold)',
                    }}
                  />
                )}
              </a>
            );
          })}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="btn-ghost-outline"
              style={{ flex: 1 }}
            >
              Log in
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartInterview();
              }}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              Start Interview
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 868px) {
          .desktop-nav, .desktop-actions {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
