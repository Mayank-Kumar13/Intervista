import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Circle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Filter,
  Check,
  BookOpen,
  Zap,
  TrendingUp,
  LayoutGrid,
  ListFilter,
  Layers,
  Award,
} from 'lucide-react';
import {
  TOPIC_METADATA,
  DSA_TOPICS,
  LEETCODE_DSA_QUESTIONS,
} from '../data/dsaQuestions';

const STORAGE_KEY = 'intervista_dsa_solved_v1';

// Custom SVG Icons matching user's reference screenshot
function TopicIcon({ type }) {
  const iconColor = '#38BDF8';

  switch (type) {
    case 'arrays':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
          <rect x="8" y="8" width="8" height="8" rx="1.5" />
        </svg>
      );
    case 'strings':
      return (
        <span style={{ fontSize: '1.15rem', fontWeight: 700, color: iconColor, letterSpacing: '-0.5px', lineHeight: 1 }}>
          Aa
        </span>
      );
    case 'linked-list':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      );
    case 'stack-queue':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="6" height="16" rx="2" />
          <rect x="14" y="4" width="6" height="16" rx="2" />
        </svg>
      );
    case 'trees':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 12l10 10 10-10L12 2z" />
        </svg>
      );
    case 'graphs':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    case 'dynamic-programming':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case 'recursion-backtracking':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" />
        </svg>
      );
    case 'two-pointers':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18" />
        </svg>
      );
    case 'sliding-window':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="7" width="18" height="10" rx="2" />
          <rect x="8" y="5" width="6" height="14" rx="1.5" fill={iconColor} fillOpacity="0.28" />
        </svg>
      );
    case 'binary-search':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="9" x2="20" y2="9" />
          <line x1="4" y1="15" x2="20" y2="15" />
          <line x1="10" y1="3" x2="8" y2="21" />
          <line x1="16" y1="3" x2="14" y2="21" />
        </svg>
      );
    case 'heap-priority-queue':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="2.5" fill={iconColor} />
        </svg>
      );
    case 'greedy-intervals':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );
    case 'bit-manipulation':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h6v6H9z" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
        </svg>
      );
    default:
      return <Layers size={22} color={iconColor} />;
  }
}

