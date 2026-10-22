import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  SkipForward, 
  CheckCircle2, 
  Send,
  MessageSquare,
  Sparkles,
  PhoneOff
} from 'lucide-react';

const SAMPLE_QUESTIONS = {
  'Software Engineer': [
    {
      q: 'Can you explain how you would optimize a slow database query in a production environment?',
      hint: 'Focus on indexing, EXPLAIN ANALYZE, query refactoring, and caching layers like Redis.',
      idealAnswer: 'I would first inspect the execution plan with EXPLAIN ANALYZE to locate sequential scans or expensive joins, verify composite indexing, and introduce caching where applicable.',
    },
    {
      q: 'How would you design a scalable rate limiter for an API handling 50,000 requests per second?',
      hint: 'Consider sliding window logs vs. token bucket algorithm and distributed state in Redis.',
      idealAnswer: 'I would use a distributed Redis cluster using the Token Bucket algorithm with atomic Lua scripts to prevent race conditions across server nodes.',
    },
  ],
  'Product Manager': [
    {
      q: 'How would you prioritize features for a new product with limited engineering bandwidth?',
      hint: 'Mention framework: RICE, MoSCoW, business alignment, and user feedback signals.',
      idealAnswer: 'I utilize the RICE scoring model (Reach, Impact, Confidence, Effort) aligned with primary company North Star metrics.',
    },
    {
      q: 'Tell me about a time when a product launch underperformed and how you handled it.',
      hint: 'Focus on data diagnostics, stakeholder communication, and pivoting quickly.',
      idealAnswer: 'I broke down the funnel telemetry to isolate churn at step 2 of onboarding, ran rapid user interviews, and shipped a 2-click redesign that improved activation by 35%.',
    },
  ],
  'Data Analyst': [
    {
      q: 'How would you explain the difference between a LEFT JOIN and an INNER JOIN to a non-technical stakeholder?',
      hint: 'Use a clear visual analogy like a student roster and club membership list.',
      idealAnswer: 'Think of INNER JOIN as students who belong to both a class and a club, while LEFT JOIN lists all students in the class regardless of whether they joined the club.',
    },
  ],
  'UX Designer': [
    {
      q: 'Walk me through your design thinking process when redesigning a complex mobile onboarding flow.',
      hint: 'Cover user research, friction mapping, wireframing, usability testing, and accessibility.',
      idealAnswer: 'I start by mapping user cognitive load, conducting moderated user testing to find drop-off causes, and applying progressive disclosure to simplify complex inputs.',
    },
  ],
};

const RESUME_QUESTIONS = [
  {
    q: 'Based on your uploaded resume, walk me through the most technically challenging project you led. What architectural decisions or trade-offs did you make?',
    hint: 'Focus on system design choices, bottlenecks encountered, metrics improved, and how you evaluated alternative tech stacks.',
    idealAnswer: 'I outline the architecture, explain why we chose specific databases and patterns over others, discuss performance bottlenecks, and quantify the resulting latency or cost reductions.',
  },
  {
    q: 'Looking at your past work experience, describe a critical production incident or bug you encountered. How did you diagnose, resolve, and prevent it from recurring?',
    hint: 'Use the STAR method: Situation, Task, Action (monitoring, root cause, postmortem), and Result (runbooks, tests).',
    idealAnswer: 'I tracked error spikes using distributed tracing, pinpointed a connection pool leak under heavy load, deployed an emergency fix, and authored automated load tests with alerts.',
  },
  {
    q: 'How does your background and the specific technical skill set highlighted in your resume align with this target role and company?',
    hint: 'Highlight core technical competencies, fast learning curve, and direct value you will bring to their engineering team.',
    idealAnswer: 'My hands-on experience with modern scalable architectures and rapid prototyping directly aligns with their team goals and technical stack.',
  },
];

