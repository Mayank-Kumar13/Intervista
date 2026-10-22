import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Lock,
  Flame,
  Award,
  Clock,
  Compass,
} from 'lucide-react';
import CheckoutModal from './CheckoutModal';

const PLANS_DATA = [
  {
    id: 'starter',
    name: 'Free Starter',
    badge: null,
    tagline: 'Test the waters of AI-powered mock interviews without any commitment.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyDisplay: '₹0',
    yearlyDisplay: '₹0',
    periodLabel: 'forever free',
    isPopular: false,
    ctaText: 'Start Free Practice',
    features: [
      { text: '2 AI voice mock interviews / month', included: true },
      { text: 'Standard behavioral & technical questions', included: true },
      { text: 'Basic scorecard & summary feedback', included: true },
      { text: 'Real-time audio speech recognition', included: true },
      { text: 'Web-based access from any laptop', included: true },
      { text: 'Company-specific interview sets', included: false },
      { text: 'Pacing & filler word speech analytics', included: false },
      { text: 'System design & coding architecture', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro Candidate',
    badge: 'MOST POPULAR · BEST VALUE',
    tagline: 'Comprehensive voice preparation to crack Tier-1, FAANG, and top global startups.',
    monthlyPrice: 999,
    yearlyPrice: 8990,
    monthlyDisplay: '₹999',
    yearlyDisplay: '₹749',
    periodLabel: 'per month',
    isPopular: true,
    ctaText: 'Upgrade to Pro',
    features: [
      { text: 'Unlimited AI voice mock interviews', included: true },
      { text: 'Adaptive follow-up questions tailored to your answers', included: true },
      { text: 'Full Speech & Audio Metrics (WPM, filler words, tone)', included: true },
      { text: 'Company-Specific Packs (Google, Amazon, Meta, Microsoft)', included: true },
      { text: 'System design, live coding & architecture drills', included: true },
      { text: 'Instant downloadable PDF performance reports', included: true },
      { text: 'STAR framework behavioral answer grading', included: true },
      { text: 'Ultra-low latency AI voice engine (<400ms)', included: true },
    ],
  },
  {
    id: 'elite',
    name: 'Elite Executive',
    badge: 'VIP CAREER EDGE',
    tagline: 'Masterclass-level executive prep for Senior Engineers, Tech Leads, and Engineering Managers.',
    monthlyPrice: 2499,
    yearlyPrice: 22490,
    monthlyDisplay: '₹2,499',
    yearlyDisplay: '₹1,875',
    periodLabel: 'per month',
    isPopular: false,
    ctaText: 'Get Elite Access',
    features: [
      { text: 'Everything included in Pro Candidate', included: true },
      { text: '1-on-1 Monthly Human Senior Mentor session review', included: true },
      { text: 'Custom Job Description Analyzer (Upload JD & match questions)', included: true },
      { text: 'Unlimited Video & Screen-share presentation mocks', included: true },
      { text: 'Executive presence & leadership communication rubric', included: true },
      { text: 'Tech salary & offer negotiation strategy guide', included: true },
      { text: 'Dedicated 24/7 VIP Concierge Support', included: true },
    ],
  },
];

const FAQS = [
  {
    q: 'Can I cancel or switch my plan anytime?',
    a: 'Yes, absolutely. You can cancel, upgrade, or downgrade your subscription at any time with a single click. If you cancel, your premium benefits remain active until the end of your billing cycle.',
  },
  {
    q: 'How realistic are the AI mock interview questions?',
    a: 'Our question bank and follow-up AI models are trained on real interview loops from companies like Google, Amazon, Microsoft, Uber, and top YC startups. The AI actively probes your answers rather than reciting scripted questions.',
  },
  {
    q: 'Is my audio and interview video kept private?',
    a: 'Yes. We strictly adhere to privacy-by-design. Your audio and video are processed in transient, encrypted memory solely for generating your report. We never sell or share candidate data with third parties or employers.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major payment methods including UPI (Google Pay, PhonePe, Paytm, CRED), Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), and Net Banking across all Indian and international banks.',
  },
];

export default function PricingSection({ onStartInterview }) {
  const [isYearly, setIsYearly] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);

  const handleSelectPlan = (plan) => {
    if (plan.id === 'starter') {
      if (onStartInterview) onStartInterview();
    } else {
      setSelectedPlanForCheckout(plan);
      setCheckoutModalOpen(true);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <section
      id="pricing"
      className="section-wrapper"
      style={{
        paddingTop: '3rem',
        paddingBottom: '6rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Anchor helper for reviews id backwards compatibility */}
      <div id="reviews" style={{ position: 'absolute', top: 0, left: 0 }} />
      <div id="plans" style={{ position: 'absolute', top: 0, left: 0 }} />

      {/* Ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(217, 183, 122, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '0.85rem' }}>
            <span
              className="eyebrow-tag"
              style={{
                color: 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(217, 183, 122, 0.1)',
                border: '1px solid rgba(217, 183, 122, 0.25)',
                padding: '4px 12px',
                borderRadius: '9999px',
              }}
            >
              <Sparkles size={12} />
              PREMIUM PLANS & PRICING
            </span>
          </div>

          <h2
            className="serif-heading"
            style={{
              fontSize: 'clamp(2.1rem, 4vw, 3.25rem)',
              lineHeight: 1.15,
              marginBottom: '1rem',
              color: 'var(--text-primary)',
            }}
          >
            Invest in your dream career. <br />
            <span className="gold-italic">Choose your interview plan.</span>
          </h2>

          <p
            className="section-subtitle"
            style={{
              maxWidth: '580px',
              margin: '0 auto',
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.65,
            }}
          >
            Realistic voice mock interviews, granular metric scorecards, and tailored company
            question loops. Cancel anytime with zero questions asked.
          </p>

          {/* Billing Cycle Switcher */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#121212',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              padding: '6px',
              marginTop: '2rem',
            }}
          >
            <button
              onClick={() => setIsYearly(false)}
              style={{
                background: !isYearly ? 'var(--text-primary)' : 'transparent',
                color: !isYearly ? 'var(--text-inverse)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.5rem 1.25rem',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Monthly Billing
            </button>

            <button
              onClick={() => setIsYearly(true)}
              style={{
                background: isYearly ? 'var(--text-primary)' : 'transparent',
                color: isYearly ? 'var(--text-inverse)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.5rem 1.25rem',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Annual Billing</span>
              <span
                style={{
                  backgroundColor: isYearly ? 'var(--accent-gold)' : 'rgba(217, 183, 122, 0.2)',
                  color: isYearly ? '#090909' : 'var(--accent-gold)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em',
                }}
              >
                SAVE 25%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            alignItems: 'stretch',
            marginBottom: '4.5rem',
          }}
          className="pricing-cards-grid"
        >
          {PLANS_DATA.map((plan) => {
            const isPop = plan.isPopular;
            const priceDisplay = isYearly ? plan.yearlyDisplay : plan.monthlyDisplay;

            return (
              <div
                key={plan.id}
                style={{
                  backgroundColor: isPop ? '#131313' : '#0F0F0F',
                  border: isPop
                    ? '2px solid var(--accent-gold)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: isPop
                    ? '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(217, 183, 122, 0.15)'
                    : '0 10px 30px rgba(0, 0, 0, 0.4)',
                }}
                className={`pricing-card ${isPop ? 'popular-card' : ''}`}
              >
                {/* Popular ribbon */}
                {plan.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-13px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--accent-gold)',
                      color: '#090909',
                      padding: '4px 14px',
                      borderRadius: '9999px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 4px 15px rgba(217, 183, 122, 0.4)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Sparkles size={11} fill="#090909" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                {/* Plan Header */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <h3
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.84rem',
                      lineHeight: 1.5,
                      minHeight: '40px',
                    }}
                  >
                    {plan.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '3.2rem',
                        fontWeight: 700,
                        color: isPop ? 'var(--accent-gold)' : 'var(--text-primary)',
                        lineHeight: 1,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {priceDisplay}
                    </span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem' }}>
                      {plan.monthlyPrice === 0 ? '' : isYearly ? '/ month (billed annually)' : '/ month'}
                    </span>
                  </div>
                  {isYearly && plan.monthlyPrice > 0 && (
                    <div style={{ fontSize: '0.78rem', color: '#4ADE80', marginTop: '6px' }}>
                      Billed ₹{plan.yearlyPrice.toLocaleString('en-IN')}/year · Save 25%
                    </div>
                  )}
                  {plan.monthlyPrice === 0 && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '6px' }}>
                      No credit card required
                    </div>
                  )}
                </div>

                {/* CTA Action Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={isPop ? 'btn-primary' : 'btn-secondary'}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    fontSize: '0.94rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    backgroundColor: isPop ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.05)',
                    color: isPop ? '#090909' : 'var(--text-primary)',
                    borderColor: isPop ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '2rem',
                    cursor: 'pointer',
                    boxShadow: isPop ? '0 6px 20px rgba(217, 183, 122, 0.3)' : 'none',
                  }}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight size={16} />
                </button>

                {/* Feature Checklist */}
                <div style={{ flex: 1, borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1.5rem' }}>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-tertiary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '1rem',
                    }}
                  >
                    What's included:
                  </div>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {plan.features.map((feat, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '0.84rem',
                          color: feat.included ? 'var(--text-secondary)' : 'rgba(255, 255, 255, 0.25)',
                          textDecoration: feat.included ? 'none' : 'line-through',
                          lineHeight: 1.45,
                        }}
                      >
                        <div
                          style={{
                            marginTop: '2px',
                            color: feat.included ? (isPop ? 'var(--accent-gold)' : '#22C55E') : 'rgba(255, 255, 255, 0.2)',
                            flexShrink: 0,
                          }}
                        >
                          {feat.included ? <Check size={16} strokeWidth={2.5} /> : <span style={{ display: 'inline-block', width: '16px', textAlign: 'center' }}>–</span>}
                        </div>
                        <span>{feat.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4 Trust & Guarantee Badges Strip */}
        <div
          style={{
            backgroundColor: '#0E0E0E',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '2rem 2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
            marginBottom: '4.5rem',
          }}
          className="trust-strip-grid"
        >
          {[
            {
              icon: ShieldCheck,
              title: '7-Day Guarantee',
              desc: '100% full refund within 7 days if you are not delighted.',
            },
            {
              icon: Zap,
              title: 'Instant Access',
              desc: 'Start practicing unlimited voice rounds within 30 seconds.',
            },
            {
              icon: Lock,
              title: 'Audio Privacy',
              desc: 'Zero voice retention or sharing. Your answers are private.',
            },
            {
              icon: Award,
              title: '89% Placement Rate',
              desc: 'Candidates report clearing their next interview loop.',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{ display: 'flex', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(217, 183, 122, 0.1)',
                    border: '1px solid rgba(217, 183, 122, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Accordion Section */}
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="eyebrow-tag" style={{ color: 'var(--accent-gold)' }}>
              GOT QUESTIONS?
            </span>
            <h3
              className="serif-heading"
              style={{
                fontSize: '1.85rem',
                color: 'var(--text-primary)',
                marginTop: '0.5rem',
              }}
            >
              Frequently Asked <span className="gold-italic">Questions</span>
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#111111',
                    border: isOpen ? '1px solid rgba(217, 183, 122, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      padding: '1.2rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: isOpen ? 'var(--accent-gold)' : 'var(--text-primary)',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                        marginLeft: '1rem',
                        color: isOpen ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: '0 1.5rem 1.25rem 1.5rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.88rem',
                        lineHeight: 1.6,
                        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                        paddingTop: '0.85rem',
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        plan={selectedPlanForCheckout}
        isYearly={isYearly}
        onStartInterview={onStartInterview}
      />

      {/* Responsive Styles */}
      <style>{`
        .pricing-card:hover {
          transform: translateY(-4px);
        }
        .popular-card:hover {
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 45px rgba(217, 183, 122, 0.25) !important;
        }
        @media (max-width: 960px) {
          .pricing-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .trust-strip-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .trust-strip-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