export default function CareerPrepDSAPage({ onStartInterview, onBackToOverview }) {
  // Navigation / views: 'grid' (Topic Cards matching screenshot) | 'drill' (Specific Topic Questions) | 'list' (All Questions)
  const [viewMode, setViewMode] = useState('grid');
  const [activeTopic, setActiveTopic] = useState(null); // when in drill down
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Solved' | 'Unsolved'
  const [solvedMap, setSolvedMap] = useState({});

  // Load solved progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSolvedMap(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load DSA progress:', e);
    }
  }, []);

  // Toggle solved status
  const toggleSolved = (id) => {
    setSolvedMap((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        // silent
      }
      return updated;
    });
  };

  // Total Solved Count
  const totalSolvedCount = useMemo(() => {
    return Object.values(solvedMap).filter(Boolean).length;
  }, [solvedMap]);

  // Solved Count by Topic
  const solvedCountByTopic = useMemo(() => {
    const counts = {};
    LEETCODE_DSA_QUESTIONS.forEach((q) => {
      if (solvedMap[q.id]) {
        counts[q.topic] = (counts[q.topic] || 0) + 1;
      }
    });
    return counts;
  }, [solvedMap]);

  // Questions in active topic
  const activeTopicQuestions = useMemo(() => {
    if (!activeTopic) return [];
    return LEETCODE_DSA_QUESTIONS.filter((q) => q.topic === activeTopic.title);
  }, [activeTopic]);

  // Filtered drill-down questions
  const filteredDrillQuestions = useMemo(() => {
    return activeTopicQuestions.filter((q) => {
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
      const isSolved = !!solvedMap[q.id];
      if (statusFilter === 'Solved' && !isSolved) return false;
      if (statusFilter === 'Unsolved' && isSolved) return false;

      if (globalSearch.trim()) {
        const query = globalSearch.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesPattern = (q.pattern || '').toLowerCase().includes(query);
        const matchesCompany = (q.companies || []).some((c) => c.toLowerCase().includes(query));
        const matchesNum = q.number.toString().includes(query);
        return matchesTitle || matchesPattern || matchesCompany || matchesNum;
      }
      return true;
    });
  }, [activeTopicQuestions, selectedDifficulty, statusFilter, globalSearch, solvedMap]);

  // Global filtered questions (for 'list' view or global search results)
  const allFilteredQuestions = useMemo(() => {
    return LEETCODE_DSA_QUESTIONS.filter((q) => {
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
      const isSolved = !!solvedMap[q.id];
      if (statusFilter === 'Solved' && !isSolved) return false;
      if (statusFilter === 'Unsolved' && isSolved) return false;

      if (globalSearch.trim()) {
        const query = globalSearch.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesTopic = q.topic.toLowerCase().includes(query);
        const matchesPattern = (q.pattern || '').toLowerCase().includes(query);
        const matchesCompany = (q.companies || []).some((c) => c.toLowerCase().includes(query));
        const matchesNum = q.number.toString().includes(query);
        return matchesTitle || matchesTopic || matchesPattern || matchesCompany || matchesNum;
      }
      return true;
    });
  }, [selectedDifficulty, statusFilter, globalSearch, solvedMap]);

  // Filtered topics based on search
  const filteredTopicCards = useMemo(() => {
    if (!globalSearch.trim()) return TOPIC_METADATA;
    const query = globalSearch.toLowerCase();
    return TOPIC_METADATA.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
    );
  }, [globalSearch]);

  const handleOpenTopic = (topic) => {
    setActiveTopic(topic);
    setViewMode('drill');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGrid = () => {
    setActiveTopic(null);
    setViewMode('grid');
    setSelectedDifficulty('All');
    setStatusFilter('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDifficultyBadgeStyle = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          color: '#10B981',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        };
      case 'Medium':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          color: '#F59E0B',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        };
      case 'Hard':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          color: '#EF4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        };
      default:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          color: 'var(--text-secondary)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        };
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        padding: '0.5rem 0.25rem 3rem',
        minHeight: '100%',
        color: 'var(--text-primary)',
      }}
    >
      {/* ─── Top Control & Header Bar ───────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38BDF8',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                <Sparkles size={12} />
                LeetCode Curated Patterns
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                • Blind 75 & NeetCode 150
              </span>
            </div>
            <h1
              style={{
                fontSize: '1.85rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Career Prep
            </h1>
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                marginTop: '0.35rem',
                maxWidth: '680px',
                lineHeight: 1.5,
              }}
            >
              Master topic-wise Data Structures & Algorithms patterns asked in FAANG and top tech interviews.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '0.75rem 1.25rem',
              borderRadius: '14px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Solved
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38BDF8' }}>
                {totalSolvedCount} <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/ {LEETCODE_DSA_QUESTIONS.length}</span>
              </div>
            </div>
            <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Topics
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {TOPIC_METADATA.length}
              </div>
            </div>
          </div>
        </div>

        {/* Global Search and View Switcher Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            background: '#0a0f1d',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            padding: '0.65rem 0.85rem',
            borderRadius: '14px',
          }}
        >
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '0.5rem 0.9rem',
              flex: '1',
              minWidth: '240px',
              maxWidth: '520px',
            }}
          >
            <Search size={16} color="var(--text-tertiary)" />
            <input
              type="text"
              placeholder={
                viewMode === 'drill'
                  ? `Search inside ${activeTopic?.title || 'this topic'}...`
                  : 'Search DSA questions, topics, or patterns (e.g. Two Sum, Sliding Window)...'
              }
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                width: '100%',
              }}
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* View Mode Toggle Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {viewMode === 'drill' && (
              <button
                onClick={handleBackToGrid}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.95rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#38BDF8',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowLeft size={15} />
                Back to Topics
              </button>
            )}

            <button
              onClick={() => {
                setViewMode('grid');
                setActiveTopic(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '9px',
                backgroundColor: viewMode === 'grid' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: viewMode === 'grid' ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid transparent',
                color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '0.84rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <LayoutGrid size={15} />
              Topic Cards
            </button>

            <button
              onClick={() => {
                setViewMode('list');
                setActiveTopic(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '9px',
                backgroundColor: viewMode === 'list' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: viewMode === 'list' ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid transparent',
                color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '0.84rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <ListFilter size={15} />
              All Questions ({LEETCODE_DSA_QUESTIONS.length})
            </button>
          </div>
        </div>
      </div>

      {/* ─── VIEW 1: TOPIC CARDS GRID (Exact match to reference screenshot) ───────── */}
      {viewMode === 'grid' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredTopicCards.map((topic) => {
            const topicSolved = solvedCountByTopic[topic.title] || 0;
            const curatedTotal = LEETCODE_DSA_QUESTIONS.filter((q) => q.topic === topic.title).length;

            return (
              <div
                key={topic.id}
                onClick={() => handleOpenTopic(topic)}
                style={{
                  backgroundColor: '#0c1220',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.6rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.45)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 28px -8px rgba(0, 0, 0, 0.7), 0 0 16px rgba(56, 189, 248, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Top Section: Icon & Content */}
                <div>
                  {/* Rounded square icon badge */}
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '11px',
                      backgroundColor: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <TopicIcon type={topic.iconType} />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '1.22rem',
                      fontWeight: 700,
                      color: '#F8FAFC',
                      margin: '0 0 0.5rem 0',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {topic.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: '#94A3B8',
                      lineHeight: 1.5,
                      margin: '0 0 1.75rem 0',
                      minHeight: '44px',
                    }}
                  >
                    {topic.description}
                  </p>
                </div>

                {/* Bottom Row: Problem Count on Left, Practice → on Right */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <span
                    style={{
                      color: '#38BDF8',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {topic.problemCount}
                  </span>

                  <span
                    style={{
                      color: '#F1F5F9',
                      fontWeight: 500,
                      fontSize: '0.92rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'color 0.18s ease, transform 0.18s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#38BDF8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#F1F5F9';
                    }}
                  >
                    Practice →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── VIEW 2: TOPIC DRILL-DOWN (Questions in Selected Topic) ─── */}
      {viewMode === 'drill' && activeTopic && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active Topic Banner */}
          <div
            style={{
              backgroundColor: '#0c1220',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '16px',
              padding: '1.75rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem',
              background: 'linear-gradient(145deg, rgba(12, 18, 32, 0.95), rgba(15, 23, 42, 0.85))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '13px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TopicIcon type={activeTopic.iconType} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                    {activeTopic.title}
                  </h2>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: '#38BDF8',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                    }}
                  >
                    {activeTopic.problemCount}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#94A3B8', margin: '0.35rem 0 0 0', maxWidth: '640px' }}>
                  {activeTopic.description}
                </p>
              </div>
            </div>

            {/* AI Mock Drill Action Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {onStartInterview && (
                <button
                  onClick={() =>
                    onStartInterview({
                      company: 'Google',
                      role: 'Software Engineer',
                      domain: activeTopic.title,
                      type: 'Technical (DSA & Code)',
                    })
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.15rem',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #D9B77A 0%, #B89758 100%)',
                    border: 'none',
                    color: '#080C14',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(217, 183, 122, 0.3)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Sparkles size={15} />
                  AI Interview on {activeTopic.title}
                </button>
              )}
            </div>
          </div>

          {/* Sub-Filters: Difficulty & Status */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              backgroundColor: 'rgba(15, 23, 42, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '0.65rem 1rem',
              borderRadius: '12px',
            }}
          >
            {/* Difficulty Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginRight: '4px' }}>
                Difficulty:
              </span>
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '7px',
                    fontSize: '0.8rem',
                    fontWeight: selectedDifficulty === diff ? 600 : 500,
                    backgroundColor: selectedDifficulty === diff ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    border: selectedDifficulty === diff ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                    color: selectedDifficulty === diff ? '#38BDF8' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginRight: '4px' }}>
                Status:
              </span>
              {['All', 'Solved', 'Unsolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '7px',
                    fontSize: '0.8rem',
                    fontWeight: statusFilter === st ? 600 : 500,
                    backgroundColor: statusFilter === st ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    border: statusFilter === st ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                    color: statusFilter === st ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Question Rows List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filteredDrillQuestions.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  backgroundColor: '#0c1220',
                  border: '1px dashed rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  color: 'var(--text-secondary)',
                }}
              >
                No questions found matching your filters.
              </div>
            ) : (
              filteredDrillQuestions.map((q) => {
                const isSolved = !!solvedMap[q.id];
                const badgeStyle = getDifficultyBadgeStyle(q.difficulty);

                return (
                  <div
                    key={q.id}
                    style={{
                      backgroundColor: '#0c1220',
                      border: isSolved
                        ? '1px solid rgba(16, 185, 129, 0.25)'
                        : '1px solid rgba(255, 255, 255, 0.07)',
                      borderRadius: '12px',
                      padding: '0.9rem 1.15rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.85rem',
                      transition: 'all 0.18s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0f172a';
                      e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#0c1220';
                      e.currentTarget.style.borderColor = isSolved
                        ? '1px solid rgba(16, 185, 129, 0.25)'
                        : '1px solid rgba(255, 255, 255, 0.07)';
                    }}
                  >
                    {/* Left: Checkbox + Number + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: '1', minWidth: '260px' }}>
                      <button
                        onClick={() => toggleSolved(q.id)}
                        title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                        style={{
                          background: isSolved ? '#10B981' : 'transparent',
                          border: isSolved ? '1px solid #10B981' : '1.5px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '6px',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#fff',
                          flexShrink: 0,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isSolved && <Check size={13} strokeWidth={3} />}
                      </button>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                            #{q.number}
                          </span>
                          <span
                            style={{
                              fontSize: '0.98rem',
                              fontWeight: 600,
                              color: isSolved ? 'var(--text-secondary)' : '#F8FAFC',
                              textDecoration: isSolved ? 'line-through' : 'none',
                            }}
                          >
                            {q.title}
                          </span>
                        </div>
                        {q.pattern && (
                          <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
                            Pattern: <span style={{ color: 'var(--text-primary)' }}>{q.pattern}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Difficulty Badge + Companies + LeetCode Link */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {/* Difficulty Badge */}
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '3px 9px',
                          borderRadius: '6px',
                          ...badgeStyle,
                        }}
                      >
                        {q.difficulty}
                      </span>

                      {/* Company Badges */}
                      {q.companies && q.companies.slice(0, 2).map((comp) => (
                        <span
                          key={comp}
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--text-tertiary)',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                          }}
                        >
                          {comp}
                        </span>
                      ))}

                      {/* Direct LeetCode External Link */}
                      <a
                        href={q.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '0.4rem 0.75rem',
                          borderRadius: '7px',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#F8FAFC',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          textDecoration: 'none',
                          transition: 'all 0.18s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.15)';
                          e.currentTarget.style.borderColor = '#38BDF8';
                          e.currentTarget.style.color = '#38BDF8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.color = '#F8FAFC';
                        }}
                      >
                        <span>LeetCode</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─── VIEW 3: ALL QUESTIONS LIST ──────────────────────────────── */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Difficulty and Status Controls */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              backgroundColor: '#0c1220',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginRight: '4px' }}>
                Difficulty:
              </span>
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '7px',
                    fontSize: '0.8rem',
                    fontWeight: selectedDifficulty === diff ? 600 : 500,
                    backgroundColor: selectedDifficulty === diff ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    border: selectedDifficulty === diff ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                    color: selectedDifficulty === diff ? '#38BDF8' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginRight: '4px' }}>
                Status:
              </span>
              {['All', 'Solved', 'Unsolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '7px',
                    fontSize: '0.8rem',
                    fontWeight: statusFilter === st ? 600 : 500,
                    backgroundColor: statusFilter === st ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    border: statusFilter === st ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                    color: statusFilter === st ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table / List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {allFilteredQuestions.map((q) => {
              const isSolved = !!solvedMap[q.id];
              const badgeStyle = getDifficultyBadgeStyle(q.difficulty);

              return (
                <div
                  key={q.id}
                  style={{
                    backgroundColor: '#0c1220',
                    border: isSolved
                      ? '1px solid rgba(16, 185, 129, 0.25)'
                      : '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '12px',
                    padding: '0.9rem 1.15rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.85rem',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: '1', minWidth: '260px' }}>
                    <button
                      onClick={() => toggleSolved(q.id)}
                      style={{
                        background: isSolved ? '#10B981' : 'transparent',
                        border: isSolved ? '1px solid #10B981' : '1.5px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '6px',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#fff',
                        flexShrink: 0,
                      }}
                    >
                      {isSolved && <Check size={13} strokeWidth={3} />}
                    </button>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                          #{q.number}
                        </span>
                        <span
                          style={{
                            fontSize: '0.98rem',
                            fontWeight: 600,
                            color: isSolved ? 'var(--text-secondary)' : '#F8FAFC',
                            textDecoration: isSolved ? 'line-through' : 'none',
                          }}
                        >
                          {q.title}
                        </span>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: '#38BDF8',
                            backgroundColor: 'rgba(56, 189, 248, 0.1)',
                            border: '1px solid rgba(56, 189, 248, 0.25)',
                            padding: '2px 7px',
                            borderRadius: '4px',
                          }}
                        >
                          {q.topic}
                        </span>
                      </div>
                      {q.pattern && (
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
                          Pattern: <span style={{ color: 'var(--text-primary)' }}>{q.pattern}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '3px 9px',
                        borderRadius: '6px',
                        ...badgeStyle,
                      }}
                    >
                      {q.difficulty}
                    </span>

                    <a
                      href={q.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '0.4rem 0.75rem',
                        borderRadius: '7px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#F8FAFC',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        textDecoration: 'none',
                      }}
                    >
                      <span>LeetCode</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
