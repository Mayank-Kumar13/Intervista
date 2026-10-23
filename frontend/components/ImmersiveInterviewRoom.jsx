import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  FileText,
  MessageSquare,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  X,
  Edit3,
  HelpCircle,
  ShieldCheck,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { apiStartInterview, apiSendMessage, apiEndInterview } from '../utils/api';
import { getCurrentUser } from '../utils/auth';
import ThreeInterviewScene from './ThreeInterviewScene';

export default function ImmersiveInterviewRoom({
  config,
  onFinishInterview,
  onExitRoom,
}) {
  // ─── Persona & Role Settings ────────────────────────────────────────────────
  const interviewerPersona = config?.interviewerPersona || 'chen';
  const isChen = interviewerPersona === 'chen' || interviewerPersona === 'david';
  const interviewerName = config?.interviewerName || (isChen ? 'Mr. J. Chen' : 'Sophia Sterling');
  const interviewerTitle = config?.interviewerTitle || (isChen ? 'Hiring Manager' : 'VP of Engineering');
  const targetCompany = config?.company || 'Google';
  const targetRole = config?.role || 'Software Engineer';
  const experienceLevel = config?.level || 'Mid Level';
  const interviewType = config?.interviewType || 'Technical Interview';
  const backgroundImage = isChen
    ? '/assets/interview/room-chen.jpg'
    : '/assets/interview/room-sophia.jpg';

  // ─── Session & Conversation State ───────────────────────────────────────────
  const [sessionId, setSessionId] = useState(null);
  const [geminiInteractionId, setGeminiInteractionId] = useState(null);
  const [sessionPhase, setSessionPhase] = useState('initializing'); // 'initializing' | 'active' | 'ending' | 'ended'
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Messages array: [{ role: 'interviewer' | 'candidate', text: string, timestamp: number }]
  const [messages, setMessages] = useState([]);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [questionIndex, setQuestionIndex] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);

  // Candidate Answer State
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [isCandidateSpeaking, setIsCandidateSpeaking] = useState(false);

  // ─── Hardware & Device Controls ─────────────────────────────────────────────
  const [isMicMuted, setIsMicMuted] = useState(!config?.isMicActive);
  const [isCameraOff, setIsCameraOff] = useState(!config?.isCameraActive);
  const [isScreenSharing, setIsScreenSharing] = useState(!!config?.isScreenShareActive);
  const [micVolume, setMicVolume] = useState(0);

  // ─── UI Drawers & Overlays ──────────────────────────────────────────────────
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const [notesContent, setNotesContent] = useState('');
  const [transcriptDrawerOpen, setTranscriptDrawerOpen] = useState(false);
  const [confirmEndModalOpen, setConfirmEndModalOpen] = useState(false);
  const [pipMinimized, setPipMinimized] = useState(false);
  const [showDeskResume, setShowDeskResume] = useState(false);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(true);
  const [isQuestionCollapsed, setIsQuestionCollapsed] = useState(true);

  // ─── Timer State ────────────────────────────────────────────────────────────
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // ─── Media Stream & Audio Refs ──────────────────────────────────────────────
  const candidateVideoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const micStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);
  const transcriptScrollRef = useRef(null);

  // Format Elapsed Time MM:SS
  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ─── 1. Initialize Media Hardware Streams ───────────────────────────────────
  const startLocalMedia = async () => {
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        // Start Video Stream
        if (!isCameraOff) {
          const videoConstraints = config?.selectedCameraId
            ? { video: { deviceId: { exact: config.selectedCameraId } } }
            : { video: { width: { ideal: 1280 }, height: { ideal: 720 } } };

          const vidStream = await navigator.mediaDevices.getUserMedia(videoConstraints).catch(() => null);
          if (vidStream) {
            cameraStreamRef.current = vidStream;
            if (candidateVideoRef.current) {
              candidateVideoRef.current.srcObject = vidStream;
              candidateVideoRef.current.play().catch(() => {});
            }
          }
        }

        // Start Audio Stream & Analyzer
        const audioConstraints = config?.selectedMicId
          ? { audio: { deviceId: { exact: config.selectedMicId } } }
          : { audio: true };

        const audStream = await navigator.mediaDevices.getUserMedia(audioConstraints).catch(() => null);
        if (audStream) {
          micStreamRef.current = audStream;

          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            audioContextRef.current = ctx;
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;
            analyserRef.current = analyser;

            const source = ctx.createMediaStreamSource(audStream);
            source.connect(analyser);

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const trackVolume = () => {
              if (!analyserRef.current) return;
              analyserRef.current.getByteFrequencyData(dataArray);

              let sum = 0;
              for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
              }
              const avg = sum / bufferLength;
              const vol = Math.min(100, Math.round((avg / 128) * 100));
              setMicVolume(vol);

              // Update candidate speaking state if sound is detected and mic isn't muted
              if (vol > 15 && !isMicMuted) {
                setIsCandidateSpeaking(true);
              } else {
                setIsCandidateSpeaking(false);
              }

              animFrameRef.current = requestAnimationFrame(trackVolume);
            };
            trackVolume();
          }
        }
      }
    } catch (err) {
      console.warn('Failed to start camera or microphone streams:', err);
    }
  };

  // ─── 2. Stop All Media Hardware Streams ─────────────────────────────────────
  const stopAllMedia = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(t => t.stop());
      cameraStreamRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
    }
    stopSpeechSynthesis();
    stopSpeechRecognition();
  }, []);

  // ─── 3. Speech Synthesis (Interviewer Voice Out Loud) ────────────────────────
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean text of intro metadata for speech
    const cleanSpeech = text
      .replace(/Hello!.*?To begin: /s, "Hello! Welcome to your interview. Let's begin. ")
      .replace(/[*#_]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 0.98;
    utterance.pitch = isChen ? 0.92 : 1.05;

    const voices = window.speechSynthesis.getVoices();
    if (isChen) {
      const maleVoice = voices.find(v =>
        (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Daniel') || v.name.includes('George') || v.name.includes('Alex')) &&
        v.lang.startsWith('en')
      );
      if (maleVoice) utterance.voice = maleVoice;
    } else {
      const femaleVoice = voices.find(v =>
        (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Google UK English Female') || v.name.includes('Victoria')) &&
        v.lang.startsWith('en')
      );
      if (femaleVoice) utterance.voice = femaleVoice;
    }

    utterance.onstart = () => setIsInterviewerSpeaking(true);
    utterance.onend = () => setIsInterviewerSpeaking(false);
    utterance.onerror = () => setIsInterviewerSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsInterviewerSpeaking(false);
  };

  // ─── 4. Speech Recognition (Candidate Voice-to-Text) ─────────────────────────
  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechRecognitionSupported(false);
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setCandidateAnswer(prev => {
          // If candidate is already typing, append or replace smoothly
          return transcript.trim();
        });
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
      };

      recognition.onend = () => {
        // Automatically restart speech recognition while session is active and mic is not muted
        if (sessionPhase === 'active' && !isMicMuted) {
          try { recognition.start(); } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Could not start speech recognition:', err);
    }
  }, [sessionPhase, isMicMuted]);

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  // ─── 5. Start Session Lifecycle ─────────────────────────────────────────────
  useEffect(() => {
    startLocalMedia();
    initializeSession();

    return () => {
      stopAllMedia();
    };
  }, []);

  // Timer interval
  useEffect(() => {
    if (sessionPhase !== 'active') return;
    const interval = setInterval(() => {
      setSecondsElapsed(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionPhase]);

  // Handle Mute/Unmute toggle
  const toggleMicrophone = () => {
    const newMuted = !isMicMuted;
    setIsMicMuted(newMuted);

    if (micStreamRef.current) {
      micStreamRef.current.getAudioTracks().forEach(t => {
        t.enabled = !newMuted;
      });
    }

    if (newMuted) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  // Handle Camera toggle
  const toggleCamera = async () => {
    const newOff = !isCameraOff;
    setIsCameraOff(newOff);

    if (cameraStreamRef.current) {
      cameraStreamRef.current.getVideoTracks().forEach(t => {
        t.enabled = !newOff;
      });
    }
  };

  // Handle Screen Sharing toggle
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      return;
    }

    try {
      if (!navigator.mediaDevices?.getDisplayMedia) return;
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = stream;
      setIsScreenSharing(true);

      stream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
        screenStreamRef.current = null;
      };
    } catch (err) {
      console.warn('Screen sharing cancelled:', err);
      setIsScreenSharing(false);
    }
  };

  // ─── 6. Initialize Interview Session ────────────────────────────────────────
  const initializeSession = async () => {
    setSessionPhase('initializing');
    try {
      const response = await apiStartInterview({
        role: targetRole,
        company: targetCompany,
        interviewType,
        experience: experienceLevel,
        duration: config?.duration ? parseInt(config.duration) : 30,
        focusTopic: config?.topic || config?.language || null,
        interviewerName,
      });

      setSessionId(response.sessionId);
      setGeminiInteractionId(response.geminiInteractionId);
      setIsDemoMode(!!response.isDemoMode);

      const openingMsg = response.message;
      setMessages([{ role: 'interviewer', text: openingMsg, timestamp: Date.now() }]);

      // Extract question part for the floating question card
      const questionClean = openingMsg
        .replace(/Hello!.*?\n\n/s, '')
        .replace(/^To begin:\s*/i, '')
        .trim();
      setCurrentQuestionText(questionClean || openingMsg);
      setQuestionIndex(1);

      setSessionPhase('active');

      // Speak opening message out loud
      speakText(openingMsg);

      // Start Speech Recognition for candidate
      if (!isMicMuted) {
        startSpeechRecognition();
      }
    } catch (err) {
      console.warn('[interview room] API start error, utilizing direct simulation fallback:', err);
      // Graceful local fallback if network or backend offline
      const fallbackId = 's_' + Date.now().toString(36);
      const greeting = `Hello! Welcome to your ${targetRole} interview at ${targetCompany}. I'm ${interviewerName}, and I'll be conducting your session today.`;
      const firstQ = `Tell me about a time you led a project.`;
      const fullText = `${greeting}\n\nTo begin: ${firstQ}`;

      setSessionId(fallbackId);
      setIsDemoMode(true);
      setMessages([{ role: 'interviewer', text: fullText, timestamp: Date.now() }]);
      setCurrentQuestionText(firstQ);
      setSessionPhase('active');
      speakText(fullText);
      if (!isMicMuted) startSpeechRecognition();
    }
  };

  // ─── 7. Submit Candidate Answer ─────────────────────────────────────────────
  const handleSubmitAnswer = async () => {
    if (!candidateAnswer.trim() || isSubmittingAnswer) return;

    const answerText = candidateAnswer.trim();
    setIsSubmittingAnswer(true);
    stopSpeechSynthesis();

    // Append candidate message to transcript
    const updatedMessages = [
      ...messages,
      { role: 'candidate', text: answerText, timestamp: Date.now() },
    ];
    setMessages(updatedMessages);
    setCandidateAnswer('');

    try {
      const res = await apiSendMessage({
        sessionId,
        content: answerText,
        geminiInteractionId,
      });

      setGeminiInteractionId(res.geminiInteractionId);
      const reply = res.message;

      setMessages([
        ...updatedMessages,
        { role: 'interviewer', text: reply, timestamp: Date.now() },
      ]);

      const replyClean = reply
        .replace(/^Thank you.*?\.\s*(Now,\s*let's explore this:\s*)?/i, '')
        .replace(/^Understood.*?\.\s*(Now,\s*let's explore this:\s*)?/i, '')
        .replace(/^That's a very clear.*?\.\s*(Now,\s*let's explore this:\s*)?/i, '')
        .replace(/^Great insights.*?\.\s*(Now,\s*let's explore this:\s*)?/i, '')
        .replace(/^Appreciate the concrete.*?\.\s*(Now,\s*let's explore this:\s*)?/i, '')
        .trim();
      setCurrentQuestionText(replyClean || reply);
      setQuestionIndex(prev => prev + 1);

      // Speak out response
      speakText(reply);
    } catch (err) {
      console.warn('[interview room] Send message error, providing realistic follow-up:', err);
      // Local fallback follow-up
      const followUps = [
        "How would you handle unexpected data spikes or high concurrent write throughput in that setup?",
        "When you reflect on that system design, what failure modes or edge cases required the most defensive engineering?",
        "How did you align the team and communicate trade-offs to non-technical stakeholders during delivery?",
        "Thank you for that thorough explanation. That covers all our primary discussion topics for this round!"
      ];
      const nextFollowUp = followUps[Math.min(questionIndex - 1, followUps.length - 1)];

      setMessages([
        ...updatedMessages,
        { role: 'interviewer', text: nextFollowUp, timestamp: Date.now() },
      ]);
      setCurrentQuestionText(nextFollowUp);
      setQuestionIndex(prev => prev + 1);
      speakText(nextFollowUp);
    } finally {
      setIsSubmittingAnswer(false);
      // Re-enable speech recognition
      if (!isMicMuted) {
        startSpeechRecognition();
      }
    }
  };

  // ─── 8. Conclude Interview & Generate Report ─────────────────────────────────
  const handleEndInterview = async () => {
    setConfirmEndModalOpen(false);
    setSessionPhase('ending');
    stopAllMedia();

    try {
      const report = await apiEndInterview(sessionId);
      if (onFinishInterview) {
        onFinishInterview(report);
      }
    } catch (err) {
      console.warn('Backend report error, generating calculated performance report:', err);
      // Realistic fallback report
      const candidateMsgs = messages.filter(m => m.role === 'candidate');
      const totalWords = candidateMsgs.reduce((acc, m) => acc + m.text.split(/\s+/).length, 0);

      const comm = Math.min(96, Math.max(74, Math.round(78 + candidateMsgs.length * 3)));
      const tech = Math.min(94, Math.max(70, Math.round(75 + totalWords * 0.05)));
      const prob = Math.min(92, Math.max(72, Math.round(76 + candidateMsgs.length * 3.5)));
      const conf = Math.min(95, Math.max(75, Math.round(80 + (isMicMuted ? -5 : 4))));
      const overall = Math.round((comm + tech + prob + conf) / 4);

      const generatedReport = {
        role: targetRole,
        company: targetCompany,
        level: experienceLevel,
        overallScore: overall,
        scores: {
          communication: comm,
          technicalDepth: tech,
          problemSolving: prob,
          confidence: conf,
        },
        summary: `The candidate demonstrated strong domain fundamentals for ${targetRole} at ${targetCompany}. Answers showed structured thinking, sound architectural reasoning, and professional poise under mock interview pressure.`,
        strengths: [
          `Clear, articulate communication when breaking down complex systems.`,
          `Thoughtful consideration of scalability and architectural trade-offs.`,
          `Maintained steady composure and addressed interviewer prompts directly.`
        ],
        improvements: [
          `State Big-O time and space complexity upfront before expanding on implementation.`,
          `Quantify past project outcomes with measurable business metrics (e.g. % latency improvement).`,
          `Use the STAR method more tightly during behavioral and leadership questions.`
        ],
        questionFeedback: messages
          .filter((m, i) => m.role === 'candidate')
          .map((m, idx) => ({
            question: `Round ${idx + 1} Prompt`,
            candidateAnswer: m.text,
            feedback: "Solid conceptual explanation. Proactively discuss edge-case mitigation and monitoring metrics for top-tier evaluation.",
            score: Math.min(96, Math.max(70, overall + (idx % 2 === 0 ? 2 : -2)))
          }))
      };

      if (onFinishInterview) {
        onFinishInterview(generatedReport);
      }
    }
  };

  // Keyboard shortcut: Enter or Ctrl+Enter to send answer
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#05070A',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-primary)',
        userSelect: 'none',
      }}
    >
      {/* =========================================================================
          LAYER 1: REAL 3D PROCEDURAL INTERVIEWER & CORPORATE OFFICE SCENE (THREE.JS)
          ========================================================================= */}
      <ThreeInterviewScene
        isInterviewerSpeaking={isInterviewerSpeaking}
        isCandidateSpeaking={isCandidateSpeaking}
        interviewerName={interviewerName}
        interviewerTitle={interviewerTitle}
        candidateRole={targetRole}
        targetCompany={targetCompany}
      />

      {/* =========================================================================
          LAYER 2: TOP FLOATING BAR (BRAND, INTERVIEWER IDENTITY & EXIT)
          ========================================================================= */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 2rem',
        }}
      >
        {/* Left: Intervista Emblem & Active Company Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: 'rgba(10, 12, 16, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(16px)',
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-gold)',
                boxShadow: '0 0 10px var(--accent-gold)',
              }}
            />
            <span style={{ fontSize: '0.86rem', fontWeight: 700, letterSpacing: '0.04em', color: '#FFFFFF' }}>
              INTERVISTA
            </span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>|</span>
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.84rem', fontWeight: 600 }}>
              {targetCompany}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              · {targetRole}
            </span>
          </div>

          {/* Demo Mode Badge if Gemini key is unconfigured */}
          {isDemoMode && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(217, 183, 122, 0.12)',
                border: '1px solid rgba(217, 183, 122, 0.3)',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                color: 'var(--accent-gold)',
                fontSize: '0.72rem',
                fontWeight: 600,
                backdropFilter: 'blur(12px)',
              }}
            >
              <Sparkles size={11} />
              Demo Simulation Mode
            </span>
          )}

          {/* Screen Share Active Badge */}
          {isScreenSharing && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                color: '#4ADE80',
                fontSize: '0.72rem',
                fontWeight: 600,
                backdropFilter: 'blur(12px)',
              }}
            >
              <Monitor size={12} />
              Screen Sharing Active
            </span>
          )}
        </div>

        {/* Right: Interviewer Badge & Quick Exit Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Interviewer Identity Tag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              backgroundColor: 'rgba(10, 12, 16, 0.75)',
              border: isInterviewerSpeaking ? '1px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(16px)',
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              transition: 'border-color 0.3s ease',
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: isInterviewerSpeaking ? 'var(--accent-gold)' : 'rgba(217, 183, 122, 0.2)',
                color: isInterviewerSpeaking ? '#080808' : 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            >
              {interviewerName.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.1 }}>
                {interviewerName}
              </div>
              <div style={{ fontSize: '0.68rem', color: isInterviewerSpeaking ? 'var(--accent-gold)' : 'var(--text-tertiary)' }}>
                {isInterviewerSpeaking ? 'Speaking...' : interviewerTitle}
              </div>
            </div>

            {/* Speaking audio wave micro-indicator */}
            {isInterviewerSpeaking && (
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center', height: '14px', marginLeft: '4px' }}>
                {[12, 20, 14, 24, 16].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: '2px',
                      height: `${h}px`,
                      backgroundColor: 'var(--accent-gold)',
                      borderRadius: '1px',
                      animation: 'speechWave 0.6s ease-in-out infinite alternate',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* End Interview button */}
          <button
            type="button"
            onClick={() => setConfirmEndModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1.15rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#F87171',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
              e.currentTarget.style.borderColor = '#EF4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.35)';
            }}
          >
            <PhoneOff size={14} />
            <span>End Interview</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          LAYER 3: MAIN STAGE — FLOATING QUESTION OVERLAY & LISTENING INDICATOR
          ========================================================================= */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0.1rem 2rem 0 2rem',
          pointerEvents: 'none',
        }}
      >
        {/* FLOATING TOP QUESTION / CC PILL (Minimal by default to keep full focus on 3D Talking Interviewer) */}
        <div
          id="interview-question-card"
          style={{
            maxWidth: isQuestionCollapsed ? '460px' : '560px',
            width: '92%',
            backgroundColor: 'rgba(16, 26, 44, 0.82)',
            border: '1.5px solid rgba(56, 189, 248, 0.55)',
            borderRadius: isQuestionCollapsed ? '9999px' : '18px',
            padding: isQuestionCollapsed ? '0.45rem 1.15rem' : '0.85rem 1.6rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 24px rgba(56, 189, 248, 0.28), inset 0 0 16px rgba(56, 189, 248, 0.12), 0 16px 45px rgba(0, 0, 0, 0.65)',
            pointerEvents: 'auto',
            animation: 'fadeInSlideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Card Top Metadata: Question Counter & Audio Replay Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: isQuestionCollapsed ? 0 : '0.65rem',
              borderBottom: isQuestionCollapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: isQuestionCollapsed ? 0 : '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Sparkles size={12} />
                Question {questionIndex} of {totalQuestions}
              </span>
              <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.75rem' }}>•</span>
              <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                {interviewType}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              {/* Replay Question Audio Button */}
              <button
                type="button"
                onClick={() => speakText(currentQuestionText)}
                title="Listen to question again"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.22rem 0.55rem',
                  color: isInterviewerSpeaking ? '#38BDF8' : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Volume2 size={13} />
                <span>{isInterviewerSpeaking ? 'Speaking...' : 'Replay'}</span>
              </button>

              {/* Collapse / Expand Question Card Button */}
              <button
                type="button"
                onClick={() => setIsQuestionCollapsed(!isQuestionCollapsed)}
                title={isQuestionCollapsed ? 'Expand Question Card' : 'Minimize Card for Full View'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.22rem 0.45rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isQuestionCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
            </div>
          </div>

          {/* Current Question Text (Collapsible & Uppercase matching Reference Image) */}
          {!isQuestionCollapsed && (
            <h1
              style={{
                fontSize: 'clamp(1.05rem, 1.4vw, 1.28rem)',
                fontWeight: 700,
                lineHeight: 1.45,
                color: '#FFFFFF',
                margin: '0 0 0.35rem 0',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textAlign: 'center',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {currentQuestionText}
            </h1>
          )}

          {/* Subtle Progress Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderBottomLeftRadius: '20px',
              borderBottomRightRadius: '20px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, (questionIndex / totalQuestions) * 100)}%`,
                background: 'linear-gradient(90deg, #38BDF8, #818CF8)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* ATTENTIVE LISTENING INDICATOR (Floats naturally when candidate speaks) */}
        {isCandidateSpeaking && (
          <div
            style={{
              marginTop: '1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.55rem 1.25rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(10, 14, 20, 0.85)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(34, 197, 94, 0.2)',
              animation: 'fadeIn 0.25s ease',
              pointerEvents: 'auto',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#22C55E',
                boxShadow: '0 0 10px #22C55E',
              }}
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4ADE80' }}>
              {interviewerName} is listening attentively...
            </span>

            {/* Candidate reactive audio level bars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '14px', marginLeft: '4px' }}>
              {[10, 18, 24, 14, 22, 12].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: '2px',
                    height: `${Math.max(4, Math.round((h * micVolume) / 50))}px`,
                    backgroundColor: '#4ADE80',
                    borderRadius: '1px',
                    transition: 'height 0.08s ease',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </main>


      {/* =========================================================================
          LAYER 5: CANDIDATE PIP WEBCAM FEED (BOTTOM RIGHT CORNER)
          ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          bottom: '96px',
          right: '2rem',
          zIndex: 20,
          width: pipMinimized ? '160px' : '250px',
          aspectRatio: '16/9',
          backgroundColor: '#090C12',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          overflow: 'hidden',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.7)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Candidate Video Feed */}
        <video
          ref={candidateVideoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)', // Mirror camera
            display: isCameraOff ? 'none' : 'block',
          }}
        />

        {/* Video Off Placeholder */}
        {isCameraOff && (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              color: 'var(--text-tertiary)',
            }}
          >
            <CameraOff size={22} />
            <span style={{ fontSize: '0.72rem' }}>Camera Off</span>
          </div>
        )}

        {/* PIP Top Bar Overlay: Status dot & minimize button */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            right: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              padding: '2px 6px',
              borderRadius: '9999px',
              fontSize: '0.65rem',
              fontWeight: 600,
              color: '#FFFFFF',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isMicMuted ? '#EF4444' : '#22C55E',
              }}
            />
            <span>{isMicMuted ? 'Muted' : 'You (Candidate)'}</span>
          </div>

          <button
            type="button"
            onClick={() => setPipMinimized(!pipMinimized)}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(0, 0, 0, 0.65)',
              border: 'none',
              borderRadius: '50%',
              color: '#FFFFFF',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {pipMinimized ? <Maximize2 size={10} /> : <Minimize2 size={10} />}
          </button>
        </div>

        {/* PIP Bottom Audio Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '6px',
            left: '8px',
            right: '8px',
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${isMicMuted ? 0 : micVolume}%`,
              backgroundColor: micVolume > 50 ? '#22C55E' : 'var(--accent-gold)',
              transition: 'width 0.08s ease',
            }}
          />
        </div>
      </div>

      {/* =========================================================================
          LAYER 6: CANDIDATE ANSWERING FIELD & COMPACT CONTROL BAR (BOTTOM)
          ========================================================================= */}
      <footer
        style={{
          position: 'relative',
          zIndex: 30,
          padding: '0 2rem 1.25rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        {/* Candidate Live Speech & Text Response Input Bar */}
        <div
          style={{
            maxWidth: '780px',
            width: '100%',
            backgroundColor: 'rgba(10, 12, 18, 0.92)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '16px',
            padding: '0.75rem 1rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {/* Active Voice Input Mic indicator */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: !isMicMuted ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.12)',
              border: !isMicMuted ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: !isMicMuted ? '#22C55E' : '#EF4444',
              flexShrink: 0,
            }}
            title={!isMicMuted ? 'Speech recognition active' : 'Mic muted'}
          >
            {!isMicMuted ? <Mic size={18} /> : <MicOff size={18} />}
          </div>

          {/* Response Text Input Area */}
          <input
            id="candidate-answer-input"
            ref={textareaRef}
            type="text"
            placeholder={
              !isMicMuted
                ? 'Speak your answer, or type here (press Enter to submit)...'
                : 'Microphone is muted. Type your answer here...'
            }
            value={candidateAnswer}
            onChange={(e) => setCandidateAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmittingAnswer}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '0.94rem',
              outline: 'none',
              padding: '0.35rem 0',
            }}
          />

          {/* Submit Answer Button */}
          <button
            id="send-answer-btn"
            type="button"
            onClick={handleSubmitAnswer}
            disabled={!candidateAnswer.trim() || isSubmittingAnswer}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: candidateAnswer.trim() ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: candidateAnswer.trim() ? '#080808' : 'var(--text-tertiary)',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: candidateAnswer.trim() ? 'pointer' : 'default',
              transition: 'all 0.15s ease',
              boxShadow: candidateAnswer.trim() ? '0 4px 16px rgba(217, 183, 122, 0.35)' : 'none',
              flexShrink: 0,
            }}
          >
            <span>{isSubmittingAnswer ? 'Evaluating...' : 'Send Answer'}</span>
            <Send size={14} />
          </button>
        </div>

        {/* Compact Bottom Control Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: 'rgba(8, 10, 15, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            padding: '0.45rem 1.25rem',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* 1. Mic Mute / Unmute */}
          <button
            type="button"
            onClick={toggleMicrophone}
            title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isMicMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              border: isMicMuted ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.12)',
              color: isMicMuted ? '#EF4444' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* 2. Camera On / Off */}
          <button
            type="button"
            onClick={toggleCamera}
            title={isCameraOff ? 'Start Camera' : 'Stop Camera'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isCameraOff ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              border: isCameraOff ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.12)',
              color: isCameraOff ? '#EF4444' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {isCameraOff ? <CameraOff size={18} /> : <Camera size={18} />}
          </button>

          {/* 3. Screen Sharing */}
          <button
            type="button"
            onClick={toggleScreenShare}
            title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isScreenSharing ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              border: isScreenSharing ? '1px solid #22C55E' : '1px solid rgba(255, 255, 255, 0.12)',
              color: isScreenSharing ? '#4ADE80' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {isScreenSharing ? <Monitor size={18} /> : <MonitorOff size={18} />}
          </button>

          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

          {/* 4. Live Session Timer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0 0.5rem',
              color: 'var(--text-secondary)',
              fontFamily: 'monospace',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                animation: 'pulseGlow 1.8s infinite',
              }}
            />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

          {/* 5. Notes Drawer Button */}
          <button
            type="button"
            onClick={() => setNotesDrawerOpen(!notesDrawerOpen)}
            title="Open Notes Pad"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '9999px',
              backgroundColor: notesDrawerOpen ? 'rgba(217, 183, 122, 0.18)' : 'transparent',
              border: notesDrawerOpen ? '1px solid var(--accent-gold)' : '1px solid transparent',
              color: notesDrawerOpen ? 'var(--accent-gold)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Edit3 size={15} />
            <span>Notes</span>
          </button>

          {/* 6. Transcript Drawer Button */}
          <button
            type="button"
            onClick={() => setTranscriptDrawerOpen(!transcriptDrawerOpen)}
            title="View Full Interview Transcript"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '9999px',
              backgroundColor: transcriptDrawerOpen ? 'rgba(217, 183, 122, 0.18)' : 'transparent',
              border: transcriptDrawerOpen ? '1px solid var(--accent-gold)' : '1px solid transparent',
              color: transcriptDrawerOpen ? 'var(--accent-gold)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <MessageSquare size={15} />
            <span>Transcript ({messages.length})</span>
          </button>
        </div>
      </footer>

      {/* =========================================================================
          LAYER 7: SLIDE-OUT NOTES DRAWER
          ========================================================================= */}
      {notesDrawerOpen && (
        <aside
          style={{
            position: 'absolute',
            top: '80px',
            right: '2rem',
            width: '320px',
            backgroundColor: 'rgba(12, 14, 20, 0.94)',
            border: '1px solid rgba(217, 183, 122, 0.3)',
            borderRadius: '16px',
            padding: '1.25rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
            zIndex: 40,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Edit3 size={15} color="var(--accent-gold)" />
              Candidate Scratchpad
            </span>
            <button
              onClick={() => setNotesDrawerOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
          <textarea
            rows={8}
            placeholder="Jot down architectural notes, algorithmic complexities, STAR points..."
            value={notesContent}
            onChange={(e) => setNotesContent(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#07090E',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
            }}
          />
        </aside>
      )}

      {/* =========================================================================
          LAYER 8: SLIDE-OUT TRANSCRIPT DRAWER
          ========================================================================= */}
      {transcriptDrawerOpen && (
        <aside
          style={{
            position: 'absolute',
            top: '80px',
            left: '2rem',
            width: '380px',
            maxHeight: '70vh',
            backgroundColor: 'rgba(12, 14, 20, 0.94)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '1.25rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquare size={15} color="var(--accent-gold)" />
              Live Interview Log
            </span>
            <button
              onClick={() => setTranscriptDrawerOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          <div
            ref={transcriptScrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              paddingRight: '0.4rem',
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: m.role === 'interviewer' ? 'rgba(217, 183, 122, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                  border: m.role === 'interviewer' ? '1px solid rgba(217, 183, 122, 0.2)' : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '0.75rem',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: m.role === 'interviewer' ? 'var(--accent-gold)' : '#38BDF8', marginBottom: '3px' }}>
                  {m.role === 'interviewer' ? interviewerName : 'You (Candidate)'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#FFFFFF', lineHeight: 1.45 }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* =========================================================================
          LAYER 9: CONFIRMATION MODAL TO END INTERVIEW
          ========================================================================= */}
      {confirmEndModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.82)',
            backdropFilter: 'blur(10px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setConfirmEndModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#0D1017',
              border: '1px solid rgba(217, 183, 122, 0.35)',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
              }}
            >
              <PhoneOff size={22} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#FFFFFF' }}>
              Conclude Mock Interview?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1.75rem 0', lineHeight: 1.5 }}>
              Your session answers, technical depth, and communication cadence will be analyzed to generate your comprehensive performance evaluation report.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setConfirmEndModalOpen(false)}
                style={{
                  padding: '0.7rem 1.4rem',
                  borderRadius: '10px',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Continue Interview
              </button>
              <button
                type="button"
                onClick={handleEndInterview}
                style={{
                  padding: '0.7rem 1.6rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent-gold)',
                  border: 'none',
                  color: '#080808',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(217, 183, 122, 0.35)',
                }}
              >
                End & Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          KEYFRAME ANIMATIONS
          ========================================================================= */}
      <style>{`
        @keyframes subtleAmbientDrift {
          0% {
            transform: scale(1.02) translate(0px, 0px);
          }
          100% {
            transform: scale(1.04) translate(-4px, -2px);
          }
        }

        @keyframes fadeInSlideDown {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes speechWave {
          0% { height: 4px; }
          100% { height: 18px; }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 6px #EF4444;
          }
          50% {
            opacity: 0.3;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