export default function LiveDemoModal({ isOpen, onClose, config, onFinishInterview }) {
  const currentRole = config?.role || 'Software Engineer';
  const questions = config?.isResumeBased
    ? RESUME_QUESTIONS
    : (SAMPLE_QUESTIONS[currentRole] || SAMPLE_QUESTIONS['Software Engineer']);

  const [questionIdx, setQuestionIdx] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isMicActive, setIsMicActive] = useState(true);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isSpeakingAI, setIsSpeakingAI] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [isRecognizing, setIsRecognizing] = useState(false);

  const recognitionRef = useRef(null);

  // Timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Read question with speech synthesis
  useEffect(() => {
    if (!isOpen) return;
    const currentQ = questions[questionIdx]?.q;
    if (currentQ && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQ);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeakingAI(true);
      utterance.onend = () => setIsSpeakingAI(false);
      utterance.onerror = () => setIsSpeakingAI(false);
      window.speechSynthesis.speak(utterance);
    }
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [isOpen, questionIdx, currentRole]);

  // Web Speech recognition for candidate voice
  useEffect(() => {
    if (!isOpen) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setCandidateAnswer(currentTranscript);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e);
        setIsRecognizing(false);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
        setIsRecognizing(true);
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, [isOpen]);

  const handleNextQuestion = () => {
    if (candidateAnswer.trim()) {
      setTranscript(prev => [
        ...prev,
        { role: 'AI', text: questions[questionIdx].q },
        { role: 'Candidate', text: candidateAnswer },
      ]);
    }
    setCandidateAnswer('');
    if (questionIdx < questions.length - 1) {
      setQuestionIdx(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    onFinishInterview({
      role: currentRole,
      level: config?.level || 'Mid Level',
      durationMinutes: Math.max(1, Math.round(seconds / 60)),
      overallScore: 88,
      scores: {
        communication: 92,
        technicalDepth: 86,
        problemSolving: 89,
        confidence: 84,
      },
    });
  };

  const formatTimer = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const currentQ = questions[questionIdx] || questions[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          padding: '2.5rem',
          backgroundColor: '#0F0F0F',
        }}
      >
        {/* Top Bar: Title & Session Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '1.25rem',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span className="pulse-dot" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {config?.isResumeBased ? (
                  <>
                    <span>Resume-Based Interview</span>
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(217,183,122,0.15)', color: 'var(--accent-gold)', border: '1px solid rgba(217,183,122,0.3)', fontWeight: 500 }}>
                      {config?.role || 'Resume Profile'}
                    </span>
                  </>
                ) : (
                  `${currentRole} Mock Interview`
                )}
              </h3>
              <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-gold)' }}>
                  Interviewer: Sophia (AI Lead)
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>•</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                  Question {questionIdx + 1} of {questions.length}
                </span>
              </div>
            </div>
          </div>

          {/* Session Timer & End Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                color: '#F87171',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              {formatTimer(seconds)}
            </div>

            <button
              onClick={handleComplete}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#FCA5A5',
                padding: '0.45rem 0.95rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <PhoneOff size={14} />
              <span>Finish & View Report</span>
            </button>
          </div>
        </div>

        {/* Question Panel */}
        <div
          style={{
            backgroundColor: '#161616',
            border: '1px solid var(--border-card)',
            borderRadius: '16px',
            padding: '1.75rem',
            marginBottom: '1.5rem',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(217, 183, 122, 0.15)',
                border: '1px solid rgba(217, 183, 122, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
                flexShrink: 0,
              }}
            >
              <Volume2 size={18} />
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: isSpeakingAI ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>AI Interviewer Speaking</span>
                {isSpeakingAI && <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />}
              </div>
              <h4
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  lineHeight: 1.5,
                  marginBottom: '0.75rem',
                }}
              >
                "{currentQ.q}"
              </h4>

              {/* Hint */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '6px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                }}
              >
                <Sparkles size={13} color="var(--accent-gold)" />
                <span>Tip: {currentQ.hint}</span>
              </div>
            </div>
          </div>

          {/* Real-time Voice Waveform */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              height: '42px',
              marginTop: '1.5rem',
              padding: '0.5rem 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {[24, 45, 65, 85, 95, 75, 55, 88, 92, 60, 40, 70, 85, 95, 50, 30, 48, 68, 88, 72, 45, 25].map((h, i) => (
              <div
                key={i}
                style={{
                  width: '4px',
                  height: `${h * 0.4}%`,
                  backgroundColor: i % 2 === 0 ? 'var(--accent-gold)' : '#F6F0E7',
                  borderRadius: '3px',
                  animation: 'waveMotion 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Candidate Response Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your Spoken Answer {isRecognizing && <span style={{ color: 'var(--status-live)' }}>(Listening to Mic...)</span>}
            </label>
            <button
              onClick={() => setCandidateAnswer(currentQ.idealAnswer)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-gold)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Use Sample Answer
            </button>
          </div>

          <textarea
            value={candidateAnswer}
            onChange={(e) => setCandidateAnswer(e.target.value)}
            placeholder="Speak into your microphone or type your response here..."
            rows={4}
            style={{
              width: '100%',
              backgroundColor: '#161616',
              border: '1px solid var(--border-card)',
              borderRadius: '12px',
              padding: '1rem',
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              resize: 'vertical',
            }}
          />
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={() => setIsMicActive(!isMicActive)}
              className="btn-secondary"
              style={{
                padding: '0.6rem 1rem',
                fontSize: '0.82rem',
                backgroundColor: isMicActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderColor: isMicActive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                color: isMicActive ? '#4ADE80' : '#FCA5A5',
              }}
            >
              {isMicActive ? <Mic size={15} /> : <MicOff size={15} />}
              <span>{isMicActive ? 'Mic Active' : 'Mic Muted'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleNextQuestion}
              className="btn-primary"
              style={{ padding: '0.65rem 1.45rem', fontSize: '0.88rem' }}
            >
              <span>{questionIdx < questions.length - 1 ? 'Submit & Next Question' : 'Complete & Generate Report'}</span>
              <SkipForward size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
