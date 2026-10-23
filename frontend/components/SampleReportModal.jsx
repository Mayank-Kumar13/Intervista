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
  BarChart3,
  Eye,
  Activity,
  ShieldCheck,
  Camera,
  Mic,
  Info,
  BookOpen,
  Target,
  Layers,
  FileText
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

  // Visual Telemetry from backend or preset
  const visMetrics = reportData?.visualObservations || reportData?.visionAnalysis;
  const vision = {
    enabled: visMetrics?.enabled !== false,
    postureScore: visMetrics?.faceVisibilityPercent || visMetrics?.postureScore || 92,
    postureStatus: visMetrics?.framingStatus || visMetrics?.postureStatus || 'Upright & Centered',
    gazeCenteredRatio: visMetrics?.faceVisibilityPercent || visMetrics?.gazeCenteredRatio || 90,
    gazeStatus: visMetrics?.headOrientationStatus || visMetrics?.gazeStatus || 'Optimal Direct Focus',
    headMovementStability: 'Stable & Poised',
    suggestions: visMetrics?.neutralObservationNote
      ? [visMetrics.neutralObservationNote]
      : (visMetrics?.suggestions || [
          'Maintain direct camera framing when presenting complex architectural decisions.',
          'Excellent upright presence maintained throughout conversational exchanges.'
        ]),
  };

  // Voice & Communication Telemetry from backend or preset
  const commMetrics = reportData?.communicationMetrics || reportData?.voiceAnalysis;
  const voice = {
    speakingPaceWpm: commMetrics?.speakingRateWpm || commMetrics?.speakingPaceWpm || 142,
    paceAssessment: commMetrics?.paceAssessment || 'Optimal Cadence (125-165 WPM)',
    fillerWordsCount: commMetrics?.fillerWordCount !== undefined ? commMetrics.fillerWordCount : (commMetrics?.fillerWordsCount || 3),
    fillerDetails: commMetrics?.fillerDetails || { um: 2, like: 1 },
    fillerRatioPercent: commMetrics?.fillerRatioPercent || 1.2,
    pausesOver3s: commMetrics?.pauseDurationCount !== undefined ? commMetrics.pauseDurationCount : (commMetrics?.pausesOver3s || 1),
    clarityScore: commMetrics?.clarityScore || 92,
    suggestions: commMetrics?.suggestions || [
      'Speaking cadence is optimal, natural, and conversational.',
      'Replace filler sounds with intentional 1-second silent pauses to structure thoughts.'
    ]
  };

  const fillerSummary = Object.entries(voice.fillerDetails || {})
    .map(([w, c]) => `"${w}": ${c}`)
    .join(', ') || 'Minimal';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '840px',
          padding: '2.5rem',
          backgroundColor: '#0F0F0F',
          borderRadius: '24px',
          border: '1px solid var(--border-gold)',
          maxHeight: '92vh',
          overflowY: 'auto',
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
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                • Session #{reportData?.sessionId ? reportData.sessionId.slice(-6).toUpperCase() : Math.floor(Math.random() * 8000 + 1000)}
              </span>
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
                strokeDashoffset={301.6 - (301.6 * score) / 100}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {score >= 80 ? 'Strong Interview Readiness' : 'Competent Performance with Key Growth Areas'}
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
                <span>Tier-1 Tech Benchmark</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.55 }}>
              {reportData?.summary || 'Candidate demonstrated strong conceptual foundations, structured answers, and quick problem resolution.'}
            </p>
          </div>
        </div>

        {/* Competency Breakdown Bars */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Core Competencies
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

        {/* ─── NEW: MULTIMODAL VISION & VOICE TELEMETRY CARDS ─────────────────── */}
        <div style={{ marginBottom: '2.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <span className="eyebrow-tag" style={{ color: 'var(--accent-gold)' }}>
              OBJECTIVE TELEMETRY
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              • Vision Analysis + Voice Analysis
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="telemetry-grid">
            {/* Card 1: Vision Tracking Telemetry */}
            <div
              style={{
                backgroundColor: '#141414',
                border: '1px solid rgba(217, 183, 122, 0.25)',
                borderRadius: '16px',
                padding: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--accent-gold)', fontWeight: 600, fontSize: '0.9rem' }}>
                  <Eye size={17} />
                  Vision & Posture Tracking
                </span>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '6px',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#4ADE80', border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  {vision.postureStatus}
                </span>
              </div>

              {/* Metrics rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Upright Posture Score</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{vision.postureScore}%</strong>
                  </div>
                  <div style={{ height: '4px', backgroundColor: '#222', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${vision.postureScore}%`, height: '100%', backgroundColor: '#22C55E' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Camera Gaze Alignment</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{vision.gazeCenteredRatio}% Center Focus</strong>
                  </div>
                  <div style={{ height: '4px', backgroundColor: '#222', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${vision.gazeCenteredRatio}%`, height: '100%', backgroundColor: 'var(--accent-gold)' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', paddingTop: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Head Movement Stability</span>
                  <span style={{ color: '#4ADE80', fontWeight: 600 }}>{vision.headMovementStability}</span>
                </div>
              </div>

              {/* Actionable Suggestion */}
              <div style={{ marginTop: 'auto', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                <strong style={{ color: 'var(--accent-champagne)', display: 'block', marginBottom: '2px' }}>
                  Actionable Vision Suggestion:
                </strong>
                {vision.suggestions?.[0] || 'Maintain direct eye contact with the webcam lens during key technical points.'}
              </div>
            </div>

            {/* Card 2: Voice & Cadence Telemetry */}
            <div
              style={{
                backgroundColor: '#141414',
                border: '1px solid rgba(74, 222, 128, 0.25)',
                borderRadius: '16px',
                padding: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#4ADE80', fontWeight: 600, fontSize: '0.9rem' }}>
                  <Activity size={17} />
                  Voice & Cadence Tracking
                </span>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '6px',
                  backgroundColor: 'rgba(217, 183, 122, 0.1)', color: 'var(--accent-gold)', border: '1px solid rgba(217, 183, 122, 0.3)'
                }}>
                  {voice.paceAssessment}
                </span>
              </div>

              {/* Metrics rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Speaking Pace</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{voice.speakingPaceWpm} WPM</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Filler Words Detected</span>
                  <span style={{ color: voice.fillerWordsCount > 3 ? '#FBBF24' : '#4ADE80', fontWeight: 600 }}>
                    {voice.fillerWordsCount} ({fillerSummary})
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Pauses Exceeding 3s</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{voice.pausesOver3s || 0} pauses</strong>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Clarity & Cadence Index</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{voice.clarityScore}%</strong>
                  </div>
                  <div style={{ height: '4px', backgroundColor: '#222', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${voice.clarityScore}%`, height: '100%', backgroundColor: '#4ADE80' }} />
                  </div>
                </div>
              </div>

              {/* Actionable Suggestion */}
              <div style={{ marginTop: 'auto', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                <strong style={{ color: 'var(--accent-champagne)', display: 'block', marginBottom: '2px' }}>
                  Actionable Voice Suggestion:
                </strong>
                {voice.suggestions?.[0] || 'Speaking cadence is optimal, natural, and conversational.'}
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div style={{ marginTop: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--text-tertiary)', padding: '0.5rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <ShieldCheck size={14} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
            <span>
              Privacy Transparency: Vision and voice metrics quantify measurable physical signals (posture stability, screen alignment, speech rate, pauses). They do not infer internal emotions or psychological traits.
            </span>
          </div>
        </div>

        {/* Key Strengths & Growth Areas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }} className="insights-grid">
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
              {(reportData?.strengths && reportData.strengths.length > 0
                ? reportData.strengths
                : [
                    'Explicitly structured technical trade-offs before implementation',
                    'Maintained direct camera gaze alignment and upright posture',
                    'Comfortable speech pace within optimal 125-165 WPM target',
                  ]
              ).map((s, i) => (
                <li key={i}>✓ {s}</li>
              ))}
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
              {(reportData?.improvements && reportData.improvements.length > 0
                ? reportData.improvements
                : [
                    'State time and space complexity (Big-O) upfront before diving into implementation',
                    'Replace mid-sentence "um" or "like" with deliberate 1-second silent pauses',
                    'Structure system design answers using top-down capacity estimation',
                  ]
              ).map((item, i) => (
                <li key={i}>→ {item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Question-by-Question Breakdown (if available) */}
        {reportData?.questionFeedback && reportData.questionFeedback.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Question Breakdown & Specific Advice
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {reportData.questionFeedback.map((qf, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#141416',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.4rem' }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#FFFFFF' }}>
                      {qf.question || `Prompt #${i + 1}`}
                    </div>
                    {qf.score && (
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-gold)', backgroundColor: 'rgba(217, 183, 122, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                        {qf.score}%
                      </span>
                    )}
                  </div>
                  {qf.candidateAnswer && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                      "{qf.candidateAnswer.length > 180 ? qf.candidateAnswer.slice(0, 180) + '...' : qf.candidateAnswer}"
                    </div>
                  )}
                  <div style={{ fontSize: '0.78rem', color: '#4ADE80', lineHeight: 1.45 }}>
                    <strong>Interviewer Feedback:</strong> {qf.feedback}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── 1. Rubric Evaluation with Transcript Evidence Quotes ─── */}
        {reportData?.rubricScores && reportData.rubricScores.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
              <span className="eyebrow-tag" style={{ color: 'var(--accent-gold)' }}>
                OFFICIAL RUBRIC BREAKDOWN
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                • Grounded in Transcript Evidence
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
              {reportData.rubricScores.map((rubric, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#141416',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h5 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                        {rubric.label}
                      </h5>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                        Weight: {Math.round(rubric.weight * 100)}% of Composite Score
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: rubric.score >= 80 ? '#4ADE80' : 'var(--accent-gold)',
                      backgroundColor: rubric.score >= 80 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(217, 183, 122, 0.1)',
                      padding: '3px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      {rubric.score}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: '4px', backgroundColor: '#222', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${rubric.score}%`,
                      height: '100%',
                      backgroundColor: rubric.score >= 80 ? '#22C55E' : 'var(--accent-gold)'
                    }} />
                  </div>

                  {/* Evidence Quotes */}
                  {rubric.evidenceQuotes && rubric.evidenceQuotes.length > 0 && (
                    <div style={{ marginTop: '0.4rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '0.6rem 0.8rem', borderRadius: '8px', borderLeft: '2px solid var(--accent-gold)' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>
                        Direct Transcript Evidence:
                      </span>
                      {rubric.evidenceQuotes.slice(0, 2).map((quote, qIdx) => (
                        <p key={qIdx} style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: '2px 0' }}>
                          "{quote}"
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── 2. Knowledge Gaps & Concept Analysis ─── */}
        {reportData?.knowledgeGaps && reportData.knowledgeGaps.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
              <span className="eyebrow-tag" style={{ color: '#F87171' }}>
                KNOWLEDGE GAP ANALYSIS
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                • Demonstrated vs Untested Topics
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reportData.knowledgeGaps.map((gap, gIdx) => (
                <div
                  key={gIdx}
                  style={{
                    backgroundColor: '#141416',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#FFFFFF' }}>
                      {gap.questionText || `Question #${gIdx + 1}`}
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: gap.priority === 'High' ? 'rgba(239, 68, 68, 0.15)' : gap.priority === 'Medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                      color: gap.priority === 'High' ? '#F87171' : gap.priority === 'Medium' ? '#FBBF24' : '#4ADE80',
                      border: `1px solid ${gap.priority === 'High' ? 'rgba(239, 68, 68, 0.3)' : gap.priority === 'Medium' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`
                    }}>
                      {gap.priority} Priority Gap
                    </span>
                  </div>

                  {/* Tested Concepts Pills */}
                  {gap.testedConcepts && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', alignSelf: 'center' }}>Tested:</span>
                      {gap.testedConcepts.map((c, cIdx) => (
                        <span key={cIdx} style={{ fontSize: '0.7rem', backgroundColor: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px', color: '#DDD' }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Strengths vs Weaknesses Comparison */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: '#4ADE80', display: 'block', marginBottom: '3px' }}>✓ Concepts Demonstrated:</strong>
                      {gap.demonstratedStrengths && gap.demonstratedStrengths.length > 0 ? (
                        <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                          {gap.demonstratedStrengths.map((s, sIdx) => <li key={sIdx}>{s}</li>)}
                        </ul>
                      ) : <span style={{ fontStyle: 'italic', color: 'var(--text-tertiary)' }}>None explicitly articulated</span>}
                    </div>

                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: '#F87171', display: 'block', marginBottom: '3px' }}>! Missing / Weakness Areas:</strong>
                      {gap.demonstratedWeaknesses && gap.demonstratedWeaknesses.length > 0 ? (
                        <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                          {gap.demonstratedWeaknesses.map((w, wIdx) => <li key={wIdx}>{w}</li>)}
                        </ul>
                      ) : <span style={{ color: '#4ADE80' }}>All primary concepts covered</span>}
                    </div>
                  </div>

                  {/* Untested Nuance distinction */}
                  {gap.untestedTopics && gap.untestedTopics.length > 0 && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem', marginBottom: '0.5rem' }}>
                      <em>Note: Related advanced topics ({gap.untestedTopics.join(', ')}) were not reached during this prompt and are not penalized.</em>
                    </div>
                  )}

                  {/* Recommendation Box */}
                  <div style={{ backgroundColor: 'rgba(217, 183, 122, 0.05)', border: '1px solid rgba(217, 183, 122, 0.15)', borderRadius: '8px', padding: '0.6rem 0.8rem', fontSize: '0.76rem', color: '#E2C99A' }}>
                    <strong>Actionable Study Recommendation:</strong> {gap.studyRecommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── 3. Personalized Study Plan & Practice Exercises ─── */}
        {reportData?.studyPlan && reportData.studyPlan.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
              <span className="eyebrow-tag" style={{ color: '#60A5FA' }}>
                TARGETED STUDY PLAN
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                • Resources & Practice Drills
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
              {reportData.studyPlan.map((plan, pIdx) => (
                <div
                  key={pIdx}
                  style={{
                    backgroundColor: '#141416',
                    border: '1px solid rgba(96, 165, 250, 0.2)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                      {plan.topic}
                    </h5>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(96, 165, 250, 0.12)',
                      color: '#60A5FA',
                      border: '1px solid rgba(96, 165, 250, 0.3)'
                    }}>
                      {plan.priority} Priority
                    </span>
                  </div>

                  {/* Resource */}
                  {plan.recommendedResources && plan.recommendedResources.length > 0 && (
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: '#E2C99A', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                        <BookOpen size={13} /> Recommended Literature:
                      </strong>
                      <span>{plan.recommendedResources.join('; ')}</span>
                    </div>
                  )}

                  {/* Practice Exercise */}
                  {plan.practiceExercises && plan.practiceExercises.length > 0 && (
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                        <Code2 size={13} /> Hands-on Practice Drill:
                      </strong>
                      <span>{plan.practiceExercises[0]}</span>
                    </div>
                  )}

                  {/* Drill Question */}
                  {plan.followUpInterviewQuestions && plan.followUpInterviewQuestions.length > 0 && (
                    <div style={{ marginTop: 'auto', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '0.6rem 0.8rem', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: '#60A5FA', display: 'block', marginBottom: '2px' }}>
                        Follow-up Mock Question:
                      </strong>
                      "{plan.followUpInterviewQuestions[0]}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
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
          .report-summary-grid, .telemetry-grid {
            grid-template-columns: 1fr !important;
          }
          .competency-grid, .insights-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
