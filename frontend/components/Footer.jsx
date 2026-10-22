import React from 'react';

export default function Footer({ onOpenLegal, onNavigate, onOpenContact }) {
  const handleNav = (page, sectionId) => {
    if (page === 'contact') {
      if (onOpenContact) onOpenContact();
      return;
    }
    if (onNavigate) {
      onNavigate(page, sectionId);
    } else {
      if (page === 'plans') window.location.hash = '#plans';
      else if (page === 'companies') window.location.hash = '#companies';
      else if (page === 'dashboard') window.location.hash = '#dashboard';
      else window.location.hash = '#home';
    }
  };

  return (
    <footer
      style={{
        backgroundColor: '#070707',
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        padding: '3.2rem 0 2.2rem 0',
        position: 'relative',
      }}
    >
      <div className="container">
        {/* Main Minimalist Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
          className="footer-top-row"
        >
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                position: 'relative',
                width: '28px',
                height: '28px',
                borderRadius: '7px',
                overflow: 'hidden',
                border: '1px solid rgba(217, 183, 122, 0.4)',
                boxShadow: '0 0 10px rgba(217, 183, 122, 0.25)',
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
                fontSize: '1.15rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
              }}
            >
              Intervista
            </span>
            <span
              style={{
                color: 'var(--text-tertiary)',
                fontSize: '0.82rem',
                marginLeft: '0.4rem',
              }}
            >
              · Voice-first AI mock interview practice
            </span>
          </div>

          {/* Clean Essential Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Home', page: 'home', id: 'hero' },
              { label: 'Dashboard', page: 'dashboard' },
              { label: 'Companies', page: 'companies' },
              { label: 'Plans', page: 'plans' },
              { label: 'Contact', page: 'contact' },
            ].map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.page, link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-tertiary)',
          }}
          className="footer-bottom-row"
        >
          <div>
            © {new Date().getFullYear()} Intervista AI. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service'].map((legal) => (
              <button
                key={legal}
                onClick={() => onOpenLegal && onOpenLegal(legal)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
              >
                {legal}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .footer-top-row, .footer-bottom-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
