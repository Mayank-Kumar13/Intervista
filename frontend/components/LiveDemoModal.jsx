import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  SkipForward,
  Sparkles,
  PhoneOff,
  Loader2,
  Send,
  AlertCircle,
} from 'lucide-react';
import { apiStartInterview, apiSendMessage, apiEndInterview } from '../utils/api';
import { getCurrentUser } from '../utils/auth';

export default function LiveDemoModal({ isOpen, onClose, config, onFinishInterview }) {
  // ─── Session State ─────────────────────────────────────────────────────────
  const [sessionId, setSessionId] = useState(null);
  const [geminiInteractionId, setGeminiInteractionId] = useState(null);
  const [sessionPhase, setSessionPhase] = useState('idle'); // idle | starting | active | ending | done

  // ─── Conversation State ────────────────────────────────────────────────────
  const [messages, setMessages] = useState([]); // [{role:'interviewer'|'candidate', text, ts}]
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [questionCount, setQuestionCount] = useState(0);

  // ─── Audio / TTS ───────────────────────────────────────────────────────────
  const [isSpeakingAI, setIsSpeakingAI] = useState(false);
  const [isMicActive, setIsMicActive] = useState(true);
  const [isRecognizing, setIsRecognizing] = useState(false);

  // ─── Timer ────────────────────────────────────────────────────────────────
  const [seconds, setSeconds] = useState(0);

  // ─── Refs ──────────────────────────────────────────────────────────────────
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const currentRole = config?.role || 'Software Engineer';
  const isLoggedIn = !!getCurrentUser();

  // ─── Auto-scroll messages ──────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || sessionPhase !== 'active') return;
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isOpen, sessionPhase]);

  // ─── Start session on open ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      // Reset on close
      setSessionId(null);
      setGeminiInteractionId(null);
      setMessages([]);
      setCandidateAnswer('');
      setSeconds(0);
      setError('');
      setQuestionCount(0);
      setSessionPhase('idle');
      stopSpeech();
      stopRecognition();
      return;
    }

    if (sessionPhase !== 'idle') return;

    if (!isLoggedIn) {
      // Fallback: guest mode with static questions
      setSessionPhase('active');
      const guestMsg = `Hello! Welcome to your ${currentRole} mock interview. I'm Sophia, your AI interviewer today. Let's get started.\n\nTell me about yourself and what drew you to the ${currentRole} role.`;
      setMessages([{ role: 'interviewer', text: guestMsg, ts: Date.now() }]);
      speakText(guestMsg);
      startRecognition();
      return;
    }

    // Real backend session
    startSession();
  }, [isOpen]);

  async function startSession() {
    setSessionPhase('starting');
    setError('');
    try {
      const data = await apiStartInterview({
        role: config?.role || 'Software Engineer',
        company: config?.company || null,
        interviewType: config?.interviewType || 'Technical Interview',
        experience: config?.level || 'Mid Level',
        duration: config?.duration || 30,
        focusTopic: config?.focusTopic || null,
      });

      setSessionId(data.sessionId);
      setGeminiInteractionId(data.geminiInteractionId);
      setMessages([{ role: 'interviewer', text: data.message, ts: Date.now() }]);
      setSessionPhase('active');
      speakText(data.message);
      startRecognition();
    } catch (err) {
      setError(err.message || 'Failed to start interview. Check if backend is running.');
      setSessionPhase('idle');
    }
  }

  // ─── Text-to-Speech ────────────────────────────────────────────────────────
  function speakText(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    // Try to use a female voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female'));
    if (preferred) utterance.voice = preferred;
    utterance.onstart = () => setIsSpeakingAI(true);
    utterance.onend = () => setIsSpeakingAI(false);
    utterance.onerror = () => setIsSpeakingAI(false);
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeakingAI(false);
  }

  // ─── Speech Recognition ────────────────────────────────────────────────────
  function startRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setCandidateAnswer(current);
      };
      recognition.onerror = () => setIsRecognizing(false);
      recognition.onend = () => setIsRecognizing(false);

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecognizing(true);
    } catch (err) {
      console.warn('Recognition error:', err);
    }
  }

  function stopRecognition() {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    setIsRecognizing(false);
  }

  function toggleMic() {
    if (isMicActive) {
      stopRecognition();
      setIsMicActive(false);
    } else {
      startRecognition();
      setIsMicActive(true);
    }
  }

  // ─── Send Answer ───────────────────────────────────────────────────────────
  async function handleSendAnswer() {
    const answer = candidateAnswer.trim();
    if (!answer || isSending) return;

    stopSpeech();
    setIsSending(true);
    setError('');

    // Add candidate message to UI immediately
    setMessages(prev => [...prev, { role: 'candidate', text: answer, ts: Date.now() }]);
    setCandidateAnswer('');
    setQuestionCount(q => q + 1);

    // Guest mode: generate a simple follow-up
    if (!sessionId) {
      setTimeout(() => {
        const followUps = [
          "That's interesting! Can you elaborate on the technical challenges you faced?",
          "Good point. How would you handle a situation where the approach you described doesn't scale?",
          "I see. Walk me through how you would approach a related problem in a distributed system.",
          "Thank you. What trade-offs did you consider when making that decision?",
          "Great. Can you give me a specific example from your past experience?",
        ];
        const reply = questionCount < 4
          ? followUps[questionCount % followUps.length]
          : "Thank you for that detailed response. That concludes our interview today. You've done well — we'll have your report ready shortly.";
        setMessages(prev => [...prev, { role: 'interviewer', text: reply, ts: Date.now() }]);
        speakText(reply);
        setIsSending(false);
        if (questionCount >= 4) setTimeout(() => handleComplete(null), 3000);
      }, 1200);
      return;
    }

    // Real backend
    try {
      const data = await apiSendMessage({
        sessionId,
        content: answer,
        geminiInteractionId,
      });

      setGeminiInteractionId(data.geminiInteractionId);
      setMessages(prev => [...prev, { role: 'interviewer', text: data.message, ts: Date.now() }]);
      speakText(data.message);

      // Auto-complete after ~5 exchanges
      if (questionCount >= 5) {
        setTimeout(() => handleComplete(sessionId), 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to get response. Please try again.');
      // Put their answer back so they don't lose it
      setCandidateAnswer(answer);
    } finally {
      setIsSending(false);
    }
  }

  // ─── End Interview + Generate Report ──────────────────────────────────────
  async function handleComplete(sid = sessionId) {
    stopSpeech();
    stopRecognition();
    setSessionPhase('ending');

    if (!sid) {
      // Guest mode: mock report
      onFinishInterview({
        role: currentRole,
        level: config?.level || 'Mid Level',
        overallScore: 78,
        scores: { communication: 82, technicalDepth: 74, problemSolving: 76, confidence: 80 },
        summary: 'Guest mode preview — sign in to get a real AI-generated report.',
        strengths: ['Clear communication', 'Engaged with questions'],
        improvements: ['Add more specific examples', 'Deeper technical detail'],
        questionFeedback: [],
      });
      return;
    }

    try {
      const report = await apiEndInterview(sid);
      setSessionPhase('done');
      onFinishInterview(report);
    } catch (err) {
      setError(err.message || 'Failed to generate report.');
      setSessionPhase('active');
    }
  }

  // ─── Keyboard shortcut: Ctrl+Enter to send ────────────────────────────────
  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSendAnswer();
    }
  }

  const formatTimer = (t) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '860px',
          width: '95vw',
          padding: '0',
          backgroundColor: '#0A0A0A',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          overflow: 'hidden',
        }}
      >
        {/* ─── Top Bar ──────────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {sessionPhase === 'active' && <span className="pulse-dot" />}
            {sessionPhase === 'ending' && <Loader2 size={14} color="var(--accent-gold)" style={{ animation: 'spin 1s linear infinite' }} />}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {currentRole} Mock Interview
                {!isLoggedIn && (
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(217,183,122,0.15)', color: 'var(--accent-gold)', border: '1px solid rgba(217,183,122,0.3)', fontWeight: 500, marginLeft: '8px' }}>
                    Guest Mode
                  </span>
                )}
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
                {sessionPhase === 'starting' ? 'Connecting to Sophia (AI Interviewer)...' :
                 sessionPhase === 'ending' ? 'Generating your personalized report...' :
                 sessionPhase === 'done' ? 'Interview complete!' :
                 `Interviewer: Sophia (AI Lead) · ${config?.company || 'General'} · ${questionCount} question${questionCount !== 1 ? 's' : ''} answered`}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Timer */}
            {sessionPhase === 'active' && (
              <div style={{
                backgroundColor: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                padding: '0.3rem 0.8rem', borderRadius: '8px',
                color: '#F87171', fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 600,
              }}>
                {formatTimer(seconds)}
              </div>
            )}

            {/* Finish button */}
            {(sessionPhase === 'active') && (
              <button
                onClick={() => handleComplete(sessionId)}
                disabled={isSending || sessionPhase === 'ending'}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  backgroundColor: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.35)',
                  color: '#FCA5A5', padding: '0.4rem 0.9rem',
                  borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                <PhoneOff size={13} />
                <span>Finish & Get Report</span>
              </button>
            )}

            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ─── Loading / Starting ────────────────────────────────────────── */}
        {sessionPhase === 'starting' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '3rem' }}>
            <Loader2 size={36} color="var(--accent-gold)" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Sophia is preparing your interview...</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Using Gemini AI to generate role-specific questions</p>
          </div>
        )}

        {/* ─── Ending / Generating Report ───────────────────────────────── */}
        {sessionPhase === 'ending' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '3rem' }}>
            <Loader2 size={36} color="var(--accent-gold)" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 500 }}>Analyzing your performance...</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Gemini AI is reviewing your answers and generating a personalized report</p>
          </div>
        )}

        {/* ─── Active Interview ──────────────────────────────────────────── */}
        {sessionPhase === 'active' && (
          <>
            {/* Error Banner */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                padding: '0.6rem 1.2rem', color: '#FCA5A5', fontSize: '0.82rem',
                flexShrink: 0,
              }}>
                <AlertCircle size={14} />
                <span>{error}</span>
                <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: 'auto' }}>✕</button>
              </div>
            )}

            {/* ─── Conversation Thread ──────────────────────────────────── */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '1.5rem 1.75rem',
              display: 'flex', flexDirection: 'column', gap: '1rem',
              scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: msg.role === 'candidate' ? 'flex-end' : 'flex-start',
                }}>
                  {/* Label */}
                  <span style={{
                    fontSize: '0.68rem', color: 'var(--text-muted)',
                    marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em',
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}>
                    {msg.role === 'interviewer' ? (
                      <><Volume2 size={11} color="var(--accent-gold)" /> Sophia (AI Interviewer)</>
                    ) : (
                      <><Mic size={11} color="#4ADE80" /> You</>
                    )}
                  </span>

                  {/* Bubble */}
                  <div style={{
                    maxWidth: '82%',
                    backgroundColor: msg.role === 'interviewer' ? '#161616' : 'rgba(245,231,200,0.08)',
                    border: `1px solid ${msg.role === 'interviewer' ? 'rgba(255,255,255,0.08)' : 'rgba(245,231,200,0.2)'}`,
                    borderRadius: msg.role === 'interviewer' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                    padding: '0.85rem 1.1rem',
                    color: msg.role === 'interviewer' ? 'var(--text-primary)' : 'var(--accent-champagne)',
                    fontSize: '0.92rem', lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isSending && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <Volume2 size={11} color="var(--accent-gold)" style={{ display: 'inline' }} /> Sophia is thinking...
                  </span>
                  <div style={{
                    backgroundColor: '#161616', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '4px 16px 16px 16px', padding: '0.85rem 1.1rem',
                    display: 'flex', gap: '4px', alignItems: 'center',
                  }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <div key={i} style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        backgroundColor: 'var(--accent-gold)', opacity: 0.6,
                        animation: 'waveMotion 1s ease-in-out infinite',
                        animationDelay: `${delay}s`,
                      }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ─── AI Speaking Indicator ────────────────────────────────── */}
            {isSpeakingAI && (
              <div style={{
                padding: '0.5rem 1.75rem',
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                backgroundColor: 'rgba(217,183,122,0.04)', flexShrink: 0,
              }}>
                <span className="pulse-dot" />
                <span style={{ fontSize: '0.76rem', color: 'var(--accent-gold)' }}>Sophia is speaking...</span>
                <div style={{ display: 'flex', gap: '3px', marginLeft: '4px' }}>
                  {[12, 22, 16, 26, 18].map((h, i) => (
                    <div key={i} style={{
                      width: '3px', height: `${h}px`,
                      backgroundColor: 'var(--accent-gold)', borderRadius: '2px',
                      animation: 'waveMotion 0.8s ease-in-out infinite',
                      animationDelay: `${i * 0.1}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* ─── Input Area ───────────────────────────────────────────── */}
            <div style={{
              padding: '1.25rem 1.75rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              flexShrink: 0, backgroundColor: '#0A0A0A',
            }}>
              {/* Mic status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {isRecognizing && isMicActive ? (
                    <><span className="pulse-dot" style={{ width: '6px', height: '6px', backgroundColor: '#4ADE80' }} /> Microphone active — speak your answer</>
                  ) : (
                    <><MicOff size={11} /> Microphone off — type your answer</>
                  )}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Ctrl+Enter to send</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                <textarea
                  ref={textareaRef}
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Speak your answer or type here..."
                  rows={3}
                  disabled={isSending}
                  style={{
                    flex: 1,
                    backgroundColor: '#141414',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                    resize: 'none',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(245,231,200,0.3)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />

                {/* Action buttons column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Toggle mic */}
                  <button
                    onClick={toggleMic}
                    title={isMicActive ? 'Mute mic' : 'Unmute mic'}
                    style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      backgroundColor: isMicActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      border: `1px solid ${isMicActive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      color: isMicActive ? '#4ADE80' : '#FCA5A5',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {isMicActive ? <Mic size={16} /> : <MicOff size={16} />}
                  </button>

                  {/* Send button */}
                  <button
                    onClick={handleSendAnswer}
                    disabled={!candidateAnswer.trim() || isSending}
                    style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      backgroundColor: candidateAnswer.trim() && !isSending ? 'var(--accent-champagne)' : 'rgba(255,255,255,0.06)',
                      border: 'none',
                      color: candidateAnswer.trim() && !isSending ? '#0A0A0A' : 'var(--text-muted)',
                      cursor: candidateAnswer.trim() && !isSending ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    {isSending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
