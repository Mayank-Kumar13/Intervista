import React from 'react';
import { Mic, ArrowRight, Play, Zap, MessageSquare, Target } from 'lucide-react';
import LaptopMockup from './LaptopMockup';

export default function Hero({ onStartInterview, onWatchDemo }) {
  return (
    <section
      id="hero"
      style={{
        paddingTop: 'calc(var(--nav-height) + 3.5rem)',
        paddingBottom: '5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 1fr',
            gap: '3.5rem',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Left Column: Copy & Actions */}
          <div style={{ maxWidth: '580px' }}>
            {/* Main Headline */}
            <h1
              className="serif-heading"
              style={{
                fontSize: 'clamp(2.75rem, 5.2vw, 4.25rem)',
                lineHeight: 1.08,
                marginBottom: '1.6rem',
                letterSpacing: '-0.03em',
              }}
            >
              Your next <br />
              interview, <br />
              <span className="gold-italic">reimagined.</span>
            </h1>

            {/* Supporting Copy */}
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.08rem',
                lineHeight: 1.68,
                marginBottom: '2.4rem',
                maxWidth: '520px',
              }}
            >
              Run realistic, voice-based mock interviews that listen, challenge
              your answers, and provide instant, personalized feedback — so you
              can walk into your dream job with confidence.
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '3rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => onStartInterview()}
                className="btn-primary"
                style={{
                  padding: '0.82rem 1.65rem',
                  fontSize: '0.95rem',
                }}
              >
                <Mic size={17} />
                <span>Start an Interview</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onWatchDemo}
                className="btn-secondary"
                style={{
                  padding: '0.82rem 1.65rem',
                  fontSize: '0.95rem',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Play size={10} fill="currentColor" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* 3 Value Propositions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '1.8rem',
                flexWrap: 'wrap',
              }}
            >
              {[
                { icon: Zap, text: 'Real-time voice conversations' },
                { icon: MessageSquare, text: 'Instant, actionable feedback' },
                { icon: Target, text: 'Practice for any role or industry' },
              ].map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                    }}
                  >
                    <Icon size={15} color="var(--accent-gold)" />
                    <span
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.82rem',
                        fontWeight: 400,
                      }}
                    >
                      {val.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: High Quality Laptop Dashboard */}
          <div style={{ position: 'relative' }}>
            <LaptopMockup onTryDemo={onWatchDemo} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 3.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
