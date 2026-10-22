import React from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Download, 
  Share2, 
  RotateCcw,
  Sparkles,
  MessageSquare,
  Code2,
  Lightbulb,
  BarChart3
} from 'lucide-react';

export default function SampleReportModal({ isOpen, onClose, reportData, onRetake }) {
  if (!isOpen) return null;

  const score = reportData?.overallScore || 88;
  const roleName = reportData?.role || 'Software Engineer';
  const level = reportData?.level || 'Mid Level';

  const metrics = [
    { label: 'Communication', score: reportData?.scores?.communication || 92, icon: MessageSquare },
    { label: 'Technical Depth', score: reportData?.scores?.technicalDepth || 86, icon: Code2 },
    { label: 'Problem Solving', score: reportData?.scores?.problemSolving || 89, icon: Lightbulb },
    { label: 'Confidence', score: reportData?.scores?.confidence || 84, icon: BarChart3 },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '780px',
          padding: '2.5rem',
          backgroundColor: '#0F0F0F',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
              <span className="eyebrow-tag" style={{ color: 'var(--accent-gold)' }}>
                OFFICIAL EVALUATION
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>• Session #{Math.floor(Math.random() * 8000 + 1000)}</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Interview Performance Report
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Role: <strong style={{ color: 'var(--text-primary)' }}>{roleName}</strong> ({level})
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.4rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Top Summary Banner */}
        <div
          style={{
            backgroundColor: '#151515',
            border: '1px solid var(--border-card)',
            borderRadius: '16px',
            padding: '2rem',
            display: 'grid',
            gridTemplateColumns: '130px 1fr',
            gap: '2.5rem',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
          className="report-summary-grid"
        >
          {/* Score Circle */}
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="48" fill="none" stroke="#222" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="var(--accent-gold)"
                strokeWidth="8"
                strokeDasharray="301.6"
                strokeDashoffset="36.2"
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ filter: 'drop-shadow(0 0 8px rgba(217, 183, 122, 0.4))' }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {score}%
              </span>
            </div>
          </div>

          {/* Verdict and Trend */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Strong Interview Readiness
              </span>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  color: '#4ADE80',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                }}
              >
                <TrendingUp size={12} />
                <span>+12% vs benchmark</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.55 }}>
              Candidate demonstrated strong conceptual foundations, structured answers, and quick problem resolution. Ready for tier-1 tech on-site interviews.
            </p>
          </div>
        </div>

        {/* Competency Breakdown Bars */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Competency Breakdown
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="competency-grid">
            {metrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#161616',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '1.1rem 1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <Icon size={14} color="var(--accent-gold)" />
                      {m.label}
                    </span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                      {m.score}%
                    </span>
                  </div>
                  <div style={{ height: '5px', backgroundColor: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${m.score}%`,
                        background: 'linear-gradient(90deg, #B59355, #E8D2A7)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Strengths & Growth Areas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }} className="insights-grid">
          {/* Strengths */}
          <div
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.04)',
              border: '1px solid rgba(34, 197, 94, 0.15)',
              borderRadius: '14px',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ADE80', fontSize: '0.86rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              <CheckCircle2 size={16} />
              <span>Key Strengths</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <li>✓ Explicitly mentioned database query profiling using EXPLAIN ANALYZE</li>
              <li>✓ Clear communication style with structured logical sequence</li>
              <li>✓ Proactively brought up caching strategies (Redis / Memcached)</li>
            </ul>
          </div>

          {/* Areas for Growth */}
          <div
            style={{
              backgroundColor: 'rgba(217, 183, 122, 0.04)',
              border: '1px solid rgba(217, 183, 122, 0.15)',
              borderRadius: '14px',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)', fontSize: '0.86rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              <Sparkles size={16} />
              <span>Recommended Next Steps</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <li>→ State Big-O time and space complexity upfront before solution details</li>
              <li>→ Address horizontal partitioning and read-replica replication lag</li>
              <li>→ Practice concise STAR summaries for follow-up behavioral probes</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
          <button
            onClick={() => window.print()}
            className="btn-secondary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
          >
            <Download size={15} />
            <span>Export Report (PDF)</span>
          </button>

          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <button
              onClick={() => {
                onClose();
                if (onRetake) onRetake();
              }}
              className="btn-primary"
              style={{ padding: '0.65rem 1.45rem', fontSize: '0.88rem' }}
            >
              <RotateCcw size={15} />
              <span>Retake Mock Session</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .report-summary-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .competency-grid, .insights-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
