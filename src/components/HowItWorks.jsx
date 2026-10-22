import React from 'react';
import { FileText, Mic, BarChart3, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onSelectStep }) {
  const steps = [
    {
      num: '01',
      icon: FileText,
      title: 'Choose your role',
      desc: 'Select the job role, level, and focus area you want to practice for.',
      action: 'role',
    },
    {
      num: '02',
      icon: Mic,
      title: 'Start the conversation',
      desc: 'Have a natural, real-time voice conversation just like a real interview.',
      action: 'demo',
    },
    {
      num: '03',
      icon: BarChart3,
      title: 'Get detailed feedback',
      desc: 'Receive personalized feedback with scores, strengths, and areas to improve.',
      action: 'report',
    },
  ];

  return (
    <section id="how-it-works" className="section-wrapper">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle">
            Get interview ready in three simple steps.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.75rem',
          }}
          className="steps-grid"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="glass-card step-card"
                onClick={() => onSelectStep && onSelectStep(step.action)}
                style={{
                  padding: '2.4rem 2.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  position: 'relative',
                  minHeight: '260px',
                }}
              >
                {/* Card Top Row: Number indicator & Icon */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '2.5rem',
                  }}
                >
                  {/* Number pill */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.92rem',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                    }}
                  >
                    {step.num}
                  </span>

                  {/* Icon Container */}
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(217, 183, 122, 0.06)',
                      border: '1px solid rgba(217, 183, 122, 0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-gold)',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                </div>

                {/* Card Content */}
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '0.75rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    marginBottom: '2rem',
                  }}
                >
                  {step.desc}
                </p>

                {/* Circular arrow affordance */}
                <div
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div
                    className="step-arrow-btn"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .step-card:hover .step-arrow-btn {
          background-color: var(--accent-gold);
          color: #090909;
          border-color: var(--accent-gold);
          transform: translateX(3px);
        }
        @media (max-width: 992px) {
          .steps-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
