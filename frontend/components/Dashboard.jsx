import React, { useState, useMemo } from 'react';
import {
  Home,
  Mic,
  BarChart2,
  Calendar,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight,
  Sparkles,
  Bell,
  FileText,
  Code2,
  Lightbulb,
  MessageSquare,
  ArrowLeft,
  Menu,
  X,
  CheckCircle2
} from 'lucide-react';

// Preset active practice days for 2026 (matching the ~18 practice days in screenshot)
const PRACTICE_DAYS_2026 = {
  '2026-02-10': { count: 1, level: 2 },
  '2026-03-03': { count: 2, level: 3 },
  '2026-03-24': { count: 1, level: 1 },
  '2026-04-14': { count: 1, level: 2 },
  '2026-05-05': { count: 2, level: 3 },
  '2026-05-19': { count: 1, level: 2 },
  '2026-06-02': { count: 1, level: 1 },
  '2026-06-16': { count: 2, level: 3 },
  '2026-07-07': { count: 1, level: 2 },
  '2026-07-21': { count: 2, level: 3 },
  '2026-08-11': { count: 1, level: 1 },
  '2026-08-25': { count: 2, level: 2 },
  '2026-09-08': { count: 2, level: 3 },
  '2026-09-22': { count: 1, level: 2 },
  '2026-10-04': { count: 1, level: 2 },
  '2026-10-08': { count: 2, level: 3 },
  '2026-10-12': { count: 1, level: 2 },
  '2026-10-16': { count: 3, level: 4 },
  '2026-11-03': { count: 1, level: 2 },
  '2026-11-10': { count: 2, level: 3 },
  '2026-11-17': { count: 1, level: 2 },
};

// Recent interviews data matching screenshot
const RECENT_INTERVIEWS = [
  {
    id: 'int-1',
    company: 'Google',
    role: 'Software Engineer',
    score: 86,
    date: '16 Oct 2026',
    scoreColor: '#10B981',
    logoType: 'google',
    details: {
      scores: { communication: 90, technicalDepth: 88, problemSolving: 89, confidence: 82 },
      strengths: ['Strong algorithmic optimization with EXPLAIN ANALYZE', 'System design trade-off explanation'],
      improvements: ['State Big-O time and space complexity upfront']
    }
  },
  {
    id: 'int-2',
    company: 'Microsoft',
    role: 'Frontend Developer',
    score: 78,
    date: '12 Oct 2026',
    scoreColor: '#10B981',
    logoType: 'microsoft',
    details: {
      scores: { communication: 82, technicalDepth: 76, problemSolving: 80, confidence: 75 },
      strengths: ['Clean React component composition', 'State management reasoning'],
      improvements: ['Elaborate more on browser rendering pipelines & LCP/FID metrics']
    }
  },
  {
    id: 'int-3',
    company: 'Amazon',
    role: 'Behavioral Interview',
    score: 72,
    date: '08 Oct 2026',
    scoreColor: '#E2C99A',
    logoType: 'amazon',
    details: {
      scores: { communication: 75, technicalDepth: 70, problemSolving: 74, confidence: 68 },
      strengths: ['STAR framework adherence', 'Customer Obsession examples'],
      improvements: ['Quantify business metric outcomes more precisely']
    }
  },
  {
    id: 'int-4',
    company: 'Tesla',
    role: 'Product Manager',
    score: 65,
    date: '04 Oct 2026',
    scoreColor: '#D4A373',
    logoType: 'tesla',
    details: {
      scores: { communication: 70, technicalDepth: 62, problemSolving: 66, confidence: 64 },
      strengths: ['Autonomous feature prioritization vision'],
      improvements: ['Deepen hardware-software dependency risk management']
    }
  },
];

