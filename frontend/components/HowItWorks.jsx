import React, { useState, useEffect } from 'react';
import {
  User,
  Mic,
  BarChart3,
  ArrowRight,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  Volume2,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function HowItWorks() {
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const roles = ['Software Engineer', 'Product Manager', 'System Design', 'AI Engineer'];

  // Smoothly cycle active role preview in card 1
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section id="how-it-works" className="section-wrapper" style={{ padding: '6.5rem 0', position: 'relative' }}>
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '750px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(217, 183, 122, 0.06) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1200px' }}>
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '0.85rem' }}>
            <span
              className="eyebrow-tag"
              style={{
                color: 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(217, 183, 122, 0.09)',
                border: '1px solid rgba(217, 183, 122, 0.22)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.74rem',
              }}
            >
              <Sparkles size={12} />
              THREE SIMPLE STEPS
            </span>
          </div>

          <h2
            className="serif-heading"
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              lineHeight: 1.15,
              marginBottom: '1rem',
              color: 'var(--text-primary)',
            }}
          >
            How it works — <span className="gold-italic">From setup to mastery.</span>
          </h2>
          <p
            className="section-subtitle"
            style={{
              maxWidth: '560px',
              margin: '0 auto',
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            A high-fidelity simulation designed to replicate real tech and behavioural interview loops.
          </p>
        </div>

        {/* 3 Step Interactive Animated Grid */}
        <div className="how-it-works-grid">
          {/* STEP 1: CHOOSE YOUR ROLE */}
          <div className="animated-step-card step-card-1">
            <div className="card-top-tag">
              <span className="step-badge">STEP 01</span>
              <span className="step-subtag">CUSTOM CONFIG</span>
            </div>

            <div className="card-header-row">
              <div className="card-icon-halo">
                <User size={22} color="var(--accent-gold)" />
              </div>
              <div>
                <h3 className="card-title">Choose your role</h3>
                <p className="card-desc">Select role, focus area & seniority level.</p>
              </div>
            </div>

            {/* Interactive Animated Micro-UI for Step 1 */}
            <div className="micro-ui-box">
              <div className="micro-ui-label">Target Specialization</div>
              <div className="role-chips-row">
                {roles.map((role, idx) => (
                  <span
                    key={role}
                    className={`role-chip ${activeRoleIndex === idx ? 'active-chip' : ''}`}
                  >
                    {role}
                  </span>
                ))}
              </div>

              <div className="seniority-row">
                <span className="seniority-item">Entry</span>
                <span className="seniority-item active-seniority">Mid Level</span>
                <span className="seniority-item">Senior</span>
                <span className="seniority-item">Staff / Lead</span>
              </div>
            </div>
          </div>

          {/* CONNECTOR 1 -> 2 */}
          <div className="step-connector">
            <div className="beam-line" />
            <div className="arrow-badge">
              <ArrowRight size={17} className="desktop-arrow" />
              <ArrowDown size={17} className="mobile-arrow" />
            </div>
          </div>

          {/* STEP 2: TAKE THE INTERVIEW */}
          <div className="animated-step-card step-card-2 highlighted-step">
            <div className="card-top-tag">
              <span className="step-badge live-badge">
                <span className="live-dot" /> LIVE SIMULATION
              </span>
              <span className="step-subtag">VOICE-FIRST AI</span>
            </div>

            <div className="card-header-row">
              <div className="card-icon-halo pulsating-halo">
                <Mic size={22} color="var(--accent-gold)" />
              </div>
              <div>
                <h3 className="card-title">Take the interview</h3>
                <p className="card-desc">Natural voice conversation with adaptive follow-ups.</p>
              </div>
            </div>

            {/* Interactive Animated Micro-UI for Step 2 */}
            <div className="micro-ui-box">
              <div className="ai-question-bubble">
                <span className="ai-speaker-tag">AI Interviewer:</span>
                <p className="ai-speech-text">
                  "How would you optimize database cache invalidation under heavy write bursts?"
                </p>
              </div>

              {/* Animated Soundwave Visualizer Bars */}
              <div className="soundwave-container">
                <span className="soundwave-bar bar-1" />
                <span className="soundwave-bar bar-2" />
                <span className="soundwave-bar bar-3" />
                <span className="soundwave-bar bar-4" />
                <span className="soundwave-bar bar-5" />
                <span className="soundwave-bar bar-6" />
                <span className="soundwave-bar bar-7" />
                <span className="soundwave-bar bar-8" />
                <span className="soundwave-bar bar-9" />
                <span className="soundwave-bar bar-10" />
                <span className="soundwave-label">Candidate Speaking...</span>
              </div>
            </div>
          </div>

          {/* CONNECTOR 2 -> 3 */}
          <div className="step-connector">
            <div className="beam-line" />
            <div className="arrow-badge">
              <ArrowRight size={17} className="desktop-arrow" />
              <ArrowDown size={17} className="mobile-arrow" />
            </div>
          </div>

          {/* STEP 3: GET YOUR FEEDBACK */}
          <div className="animated-step-card step-card-3">
            <div className="card-top-tag">
              <span className="step-badge">STEP 03</span>
              <span className="step-subtag">INSTANT AUDIT</span>
            </div>

            <div className="card-header-row">
              <div className="card-icon-halo">
                <BarChart3 size={22} color="var(--accent-gold)" />
              </div>
              <div>
                <h3 className="card-title">Get your feedback</h3>
                <p className="card-desc">Granular scores, STAR structure & audio metrics.</p>
              </div>
            </div>

            {/* Interactive Animated Micro-UI for Step 3 */}
            <div className="micro-ui-box">
              {/* Score header */}
              <div className="score-summary-row">
                <span className="score-badge">94 / 100</span>
                <span className="score-grade">Tier-1 Ready ★</span>
              </div>

              {/* Progress metric bars */}
              <div className="metric-bars-stack">
                <div className="metric-item">
                  <div className="metric-header">
                    <span>Technical Architecture</span>
                    <span className="metric-val">92%</span>
                  </div>
                  <div className="metric-track">
                    <div className="metric-fill" style={{ width: '92%' }} />
                  </div>
                </div>

                <div className="metric-item">
                  <div className="metric-header">
                    <span>Communication & STAR</span>
                    <span className="metric-val">96%</span>
                  </div>
                  <div className="metric-track">
                    <div className="metric-fill gold-fill" style={{ width: '96%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoped CSS Styles for Animated Pipeline */}
      <style>{`
        .how-it-works-grid {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          gap: 1.25rem;
          position: relative;
        }

        .animated-step-card {
          flex: 1;
          background-color: #111111;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 22px;
          padding: 1.75rem 1.6rem;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
        }

        .animated-step-card:hover {
          transform: translateY(-6px);
          border-color: rgba(217, 183, 122, 0.45);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7), 0 0 30px rgba(217, 183, 122, 0.12);
        }

        .highlighted-step {
          background: linear-gradient(180deg, #161616 0%, #111111 100%);
          border-color: rgba(217, 183, 122, 0.32);
        }

        .card-top-tag {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.1rem;
        }

        .step-badge {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--accent-gold);
          background-color: rgba(217, 183, 122, 0.12);
          border: 1px solid rgba(217, 183, 122, 0.25);
          padding: 3px 9px;
          borderRadius: 9999px;
        }

        .live-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #4ADE80;
          background-color: rgba(34, 197, 94, 0.12);
          border-color: rgba(34, 197, 94, 0.3);
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #22C55E;
          box-shadow: 0 0 8px #22C55E;
          animation: pulseDot 1.4s infinite;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        .step-subtag {
          font-size: 0.66rem;
          color: var(--text-tertiary);
          letter-spacing: 0.08em;
          font-weight: 600;
        }

        .card-header-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 1.25rem;
        }

        .card-icon-halo {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(217, 183, 122, 0.1);
          border: 1px solid rgba(217, 183, 122, 0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 20px rgba(217, 183, 122, 0.15);
        }

        .pulsating-halo {
          animation: haloGlow 2.5s infinite ease-in-out;
        }

        @keyframes haloGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(217, 183, 122, 0.15); }
          50% { box-shadow: 0 0 25px rgba(217, 183, 122, 0.35); }
        }

        .card-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .card-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        /* Micro UI Inside Cards */
        .micro-ui-box {
          margin-top: auto;
          background-color: #171717;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 0.95rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .micro-ui-label {
          font-size: 0.68rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 600;
        }

        .role-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .role-chip {
          font-size: 0.72rem;
          padding: 3px 8px;
          border-radius: 6px;
          background-color: #212121;
          color: var(--text-secondary);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        .active-chip {
          background-color: rgba(217, 183, 122, 0.18);
          border-color: var(--accent-gold);
          color: var(--accent-gold);
          font-weight: 600;
          box-shadow: 0 0 10px rgba(217, 183, 122, 0.2);
        }

        .seniority-row {
          display: flex;
          justify-content: space-between;
          padding-top: 6px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.68rem;
          color: var(--text-tertiary);
        }

        .active-seniority {
          color: #F6F0E7;
          font-weight: 600;
        }

        /* Question Bubble */
        .ai-question-bubble {
          background-color: #1E1E1E;
          border-left: 2px solid var(--accent-gold);
          border-radius: 0 8px 8px 0;
          padding: 6px 9px;
        }

        .ai-speaker-tag {
          display: block;
          font-size: 0.64rem;
          font-weight: 600;
          color: var(--accent-gold);
          text-transform: uppercase;
        }

        .ai-speech-text {
          font-size: 0.74rem;
          color: var(--text-primary);
          line-height: 1.35;
          margin-top: 2px;
          font-style: italic;
        }

        /* Soundwave Equalizer */
        .soundwave-container {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 6px 4px 6px;
        }

        .soundwave-bar {
          width: 3px;
          border-radius: 2px;
          background-color: var(--accent-gold);
          animation: bounceWave 1.2s infinite ease-in-out;
        }

        .bar-1 { height: 10px; animation-delay: 0.1s; }
        .bar-2 { height: 18px; animation-delay: 0.3s; }
        .bar-3 { height: 26px; animation-delay: 0.15s; }
        .bar-4 { height: 14px; animation-delay: 0.4s; }
        .bar-5 { height: 22px; animation-delay: 0.25s; }
        .bar-6 { height: 28px; animation-delay: 0.35s; }
        .bar-7 { height: 16px; animation-delay: 0.1s; }
        .bar-8 { height: 20px; animation-delay: 0.45s; }
        .bar-9 { height: 12px; animation-delay: 0.2s; }
        .bar-10 { height: 8px; animation-delay: 0.5s; }

        @keyframes bounceWave {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50% { transform: scaleY(1.1); opacity: 1; }
        }

        .soundwave-label {
          font-size: 0.68rem;
          color: var(--text-tertiary);
          margin-left: auto;
          font-weight: 500;
        }

        /* Score summary row */
        .score-summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .score-badge {
          font-size: 1.15rem;
          font-weight: 700;
          color: #4ADE80;
        }

        .score-grade {
          font-size: 0.72rem;
          color: var(--accent-gold);
          font-weight: 600;
          background-color: rgba(217, 183, 122, 0.1);
          padding: 2px 7px;
          border-radius: 4px;
        }

        .metric-bars-stack {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .metric-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.68rem;
          color: var(--text-secondary);
        }

        .metric-val {
          font-weight: 600;
          color: var(--text-primary);
        }

        .metric-track {
          height: 4px;
          border-radius: 2px;
          background-color: #242424;
          overflow: hidden;
        }

        .metric-fill {
          height: 100%;
          border-radius: 2px;
          background-color: #22C55E;
        }

        .gold-fill {
          background-color: var(--accent-gold);
        }

        /* Connectors */
        .step-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 44px;
          flex-shrink: 0;
          position: relative;
        }

        .beam-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, rgba(217, 183, 122, 0.2), var(--accent-gold), rgba(217, 183, 122, 0.2));
          box-shadow: 0 0 10px rgba(217, 183, 122, 0.5);
          animation: pulseBeam 2s infinite ease-in-out;
        }

        @keyframes pulseBeam {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .arrow-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #171717;
          border: 1px solid var(--accent-gold);
          color: var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow: 0 0 16px rgba(217, 183, 122, 0.4);
          transition: transform 0.2s ease;
        }

        .arrow-badge:hover {
          transform: scale(1.15);
        }

        .desktop-arrow { display: block; }
        .mobile-arrow { display: none; }

        @media (max-width: 992px) {
          .how-it-works-grid {
            flex-direction: column;
            gap: 1.5rem;
          }
          .step-connector {
            width: 100%;
            height: 36px;
          }
          .beam-line {
            width: 2px;
            height: 100%;
          }
          .desktop-arrow { display: none; }
          .mobile-arrow { display: block; }
        }
      `}</style>
    </section>
  );
}
