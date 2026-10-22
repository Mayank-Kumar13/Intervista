import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Check,
  X,
  HelpCircle,
  ShieldCheck,
  Zap,
  Lock,
  Award,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Target,
  FileCheck,
} from 'lucide-react';
import PricingSection from './PricingSection';

const COMPARISON_ROWS = [
  {
    category: 'Mock Interviews & Voice Pipeline',
    features: [
      { name: 'Monthly AI Voice Interviews', starter: '2 / month', pro: 'Unlimited', elite: 'Unlimited' },
      { name: 'Adaptive Question Follow-ups', starter: false, pro: true, elite: true },
      { name: 'Voice Engine Latency', starter: 'Standard (~950ms)', pro: 'Ultra-low (<400ms)', elite: 'Dedicated VIP Node (<250ms)' },
      { name: 'Video & Camera Participation', starter: 'Audio only', pro: 'Audio + Camera', elite: 'Audio + Camera + Screen Share' },
      { name: 'Task-Based Presentation & Slide Sharing', starter: false, pro: 'Optional', elite: 'Full Screen & Editor Share' },
    ],
  },
  {
    category: 'Question Bank & Roles',
    features: [
      { name: 'Standard Behavioral & Technical Library', starter: true, pro: true, elite: true },
      { name: 'Company-Specific Packs (Google, Amazon, Meta)', starter: false, pro: true, elite: true },
      { name: 'System Design & Distributed Systems Mocks', starter: false, pro: true, elite: true },
      { name: 'Product Management & Case Study Rubrics', starter: false, pro: true, elite: true },
      { name: 'Custom Job Description (JD) AI Matcher', starter: false, pro: false, elite: true },
    ],
  },
  {
    category: 'Evaluation & Analytics',
    features: [
      { name: 'Post-Session Scorecard Overview', starter: 'Basic Summary', pro: 'Granular Multi-Metric', elite: 'Executive Competency Audit' },
      { name: 'Speech Delivery Metrics (WPM, Filler Words)', starter: false, pro: true, elite: true },
      { name: 'STAR Framework Behavioral Scoring', starter: false, pro: true, elite: true },
      { name: 'Downloadable Executive PDF Reports', starter: false, pro: true, elite: true },
      { name: 'Trend & Weakness Progression Tracker', starter: false, pro: true, elite: true },
    ],
  },
  {
    category: 'Mentorship & Support',
    features: [
      { name: 'Community Support Access', starter: 'Discord Forum', pro: 'Priority Discord + Email', elite: '24/7 VIP Concierge + WhatsApp' },
      { name: '1-on-1 Senior Human Mentor Review', starter: false, pro: false, elite: '1 Session / month included' },
      { name: 'Offer Negotiation Strategy Playbook', starter: false, pro: false, elite: true },
    ],
  },
];