// Topics to work on matching screenshot
const TOPICS_TO_WORK_ON = [
  {
    id: 'tech-depth',
    title: 'Technical depth',
    percentage: 62,
    description: 'Focus on system design and in-depth concepts.',
    icon: Code2
  },
  {
    id: 'prob-solving',
    title: 'Problem solving',
    percentage: 71,
    description: 'Practice structured problem solving approaches.',
    icon: Lightbulb
  },
  {
    id: 'communication',
    title: 'Communication',
    percentage: 78,
    description: 'Work on clarity, confidence and structured answers.',
    icon: MessageSquare
  }
];

export default function Dashboard({
  onStartInterview,
  onViewReport,
  onBackToHome
}) {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Overview');
  const [hoveredCell, setHoveredCell] = useState(null);

  // Generate 53 weeks x 7 days for the selected year
  const heatmapData = useMemo(() => {
    const weeks = [];
    // Start from the first Monday of the year or last week of previous year
    const startDate = new Date(selectedYear, 0, 1);
    // Align to Monday (0 = Sun, 1 = Mon ... 6 = Sat)
    const dayOfWeek = startDate.getDay();
    const diff = (dayOfWeek + 6) % 7; // days since last Monday
    startDate.setDate(startDate.getDate() - diff);

    for (let w = 0; w < 53; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (w * 7 + d));
        const dateKey = currentDate.toISOString().split('T')[0];
        const isCurrentYear = currentDate.getFullYear() === selectedYear;
        const practiceData = selectedYear === 2026 ? PRACTICE_DAYS_2026[dateKey] : null;

        days.push({
          date: dateKey,
          displayDate: currentDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          isCurrentYear,
          level: practiceData ? practiceData.level : 0,
          count: practiceData ? practiceData.count : 0
        });
      }
      weeks.push(days);
    }
    return weeks;
  }, [selectedYear]);

  // Months label positions (approximately placed across 53 weeks)
  const monthLabels = [
    { name: 'Jan', col: 0 },
    { name: 'Feb', col: 4 },
    { name: 'Mar', col: 8 },
    { name: 'Apr', col: 13 },
    { name: 'May', col: 17 },
    { name: 'Jun', col: 22 },
    { name: 'Jul', col: 26 },
    { name: 'Aug', col: 31 },
    { name: 'Sep', col: 35 },
    { name: 'Oct', col: 40 },
    { name: 'Nov', col: 44 },
    { name: 'Dec', col: 48 }
  ];

  // Helper for heatmap cell color
  const getCellColor = (level) => {
    switch (level) {
      case 1:
        return '#064e3b'; // dark emerald
      case 2:
        return '#047857'; // medium emerald
      case 3:
        return '#10B981'; // bright green
      case 4:
        return '#34D399'; // vibrant light emerald
      default:
        return '#1c1c1c'; // inactive dark gray
    }
  };

  // Helper for company logos in recent interviews
  const renderCompanyLogo = (type) => {
    switch (type) {
      case 'google':
        return (
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.9z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
            </svg>
          </div>
        );
      case 'microsoft':
        return (
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
              <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
          </div>
        );
      case 'amazon':
        return (
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#F6F0E7', position: 'relative', top: '-1px' }}>
              a<span style={{ color: '#FF9900', fontSize: '1.1rem' }}>›</span>
            </span>
          </div>
        );
      case 'tesla':
        return (
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 900, fontSize: '1.05rem', color: '#E82127', fontFamily: 'sans-serif' }}>
              T
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const navItems = [
    { label: 'Overview', icon: Home, id: 'overview' },
    { label: 'Mock Room', icon: Mic, id: 'mock-room', action: () => onStartInterview && onStartInterview('Software Engineer') },
    { label: 'Analytics & Skills', icon: BarChart2, id: 'analytics', action: () => onViewReport && onViewReport({ role: 'Software Engineer', overallScore: 88 }) },
    { label: 'Schedule & Feed', icon: Calendar, id: 'schedule' },
    { label: 'Career Prep', icon: Briefcase, id: 'career-prep' },
    { label: 'Settings', icon: Settings, id: 'settings' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#080808',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        position: 'relative',
      }}
      className="dashboard-root"
    >
      {/* =========================================================================
          LEFT SIDEBAR (Fixed/Sticky matching screenshot)
          ========================================================================= */}
      <aside
        style={{
          width: sidebarCollapsed ? '76px' : '260px',
          backgroundColor: '#0c0c0c',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
          padding: '1.5rem 1rem',
          flexShrink: 0,
        }}
        className="dashboard-sidebar"
      >
        {/* Top: Logo & Collapse Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
            marginBottom: '2.5rem',
            padding: '0 0.25rem',
          }}
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onBackToHome) onBackToHome();
            }}
            title="Back to Homepage"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
              color: 'var(--text-primary)',
            }}
          >
            {/* 4-point gold star */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              style={{ filter: 'drop-shadow(0 0 6px rgba(217, 183, 122, 0.6))', flexShrink: 0 }}
            >
              <path
                d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z"
                fill="var(--accent-gold)"
              />
            </svg>
            {!sidebarCollapsed && (
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                Intervista AI
              </span>
            )}
          </a>

          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              title="Collapse sidebar"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              title="Expand sidebar"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.label;

            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveNav(item.label);
                  if (item.action) item.action();
                }}
                title={sidebarCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: sidebarCollapsed ? '0.75rem 0' : '0.75rem 1rem',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: '12px',
                  backgroundColor: isActive ? 'rgba(217, 183, 122, 0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(217, 183, 122, 0.28)' : '1px solid transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'rgba(217, 183, 122, 0.15)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? 'var(--accent-gold)' : 'inherit',
                  }}
                >
                  <Icon size={18} />
                </div>
                {!sidebarCollapsed && (
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--text-primary)' : 'inherit',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Back to Homepage Button at bottom of sidebar */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <button
            onClick={onBackToHome}
            title="Back to Homepage"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: sidebarCollapsed ? '0.7rem 0' : '0.7rem 0.9rem',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              width: '100%',
              fontSize: '0.82rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent-gold)';
              e.currentTarget.style.borderColor = 'rgba(217, 183, 122, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-tertiary)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
            }}
          >
            <ArrowLeft size={16} />
            {!sidebarCollapsed && <span>Back to Website</span>}
          </button>
        </div>
      </aside>

      {/* =========================================================================
          MAIN CONTENT AREA
          ========================================================================= */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile Header Bar */}
        <header
          className="mobile-header"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            backgroundColor: '#0c0c0c',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z" fill="var(--accent-gold)"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem' }}>Intervista AI</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: '#111111',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setActiveNav(item.label);
                  setMobileMenuOpen(false);
                  if (item.action) item.action();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeNav === item.label ? 'var(--accent-gold)' : 'var(--text-primary)',
                  textAlign: 'left',
                  fontSize: '0.95rem',
                  padding: '0.4rem 0',
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={onBackToHome}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                textAlign: 'left',
                fontSize: '0.9rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
              }}
            >
              ← Back to Website
            </button>
          </div>
        )}

        <main style={{ padding: '2.5rem 3rem', maxWidth: '1360px', width: '100%', margin: '0 auto' }} className="dashboard-main-content">
          {/* =========================================================================
              B. WELCOME HEADER & MOTIVATIONAL CARD
              ========================================================================= */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '2rem',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
            }}
            className="welcome-header-row"
          >
            {/* Left: Greeting, status & Start New Interview CTA */}
            <div style={{ maxWidth: '620px' }}>
              <h1
                className="serif-heading"
                style={{
                  fontSize: 'clamp(2.2rem, 3.8vw, 3rem)',
                  lineHeight: 1.15,
                  marginBottom: '0.75rem',
                  letterSpacing: '-0.02em',
                }}
              >
                Welcome Back, <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>Mayankkk</span>
              </h1>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.96rem',
                  lineHeight: 1.55,
                  marginBottom: '1.6rem',
                }}
              >
                You have completed 1 mock interview session. Keep pushing to improve your score!
              </p>

              {/* + Start New Interview Button */}
              <button
                onClick={() => onStartInterview && onStartInterview('Software Engineer')}
                className="btn-primary"
                style={{
                  padding: '0.75rem 1.6rem',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  backgroundColor: 'var(--text-primary)',
                  color: '#080808',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 18px rgba(246, 240, 231, 0.15)',
                }}
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Start New Interview</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Right: Notification Icon, Avatar & Motivational Card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '1.25rem',
              }}
              className="welcome-header-right"
            >
              {/* Upper-right controls: Bell with red dot + Avatar 'M' */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Notification Bell */}
                <div
                  style={{
                    position: 'relative',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#141414',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                  title="Notifications"
                >
                  <Bell size={17} />
                  {/* Red notification dot */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '7px',
                      right: '8px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#EF4444',
                      boxShadow: '0 0 6px rgba(239, 68, 68, 0.8)',
                    }}
                  />
                </div>

                {/* Avatar 'M' */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#161616',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                  }}
                  title="User Profile (Mayank)"
                >
                  M
                </div>
              </div>

              {/* Motivational Card */}
              <div
                style={{
                  backgroundColor: '#131313',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.1rem 1.4rem',
                  maxWidth: '320px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 10px 24px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(217, 183, 122, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)',
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={16} />
                </div>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    lineHeight: 1.45,
                    margin: 0,
                  }}
                >
                  Consistent practice today, bigger opportunities tomorrow.
                </p>
              </div>
            </div>
          </div>

          {/* =========================================================================
              C. YEARLY PRACTICE ACTIVITY HEATMAP
              ========================================================================= */}
          <section
            style={{
              backgroundColor: '#111111',
              border: '1px solid var(--border-card)',
              borderRadius: '20px',
              padding: '2rem 2.25rem',
              marginBottom: '2rem',
              position: 'relative',
            }}
            className="heatmap-card"
          >
            {/* Header: Title, Calendar Icon & Year Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.8rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Calendar size={18} />
                </div>

                <div>
                  <h2
                    className="serif-heading"
                    style={{
                      fontSize: '1.45rem',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      marginBottom: '2px',
                    }}
                  >
                    Your Practice Activity
                  </h2>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
                    18 practice days this year
                  </p>
                </div>
              </div>

              {/* Year Navigation Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#161616',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '3px 6px',
                  gap: '6px',
                }}
              >
                <button
                  onClick={() => setSelectedYear(prev => prev - 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Previous Year"
                >
                  <ChevronLeft size={16} />
                </button>

                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    padding: '0 6px',
                    fontFamily: 'monospace',
                  }}
                >
                  {selectedYear}
                </span>

                <button
                  onClick={() => setSelectedYear(prev => prev + 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Next Year"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Heatmap Grid Wrapper (horizontally scrollable if viewport is narrow) */}
            <div
              style={{
                overflowX: 'auto',
                paddingBottom: '0.5rem',
              }}
              className="heatmap-scroll-area"
            >
              <div style={{ minWidth: '780px' }}>
                {/* Month labels row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '36px repeat(53, 1fr)',
                    gap: '4px',
                    marginBottom: '8px',
                    fontSize: '0.72rem',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  <div /> {/* empty corner for day labels */}
                  {Array.from({ length: 53 }).map((_, colIdx) => {
                    const monthObj = monthLabels.find(m => m.col === colIdx);
                    return (
                      <div key={colIdx} style={{ textAlign: 'left' }}>
                        {monthObj ? monthObj.name : ''}
                      </div>
                    );
                  })}
                </div>

                {/* Day labels + 7 rows of cells */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '36px 1fr',
                    gap: '8px',
                    alignItems: 'center',
                  }}
                >
                  {/* Left day labels (Mon, Wed, Fri) */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '110px',
                      fontSize: '0.72rem',
                      color: 'var(--text-tertiary)',
                      padding: '2px 0',
                    }}
                  >
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                  </div>

                  {/* 53 Columns x 7 Rows Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(53, 1fr)',
                      gap: '4px',
                    }}
                  >
                    {heatmapData.map((week, wIdx) => (
                      <div
                        key={wIdx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        {week.map((day, dIdx) => (
                          <div
                            key={dIdx}
                            onMouseEnter={() => setHoveredCell(day)}
                            onMouseLeave={() => setHoveredCell(null)}
                            style={{
                              width: '100%',
                              paddingTop: '100%', // 1:1 aspect ratio square
                              position: 'relative',
                              borderRadius: '3px',
                              backgroundColor: getCellColor(day.level),
                              border: hoveredCell?.date === day.date
                                ? '1px solid #FFFFFF'
                                : '1px solid rgba(255, 255, 255, 0.03)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              transform: hoveredCell?.date === day.date ? 'scale(1.3)' : 'none',
                              zIndex: hoveredCell?.date === day.date ? 10 : 1,
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Heatmap Tooltip & Legend Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)',
              }}
            >
              {/* Tooltip info on hover */}
              <div>
                {hoveredCell ? (
                  <span>
                    <strong style={{ color: 'var(--text-primary)' }}>{hoveredCell.displayDate}</strong>: {hoveredCell.count > 0 ? `${hoveredCell.count} mock interview practice sessions` : 'No practice sessions'}
                  </span>
                ) : (
                  <span>Hover over any cell to see practice session records</span>
                )}
              </div>

              {/* Less -> More intensity legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((lvl) => (
                  <div
                    key={lvl}
                    style={{
                      width: '11px',
                      height: '11px',
                      borderRadius: '2px',
                      backgroundColor: getCellColor(lvl),
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                    }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </section>

          {/* =========================================================================
              LOWER 2-COLUMN SECTION: RECENT INTERVIEWS & TOPICS TO WORK ON
              ========================================================= */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.35fr 1fr',
              gap: '2rem',
              alignItems: 'stretch',
            }}
            className="dashboard-lower-grid"
          >
            {/* =====================================================================
                D. RECENT INTERVIEWS (LEFT COLUMN)
                ===================================================================== */}
            <section
              style={{
                backgroundColor: '#111111',
                border: '1px solid var(--border-card)',
                borderRadius: '20px',
                padding: '1.8rem 2rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Section Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <FileText size={17} />
                  </div>
                  <h3
                    className="serif-heading"
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    Recent Interviews
                  </h3>
                </div>

                <button
                  onClick={() => onViewReport && onViewReport({ role: 'Software Engineer', overallScore: 86 })}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-gold)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <span>View all</span>
                  <span>→</span>
                </button>
              </div>

              {/* Table Column Headers */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.8fr 75px 105px 115px',
                  gap: '1rem',
                  padding: '0 0.5rem 0.75rem 0.5rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  color: 'var(--text-tertiary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
                className="interviews-table-header"
              >
                <div>Company & Role</div>
                <div style={{ textAlign: 'center' }}>Score</div>
                <div>Date</div>
                <div style={{ textAlign: 'right' }}>Report / Actions</div>
              </div>

              {/* Table Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.85rem' }}>
                {RECENT_INTERVIEWS.map((interview) => (
                  <div
                    key={interview.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.8fr 75px 105px 115px',
                      gap: '1rem',
                      alignItems: 'center',
                      padding: '0.65rem 0.5rem',
                      borderRadius: '12px',
                      transition: 'background-color 0.2s ease',
                    }}
                    className="interview-row-item"
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#161616')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Company & Role */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      {renderCompanyLogo(interview.logoType)}
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {interview.company}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {interview.role}
                        </div>
                      </div>
                    </div>

                    {/* Circular Score Gauge */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ position: 'relative', width: '38px', height: '38px' }}>
                        <svg width="38" height="38" viewBox="0 0 38 38">
                          <circle cx="19" cy="19" r="15" fill="none" stroke="#222" strokeWidth="2.5" />
                          <circle
                            cx="19"
                            cy="19"
                            r="15"
                            fill="none"
                            stroke={interview.scoreColor}
                            strokeWidth="2.5"
                            strokeDasharray="94.2"
                            strokeDashoffset={94.2 - (94.2 * interview.score) / 100}
                            strokeLinecap="round"
                            transform="rotate(-90 19 19)"
                          />
                        </svg>
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                          }}
                        >
                          {interview.score}%
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {interview.date}
                    </div>

                    {/* View Report Button */}
                    <div style={{ textAlign: 'right' }}>
                      <button
                        onClick={() =>
                          onViewReport &&
                          onViewReport({
                            role: `${interview.company} - ${interview.role}`,
                            overallScore: interview.score,
                            scores: interview.details.scores,
                            strengths: interview.details.strengths,
                            improvements: interview.details.improvements
                          })
                        }
                        className="btn-secondary"
                        style={{
                          padding: '0.38rem 0.75rem',
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          borderRadius: '8px',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <FileText size={12} color="var(--accent-gold)" />
                        <span>View Report</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* =====================================================================
                E. TOPICS TO WORK ON (RIGHT COLUMN)
                ===================================================================== */}
            <section
              style={{
                backgroundColor: '#111111',
                border: '1px solid var(--border-card)',
                borderRadius: '20px',
                padding: '1.8rem 2rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Section Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <BarChart2 size={17} />
                </div>
                <h3
                  className="serif-heading"
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  Topics to Work On
                </h3>
              </div>

              {/* 3 Skill Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'space-between' }}>
                {TOPICS_TO_WORK_ON.map((topic) => {
                  const Icon = topic.icon;
                  return (
                    <div
                      key={topic.id}
                      style={{
                        backgroundColor: '#161616',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        borderRadius: '16px',
                        padding: '1.25rem 1.35rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem',
                      }}
                    >
                      {/* Top: Icon + Title + Percentage */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '10px',
                              backgroundColor: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--text-primary)',
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {topic.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {topic.description}
                            </div>
                          </div>
                        </div>

                        {/* Percentage */}
                        <div
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            fontFamily: 'monospace',
                            marginLeft: '0.5rem',
                          }}
                        >
                          {topic.percentage}%
                        </div>
                      </div>

                      {/* Slim Progress Bar */}
                      <div
                        style={{
                          height: '5px',
                          backgroundColor: '#222222',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${topic.percentage}%`,
                            background: 'linear-gradient(90deg, #E2C99A, #F5E7C8)',
                            borderRadius: '9999px',
                            boxShadow: '0 0 10px rgba(217, 183, 122, 0.3)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Responsive Breakpoints Style */}
      <style>{`
        @media (max-width: 1024px) {
          .dashboard-lower-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-main-content {
            padding: 2rem 1.5rem !important;
          }
        }
        @media (max-width: 868px) {
          .dashboard-sidebar {
            display: none !important;
          }
          .mobile-header {
            display: flex !important;
          }
          .welcome-header-right {
            align-items: flex-start !important;
            width: 100%;
          }
          .welcome-header-row {
            gap: 1.5rem !important;
          }
          .interviews-table-header {
            grid-template-columns: 1.5fr 60px 85px 95px !important;
          }
          .interview-row-item {
            grid-template-columns: 1.5fr 60px 85px 95px !important;
          }
        }
        @media (max-width: 580px) {
          .interviews-table-header {
            display: none !important;
          }
          .interview-row-item {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
            padding: 1rem !important;
            background-color: #141414 !important;
            margin-bottom: 0.5rem;
          }
          .dashboard-main-content {
            padding: 1.5rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
