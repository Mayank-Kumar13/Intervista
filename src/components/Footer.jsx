import React from 'react';

export default function Footer({ onOpenLegal, onSelectRole, onNavigate }) {
  const scrollTo = (id) => {
    if (id === 'companies') {
      if (onNavigate) onNavigate('companies');
      else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    if (onNavigate) {
      onNavigate('home', id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      style={{
        backgroundColor: '#070707',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '5rem 0 3rem 0',
        position: 'relative',
      }}
    >
      <div className="container">
        {/* Main Footer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '3.5rem',
            marginBottom: '4rem',
          }}
          className="footer-grid"
        >
          {/* Brand Info */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1.25rem',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z"
                  fill="var(--accent-gold)"
                />
              </svg>
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
            </div>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                lineHeight: 1.65,
                maxWidth: '340px',
                marginBottom: '1.5rem',
              }}
            >
              The premier AI-powered mock interview simulator. Experience realistic voice conversations, adaptive questions, and instant granular feedback.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'var(--text-tertiary)',
                fontSize: '0.8rem',
              }}
            >
              <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
              <span>Real-time voice models online</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1.25rem',
              }}
            >
              Product
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { name: 'Voice Mock Interviews', id: 'features' },
                { name: 'Role Practice Library', id: 'roles' },
                { name: 'Plans & Pricing', id: 'pricing' },
                { name: 'Performance Analytics', id: 'analysis' },
                { name: 'How It Works', id: 'how-it-works' },
                { name: 'Company Question Bank', id: 'companies' },
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1.25rem',
              }}
            >
              Resources
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'Software Engineer Guide',
                'Product Sense Frameworks',
                'System Design Cheatsheet',
                'Behavioral STAR Method',
                'Interview Scoring Rubric',
              ].map((res, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onSelectRole && onSelectRole(res)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
                  >
                    {res}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company & Trust */}
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1.25rem',
              }}
            >
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'About Intervista',
                'Engineering & AI Core',
                'Privacy Principles',
                'Security & Audio Retention',
                'Contact Support',
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onOpenLegal && onOpenLegal(item)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div
            style={{
              color: 'var(--text-tertiary)',
              fontSize: '0.82rem',
            }}
          >
            © {new Date().getFullYear()} Intervista AI. All rights reserved. Built for ambitious candidates.
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.75rem',
            }}
          >
            {['Privacy Policy', 'Terms of Service', 'Security', 'Audio Ethics'].map((leg, i) => (
              <button
                key={i}
                onClick={() => onOpenLegal && onOpenLegal(leg)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--text-secondary)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--text-tertiary)')}
              >
                {leg}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 580px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