export default function PlansPage({ onStartInterview, onBackToHome }) {
  const [showMatrix, setShowMatrix] = useState(false);

  return (
    <div style={{ backgroundColor: '#090909', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Top Banner Navigation Bar */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          backgroundColor: 'rgba(15, 15, 15, 0.65)',
          backdropFilter: 'blur(12px)',
          padding: '1rem 0',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onBackToHome}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.88rem',
              fontWeight: 500,
              padding: '0.4rem 0.75rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot" style={{ width: '7px', height: '7px' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              Instant Activation · 7-Day Money-Back Guarantee
            </span>
          </div>
        </div>
      </div>

      {/* Page Hero Header */}
      <div
        style={{
          paddingTop: '3.5rem',
          paddingBottom: '2rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container">
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(217, 183, 122, 0.12)',
              border: '1px solid rgba(217, 183, 122, 0.3)',
              borderRadius: '9999px',
              padding: '4px 14px',
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={13} color="var(--accent-gold)" />
            <span
              style={{
                color: 'var(--accent-gold)',
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              MEMBERSHIP PLANS & PRICING
            </span>
          </div>

          {/* Heading */}
          <h1
            className="serif-heading"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.12,
              marginBottom: '1.2rem',
              letterSpacing: '-0.025em',
            }}
          >
            Accelerate your interview readiness. <br />
            <span className="gold-italic">Choose the tier built for your goals.</span>
          </h1>

          {/* Description */}
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: 1.65,
              maxWidth: '680px',
              margin: '0 auto 2.5rem auto',
            }}
          >
            Whether you are a college graduate seeking your first software engineering offer or a Senior Tech Lead
            aiming for FAANG compensation, Intervista provides realistic voice drills and personalized score breakdowns.
          </p>

          {/* Value highlights strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
              paddingTop: '0.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.84rem',
            }}
          >
            {[
              { icon: Zap, text: 'Real-time conversational voice' },
              { icon: Target, text: 'Company-specific interview loops' },
              { icon: FileCheck, text: 'Granular PDF evaluation reports' },
              { icon: ShieldCheck, text: 'Zero hidden fees · Cancel anytime' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={15} color="var(--accent-gold)" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Pricing Section (Cards, Monthly/Annual Switcher, Trust Badges, FAQs) */}
      <PricingSection onStartInterview={onStartInterview} />

      {/* Feature Comparison Matrix Section */}
      <div className="container" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className="btn-secondary"
            style={{
              padding: '0.75rem 1.75rem',
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderColor: 'rgba(217, 183, 122, 0.35)',
              color: 'var(--text-primary)',
            }}
          >
            <span>{showMatrix ? 'Hide Full Feature Comparison' : 'Compare All Features & Limits'}</span>
            <ChevronDown
              size={16}
              style={{
                transform: showMatrix ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>
        </div>

        {showMatrix && (
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2.5rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
              overflowX: 'auto',
            }}
          >
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h3 className="serif-heading" style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>
                Full Plan <span className="gold-italic">Feature Comparison</span>
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                See exactly what each tier unlocks for your interview practice.
              </p>
            </div>

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.86rem',
                minWidth: '650px',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                    FEATURE
                  </th>
                  <th style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    Free Starter
                  </th>
                  <th
                    style={{
                      textAlign: 'center',
                      padding: '1rem',
                      color: 'var(--accent-gold)',
                      fontWeight: 700,
                      backgroundColor: 'rgba(217, 183, 122, 0.06)',
                      borderRadius: '8px 8px 0 0',
                    }}
                  >
                    Pro Candidate ★
                  </th>
                  <th style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    Elite Executive
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((section, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          padding: '1.2rem 1rem 0.6rem 1rem',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: 'var(--accent-gold)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        {section.category}
                      </td>
                    </tr>
                    {section.features.map((feat, fIdx) => (
                      <tr
                        key={fIdx}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                          {feat.name}
                        </td>
                        <td style={{ textAlign: 'center', padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                          {typeof feat.starter === 'boolean' ? (
                            feat.starter ? (
                              <Check size={16} color="#22C55E" style={{ margin: '0 auto' }} />
                            ) : (
                              <X size={16} color="rgba(255, 255, 255, 0.25)" style={{ margin: '0 auto' }} />
                            )
                          ) : (
                            feat.starter
                          )}
                        </td>
                        <td
                          style={{
                            textAlign: 'center',
                            padding: '0.85rem 1rem',
                            color: 'var(--text-primary)',
                            fontWeight: 600,
                            backgroundColor: 'rgba(217, 183, 122, 0.06)',
                          }}
                        >
                          {typeof feat.pro === 'boolean' ? (
                            feat.pro ? (
                              <Check size={16} color="var(--accent-gold)" style={{ margin: '0 auto' }} />
                            ) : (
                              <X size={16} color="rgba(255, 255, 255, 0.25)" style={{ margin: '0 auto' }} />
                            )
                          ) : (
                            feat.pro
                          )}
                        </td>
                        <td style={{ textAlign: 'center', padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                          {typeof feat.elite === 'boolean' ? (
                            feat.elite ? (
                              <Check size={16} color="#22C55E" style={{ margin: '0 auto' }} />
                            ) : (
                              <X size={16} color="rgba(255, 255, 255, 0.25)" style={{ margin: '0 auto' }} />
                            )
                          ) : (
                            feat.elite
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Final Plan CTA Card */}
      <div className="container">
        <div
          style={{
            backgroundColor: '#121212',
            border: '1px solid rgba(217, 183, 122, 0.3)',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '250px',
              background: 'radial-gradient(circle, rgba(217, 183, 122, 0.12) 0%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          <h3 className="serif-heading" style={{ fontSize: '2.1rem', marginBottom: '0.8rem', position: 'relative' }}>
            Ready to secure your next <span className="gold-italic">high-paying offer?</span>
          </h3>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.98rem',
              maxWidth: '520px',
              margin: '0 auto 2rem auto',
              lineHeight: 1.6,
              position: 'relative',
            }}
          >
            Start with our free plan or upgrade to Pro to unlock unlimited realistic AI mock interviews today.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <button
              onClick={() => onStartInterview && onStartInterview()}
              className="btn-primary"
              style={{
                padding: '0.82rem 1.8rem',
                fontSize: '0.95rem',
              }}
            >
              <span>Start Free Practice Now</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={onBackToHome}
              className="btn-secondary"
              style={{
                padding: '0.82rem 1.8rem',
                fontSize: '0.95rem',
              }}
            >
              <span>Explore Home Features</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
