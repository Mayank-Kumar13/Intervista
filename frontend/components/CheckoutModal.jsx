import React, { useState } from 'react';
import { X, Check, ShieldCheck, Zap, Lock, CreditCard, Smartphone, Building, Sparkles, ArrowRight, Tag } from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  plan,
  isYearly,
  onStartInterview,
}) {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !plan) return null;

  // Calculate pricing
  const basePrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'INTERVISTA20' || clean === 'HACKATHON20') {
      setDiscountPercent(20);
      setCouponSuccess('20% discount applied successfully!');
    } else if (clean === 'WELCOME10') {
      setDiscountPercent(10);
      setCouponSuccess('10% discount applied successfully!');
    } else if (clean === 'TOPCANDIDATE') {
      setDiscountPercent(30);
      setCouponSuccess('Special 30% candidate pass applied!');
    } else {
      setCouponError('Invalid coupon. Try "INTERVISTA20" for 20% off.');
    }
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1400);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    setDiscountPercent(0);
    setCouponCode('');
    setCouponSuccess('');
    setCouponError('');
    onClose();
  };

  const formatCardNumber = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const groups = raw.match(/.{1,4}/g);
    return groups ? groups.join(' ') : raw;
  };

  const formatExpiry = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      return `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    return raw;
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '94%',
          padding: '2.2rem 2.2rem',
          backgroundColor: '#121212',
          border: '1px solid rgba(217, 183, 122, 0.3)',
          borderRadius: '24px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(217, 183, 122, 0.1)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <X size={20} />
        </button>

        {!isSuccess ? (
          <div>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(217, 183, 122, 0.12)',
                  border: '1px solid rgba(217, 183, 122, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--accent-gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.65rem',
                }}
              >
                <Sparkles size={11} />
                <span>Upgrade to Premium</span>
              </div>
              <h3
                className="serif-heading"
                style={{
                  fontSize: '1.65rem',
                  lineHeight: 1.2,
                  color: 'var(--text-primary)',
                  marginBottom: '0.35rem',
                }}
              >
                Complete your <span className="gold-italic">{plan.name}</span> plan
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Instant access to unlimited voice simulations & deep scoring analytics.
              </p>
            </div>

            {/* Plan Summary Card */}
            <div
              style={{
                backgroundColor: '#181818',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.15rem 1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {plan.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(217, 183, 122, 0.15)',
                      color: 'var(--accent-gold)',
                      fontWeight: 600,
                    }}
                  >
                    {isYearly ? 'Annual Billing (Save 25%)' : 'Monthly Billing'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  {isYearly ? 'Billed annually · Cancel anytime' : 'Billed monthly · Cancel anytime'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                {discountPercent > 0 && (
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-tertiary)',
                      textDecoration: 'line-through',
                    }}
                  >
                    ₹{basePrice.toLocaleString('en-IN')}
                  </div>
                )}
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-gold)', lineHeight: 1.1 }}>
                  ₹{finalPrice.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                  {isYearly ? '/year' : '/month'}
                </div>
              </div>
            </div>

            {/* Coupon Code Strip */}
            <div style={{ marginBottom: '1.5rem' }}>
              <form
                onSubmit={handleApplyCoupon}
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                }}
              >
                <div style={{ position: 'relative', flex: 1 }}>
                  <Tag
                    size={15}
                    color="var(--text-tertiary)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. INTERVISTA20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#181818',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      padding: '0.62rem 0.85rem 0.62rem 2.2rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem',
                      textTransform: 'uppercase',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-secondary"
                  style={{
                    padding: '0.62rem 1.1rem',
                    fontSize: '0.82rem',
                    borderRadius: '10px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Apply
                </button>
              </form>
              {couponSuccess && (
                <div style={{ fontSize: '0.78rem', color: '#4ADE80', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={13} /> {couponSuccess}
                </div>
              )}
              {couponError && (
                <div style={{ fontSize: '0.78rem', color: '#F87171', marginTop: '5px' }}>
                  {couponError}
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.65rem',
                }}
              >
                Select Payment Method
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                  { id: 'card', label: 'Cards', icon: CreditCard },
                  { id: 'netbanking', label: 'NetBanking', icon: Building },
                ].map((m) => {
                  const Icon = m.icon;
                  const active = paymentMethod === m.id;
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      style={{
                        backgroundColor: active ? 'rgba(217, 183, 122, 0.12)' : '#181818',
                        border: active ? '1px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '0.75rem 0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        color: active ? 'var(--accent-gold)' : 'var(--text-secondary)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Icon size={18} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form per Payment Method */}
            <form onSubmit={handleProcessPayment}>
              {paymentMethod === 'upi' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      backgroundColor: '#161616',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '1.1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                    }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        Enter UPI ID / VPA
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        style={{
                          width: '100%',
                          backgroundColor: '#1E1E1E',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '0.65rem 0.85rem',
                          color: 'var(--text-primary)',
                          fontSize: '0.86rem',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Popular apps:</span>
                      {['Google Pay', 'PhonePe', 'Paytm', 'CRED'].map((app) => (
                        <span
                          key={app}
                          style={{
                            fontSize: '0.72rem',
                            backgroundColor: '#222',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div
                  style={{
                    backgroundColor: '#161616',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.1rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem',
                  }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mayank Kumar"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#1E1E1E',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '0.65rem 0.85rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.86rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4532 •••• •••• 8821"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      style={{
                        width: '100%',
                        backgroundColor: '#1E1E1E',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '0.65rem 0.85rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.86rem',
                        letterSpacing: '0.05em',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="08/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        style={{
                          width: '100%',
                          backgroundColor: '#1E1E1E',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '0.65rem 0.85rem',
                          color: 'var(--text-primary)',
                          fontSize: '0.86rem',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                        maxLength={4}
                        style={{
                          width: '100%',
                          backgroundColor: '#1E1E1E',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '0.65rem 0.85rem',
                          color: 'var(--text-primary)',
                          fontSize: '0.86rem',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div
                  style={{
                    backgroundColor: '#161616',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                    Select Preferred Bank
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank', 'Other Banks'].map((bank) => (
                      <button
                        type="button"
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        style={{
                          backgroundColor: selectedBank === bank ? 'rgba(217, 183, 122, 0.15)' : '#202020',
                          border: selectedBank === bank ? '1px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '8px',
                          padding: '0.55rem 0.4rem',
                          fontSize: '0.76rem',
                          fontWeight: 500,
                          color: selectedBank === bank ? 'var(--accent-gold)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--accent-gold)',
                  color: '#090909',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: isProcessing ? 0.75 : 1,
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 25px rgba(217, 183, 122, 0.3)',
                  marginBottom: '1rem',
                }}
              >
                {isProcessing ? (
                  <>
                    <span className="pulse-dot" style={{ backgroundColor: '#090909' }} />
                    <span>Processing Secure Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Pay ₹{finalPrice.toLocaleString('en-IN')} & Activate Plan</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Security Guarantee Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.25rem',
                color: 'var(--text-tertiary)',
                fontSize: '0.74rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} color="#4ADE80" />
                <span>256-Bit SSL Secured</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Zap size={13} color="var(--accent-gold)" />
                <span>Instant Activation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Lock size={13} />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Success View */
          <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                border: '2px solid #22C55E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)',
              }}
            >
              <Check size={32} color="#22C55E" />
            </div>

            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--accent-gold)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Payment Confirmed
            </span>

            <h3
              className="serif-heading"
              style={{
                fontSize: '1.9rem',
                color: 'var(--text-primary)',
                marginTop: '0.35rem',
                marginBottom: '0.65rem',
              }}
            >
              Welcome to <span className="gold-italic">{plan.name}</span>!
            </h3>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                maxWidth: '420px',
                margin: '0 auto 1.5rem auto',
              }}
            >
              Your subscription is now active! All unlimited AI voice mock interviews,
              deep performance metrics, and top-tier company question banks are unlocked.
            </p>

            <div
              style={{
                backgroundColor: '#181818',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '2rem',
                fontSize: '0.8rem',
              }}
            >
              <span style={{ color: 'var(--text-tertiary)' }}>Receipt ID:</span>
              <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 600 }}>
                INV-2026-{(Math.random() * 89999 + 10000).toFixed(0)}
              </span>
              <span style={{ color: '#22C55E', fontWeight: 600 }}>● PAID</span>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center' }}>
              <button
                onClick={handleClose}
                className="btn-secondary"
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem' }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleClose();
                  if (onStartInterview) onStartInterview();
                }}
                className="btn-primary"
                style={{
                  padding: '0.75rem 1.6rem',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#090909',
                }}
              >
                <span>Launch Mock Interview</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
