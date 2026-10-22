import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { gsap } from 'gsap';

export default function Navbar({
  currentPage = 'home',
  currentView,
  onNavigate,
  onStartInterview,
  onOpenLogin,
  onOpenSignup,
  currentUser,
  onLogout,
  onOpenContact,
  onNavigateToDashboard,
  onNavigateToHome,
}) {
  const activePage = currentView || currentPage || 'home';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // GSAP Animation Refs for PillNav
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoRef = useRef(null);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);
  const navItemsRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navItems = [
    { label: 'HOME', page: 'home', id: 'hero' },
    { label: 'DASHBOARD', page: 'dashboard', id: 'dashboard' },
    { label: 'COMPANIES', page: 'companies', id: 'companies' },
    { label: 'PLANS', page: 'plans', id: 'plans' },
    { label: 'CONTACT US', id: 'contact', isContact: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // PillNav rising circle & text flip GSAP setup
  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        if (!w || !h) return;

        // Calculate radius and origin for rising circle to completely fill the pill
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector('.pill-label');
        const hoverLabel = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 14, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(
          circle,
          {
            scale: 1.25,
            xPercent: -50,
            duration: 0.7,
            ease: 'power3.out',
            overwrite: 'auto',
          },
          0
        );

        if (label) {
          tl.to(
            label,
            {
              y: -(h + 8),
              duration: 0.55,
              ease: 'power3.out',
              overwrite: 'auto',
            },
            0
          );
        }

        if (hoverLabel) {
          gsap.set(hoverLabel, { y: Math.ceil(h + 14), opacity: 0 });
          tl.to(
            hoverLabel,
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: 'power3.out',
              overwrite: 'auto',
            },
            0
          );
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();
    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    // Entrance Animation
    if (navItemsRef.current) {
      const listItems = navItemsRef.current.querySelectorAll('li');
      gsap.set(listItems, { opacity: 0, y: -8 });
      gsap.to(listItems, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.1,
      });
    }

    if (logoRef.current) {
      gsap.set(logoRef.current, { scale: 0.9, opacity: 0 });
      gsap.to(logoRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
      });
    }

    return () => {
      window.removeEventListener('resize', onResize);
      tlRefs.current.forEach((tl) => tl?.kill());
      activeTweenRefs.current.forEach((tw) => tw?.kill());
      logoTweenRef.current?.kill();
    };
  }, [navItems.length]);

  const handleEnter = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.38,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  const handleLeave = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.32,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
      onComplete: () => gsap.set(img, { rotate: 0 }),
    });
  };

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);

    const menu = mobileMenuRef.current;
    if (menu) {
      if (newState) {
        gsap.set(menu, { display: 'flex', opacity: 0, y: -15 });
        gsap.to(menu, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'power3.out',
        });
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: -15,
          duration: 0.25,
          ease: 'power3.in',
          onComplete: () => {
            gsap.set(menu, { display: 'none' });
          },
        });
      }
    }
  };

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

    if (item.page === 'profile') {
      if (onNavigate) onNavigate('profile');
      else window.location.hash = '#profile';
      return;
    }

    // Navigating to a section on home (e.g. hero)
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
        {/* Brand Logo with Rotating GSAP Interaction */}
        <a
          href="#home"
          ref={logoRef}
          onMouseEnter={handleLogoEnter}
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('home', 'hero');
            else if (onNavigateToHome) onNavigateToHome();
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.22rem',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
        >
          {/* Official Intervista Emblem ('I' with shining star) - acts as first letter 'I' */}
          <div
            style={{
              position: 'relative',
              height: '31px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img
              ref={logoImgRef}
              src="/logo-emblem.png"
              alt="I"
              style={{
                height: '31px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 0 10px rgba(217, 183, 122, 0.55))',
                transition: 'transform 0.3s ease, filter 0.3s ease',
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
            Ntervista
          </span>
        </a>

        {/* Desktop GSAP PillNav Container */}
        <div
          ref={navItemsRef}
          className="desktop-pill-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '44px',
            backgroundColor: 'rgba(17, 17, 17, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '9999px',
            padding: '0 5px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
          }}
        >
          <ul
            role="menubar"
            style={{
              listStyle: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              margin: 0,
              padding: 0,
              height: '100%',
            }}
          >
            {navItems.map((item, i) => {
              const isActive =
                (item.page === 'companies' && activePage === 'companies') ||
                (item.page === 'dashboard' && activePage === 'dashboard') ||
                (item.page === 'plans' && activePage === 'plans') ||
                (item.page === 'home' && item.id === 'hero' && activePage === 'home' && !scrolled);

              return (
                <li key={item.label} role="none" style={{ display: 'flex', alignItems: 'center' }}>
                  <a
                    role="menuitem"
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item)}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                    className="pill-nav-item"
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '34px',
                      padding: '0 16px',
                      borderRadius: '9999px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      backgroundColor: isActive ? 'rgba(217, 183, 122, 0.12)' : 'transparent',
                      border: isActive ? '1px solid rgba(217, 183, 122, 0.3)' : '1px solid transparent',
                      transition: 'background-color 0.25s ease, border-color 0.25s ease',
                    }}
                  >
                    {/* Rising Circle Background Animation */}
                    <span
                      ref={(el) => {
                        circleRefs.current[i] = el;
                      }}
                      className="hover-circle"
                      style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: 0,
                        borderRadius: '50%',
                        zIndex: 1,
                        display: 'block',
                        pointerEvents: 'none',
                        background: 'linear-gradient(135deg, #F5E7C8 0%, #D9B77A 100%)',
                        willChange: 'transform',
                      }}
                      aria-hidden="true"
                    />

                    {/* Stacked Labels for Vertical Flip Animation */}
                    <span
                      className="label-stack"
                      style={{
                        position: 'relative',
                        display: 'inline-block',
                        lineHeight: 1,
                        zIndex: 2,
                        overflow: 'hidden',
                        padding: '2px 0',
                      }}
                    >
                      <span
                        className="pill-label"
                        style={{
                          position: 'relative',
                          zIndex: 2,
                          display: 'inline-block',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                          willChange: 'transform',
                        }}
                      >
                        {item.label}
                      </span>

                      <span
                        className="pill-label-hover"
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '2px',
                          zIndex: 3,
                          display: 'inline-block',
                          width: '100%',
                          textAlign: 'center',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          color: '#0A0A0A',
                          willChange: 'transform, opacity',
                        }}
                        aria-hidden="true"
                      >
                        {item.label}
                      </span>
                    </span>

                    {/* Active Tab Glow Dot */}
                    {isActive && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '3px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-gold)',
                          boxShadow: '0 0 6px rgba(217, 183, 122, 0.8)',
                          zIndex: 4,
                          pointerEvents: 'none',
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right CTA Actions */}
        <div
          className="desktop-actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
          }}
        >
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                onClick={() => (onNavigate ? onNavigate('profile') : (window.location.hash = '#profile'))}
                title="View My Profile & Career Journey"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  backgroundColor: activePage === 'profile' ? 'rgba(217, 183, 122, 0.22)' : 'rgba(217, 183, 122, 0.1)',
                  border: activePage === 'profile' ? '1px solid var(--accent-gold)' : '1px solid rgba(217, 183, 122, 0.3)',
                  borderRadius: '9999px',
                  color: 'var(--accent-gold)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: activePage === 'profile' ? '0 0 12px rgba(217, 183, 122, 0.35)' : 'none',
                }}
              >
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#0A0A0A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </span>
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name || currentUser.email}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="btn-ghost-outline"
                style={{
                  padding: '0.52rem 1.1rem',
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={onOpenLogin}
                className="btn-ghost-outline"
                style={{
                  padding: '0.52rem 1.15rem',
                  fontSize: '0.86rem',
                  color: 'var(--text-primary)',
                }}
              >
                Log In
              </button>
              <button
                onClick={onOpenSignup || onOpenLogin}
                className="btn-ghost-outline"
                style={{
                  padding: '0.52rem 1.15rem',
                  fontSize: '0.86rem',
                  borderColor: 'var(--accent-gold)',
                  color: 'var(--accent-gold)',
                }}
              >
                Sign Up
              </button>
            </>
          )}
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
          onClick={toggleMobileMenu}
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

      {/* Mobile Menu Dropdown with GSAP transition */}
      <div
        ref={mobileMenuRef}
        style={{
          display: 'none',
          backgroundColor: '#0F0F0F',
          borderBottom: '1px solid var(--border-card)',
          padding: '1.5rem',
          flexDirection: 'column',
          gap: '1rem',
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
                fontSize: '0.92rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                backgroundColor: isActive ? 'rgba(217, 183, 122, 0.08)' : 'transparent',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigate) onNavigate('profile');
                  else window.location.hash = '#profile';
                }}
                style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', cursor: 'pointer' }}
              >
                👤 {currentUser.name || currentUser.email} (View Profile)
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onLogout) onLogout();
                }}
                className="btn-ghost-outline"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="btn-ghost-outline"
                style={{ flex: 1 }}
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenSignup) onOpenSignup();
                  else onOpenLogin();
                }}
                className="btn-ghost-outline"
                style={{ flex: 1, borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }}
              >
                Sign Up
              </button>
            </div>
          )}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onStartInterview();
            }}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            Start Interview
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .desktop-pill-nav, .desktop-actions {
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
