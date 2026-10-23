import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CompanyLogos from './components/CompanyLogos';
import CompaniesSection from './components/CompaniesSection';
import HowItWorks from './components/HowItWorks';
import RoleCards from './components/RoleCards';
import PricingSection from './components/PricingSection';
import PlansPage from './components/PlansPage';
import ProfilePage from './components/ProfilePage';
import ReviewsSection from './components/ReviewsSection';
import CtaBanner from './components/CtaBanner';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import LoadingScreen from './components/LoadingScreen';

// Modals & Flows
import SetupModal from './components/SetupModal';
import DeviceSetupModal from './components/DeviceSetupModal';
import ImmersiveInterviewRoom from './components/ImmersiveInterviewRoom';
import LiveDemoModal from './components/LiveDemoModal';
import SampleReportModal from './components/SampleReportModal';
import AuthModal from './components/AuthModal';
import LegalModal from './components/LegalModal';
import ContactModal from './components/ContactModal';
import { getCurrentUser, logoutUser } from './utils/auth';
import { apiLogout } from './utils/api';

export default function App() {
  // Current authenticated user session
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  // Page / View State ('home' | 'dashboard' | 'companies' | 'plans' | 'profile' | 'interview')
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#interview')) return 'interview';
      if (hash.startsWith('#companies')) return 'companies';
      if (hash === '#dashboard') return 'dashboard';
      if (hash === '#plans' || hash === '#pricing') return 'plans';
      if (hash === '#profile') return 'profile';
    }
    return 'home';
  });

  // Modal states
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [selectedRoleForSetup, setSelectedRoleForSetup] = useState('Software Engineer');

  // Device Setup (Hardware verification screen)
  const [deviceSetupOpen, setDeviceSetupOpen] = useState(false);
  const [interviewConfig, setInterviewConfig] = useState({
    role: 'Software Engineer',
    company: 'Google',
    level: 'Mid Level',
    interviewType: 'Technical Interview',
    duration: '30 min',
    interviewerPersona: 'chen',
  });

  const [liveDemoOpen, setLiveDemoOpen] = useState(false);
  const [demoConfig, setDemoConfig] = useState({
    role: 'Software Engineer',
    level: 'Mid Level',
  });

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTopic, setLegalTopic] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [targetCompany, setTargetCompany] = useState('google');

  // Synchronize URL hash with page state & handle browser back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#login') {
        setAuthModalMode('login');
        setAuthModalOpen(true);
      } else if (hash === '#signup') {
        setAuthModalMode('signup');
        setAuthModalOpen(true);
      } else if (hash.startsWith('#interview')) {
        setCurrentView('interview');
      } else if (hash.startsWith('#companies')) {
        setCurrentView('companies');
        const parts = hash.split('/');
        if (parts[1]) {
          setTargetCompany(parts[1]);
        }
      } else if (hash === '#dashboard') {
        setCurrentView('dashboard');
      } else if (hash === '#plans' || hash === '#pricing') {
        setCurrentView('plans');
      } else if (hash === '#profile') {
        setCurrentView('profile');
      } else {
        setCurrentView('home');
      }
    };

    // Check hash on initial mount
    if (window.location.hash === '#login') {
      setAuthModalMode('login');
      setAuthModalOpen(true);
    } else if (window.location.hash === '#signup') {
      setAuthModalMode('signup');
      setAuthModalOpen(true);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page, sectionId) => {
    setCurrentView(page);
    if (page === 'interview') {
      window.location.hash = '#interview';
    } else if (page === 'companies') {
      window.location.hash = '#companies';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'dashboard') {
      window.location.hash = '#dashboard';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'plans') {
      window.location.hash = '#plans';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'profile') {
      window.location.hash = '#profile';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (sectionId && sectionId !== 'hero') {
        window.location.hash = `#${sectionId}`;
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        window.location.hash = '#home';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleNavigateToDashboard = () => handleNavigate('dashboard');
  const handleNavigateToHome = () => handleNavigate('home');

  // Step 1: Start Interview triggers setup
  const handleStartInterview = (role = 'Software Engineer') => {
    setSelectedRoleForSetup(role === 'all' ? 'Software Engineer' : role);
    setSetupModalOpen(true);
  };

  // Step 1 -> Step 2: From configuration modal, proceed to Hardware & Device Setup
  const handleLaunchSession = (config) => {
    setSetupModalOpen(false);
    setInterviewConfig(prev => ({
      ...prev,
      ...config,
    }));
    setDeviceSetupOpen(true);
  };

  // Step 2 -> Step 3: From Device Setup, proceed directly into the Immersive AI Interview Room
  const handleEnterInterviewRoom = (sessionSettings) => {
    setDeviceSetupOpen(false);
    setInterviewConfig(sessionSettings);
    setCurrentView('interview');
    window.location.hash = '#interview';
  };

  // Exit from Interview Room back to Dashboard
  const handleExitInterviewRoom = () => {
    handleNavigate('dashboard');
  };

  // Interview ended -> Present Comprehensive Evaluation Report
  const handleFinishInterview = (evaluationResults) => {
    setCurrentView('dashboard');
    window.location.hash = '#dashboard';
    setReportData(evaluationResults);
    setReportModalOpen(true);
  };

  const handleOpenDemo = () => {
    // Open device setup directly with standard software engineering configuration
    setInterviewConfig({
      role: 'Software Engineer',
      company: 'Google',
      level: 'Mid Level',
      interviewType: 'Technical Interview',
      duration: '30 min',
      interviewerPersona: 'chen',
    });
    setDeviceSetupOpen(true);
  };

  const handleViewSampleReport = (customData = null) => {
    if (customData) {
      setReportData({
        ...customData,
        role: customData.role || 'Software Engineer',
        level: customData.level || 'Mid Level',
        overallScore: customData.overallScore ?? customData.score ?? 86,
        scores: customData.scores || {
          communication: customData.communication || 90,
          technicalDepth: customData.technicalDepth || 86,
          problemSolving: customData.problemSolving || 88,
          confidence: customData.confidence || 82,
        },
        strengths: customData.strengths || [],
        improvements: customData.improvements || [],
        questionFeedback: customData.questionFeedback || [],
        studyRoadmap: customData.studyRoadmap || [],
        knowledgeGaps: customData.knowledgeGaps || [],
        verbalDelivery: customData.verbalDelivery || null,
        visualObservations: customData.visualObservations || null,
      });
    } else {
      setReportData({
        role: 'Software Engineer',
        level: 'Mid Level',
        overallScore: 88,
        scores: {
          communication: 92,
          technicalDepth: 86,
          problemSolving: 89,
          confidence: 84,
        },
      });
    }
    setReportModalOpen(true);
  };

  const handleOpenLegal = (topic) => {
    setLegalTopic(topic);
    setLegalModalOpen(true);
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    handleNavigate('dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    apiLogout();
    setCurrentUser(null);
    handleNavigate('home');
  };

  return (
    <div className="intervista-app">
      {/* Cinematic Intro & Star Blink Loading Screen */}
      <LoadingScreen />

      {/* Global Navigation Bar rendered across standard views (hidden inside the Immersive Room for complete cinematic immersion) */}
      {currentView !== 'interview' && (
        <Navbar
          currentPage={currentView}
          currentView={currentView}
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onStartInterview={() => handleStartInterview()}
          onOpenLogin={() => handleOpenAuth('login')}
          onOpenSignup={() => handleOpenAuth('signup')}
          onOpenContact={() => setContactModalOpen(true)}
          onNavigateToDashboard={handleNavigateToDashboard}
          onNavigateToHome={handleNavigateToHome}
        />
      )}

      {/* 0. IMMERSIVE AI INTERVIEW ROOM (FIRST-PERSON VIEW) */}
      {currentView === 'interview' && (
        <ImmersiveInterviewRoom
          config={interviewConfig}
          onFinishInterview={handleFinishInterview}
          onExitRoom={handleExitInterviewRoom}
        />
      )}

      {/* 1. DASHBOARD VIEW */}
      {currentView === 'dashboard' && (
        <Dashboard
          onStartInterview={handleStartInterview}
          onLaunchSession={handleLaunchSession}
          onViewReport={handleViewSampleReport}
          onBackToHome={handleNavigateToHome}
          onNavigateToCompanies={() => handleNavigate('companies')}
        />
      )}

      {/* 2. DEDICATED COMPANIES VIEW */}
      {currentView === 'companies' && (
        <>
          <main style={{ minHeight: '80vh' }}>
            <CompaniesSection
              activeCompanyId={targetCompany}
              onCompanyChange={setTargetCompany}
              onStartInterview={handleStartInterview}
              onBackToHome={handleNavigateToHome}
            />
          </main>

          <Footer
            onOpenLegal={handleOpenLegal}
            onSelectRole={handleStartInterview}
            onNavigate={handleNavigate}
            onOpenContact={() => setContactModalOpen(true)}
          />
        </>
      )}

      {/* 3. HOME VIEW */}
      {currentView === 'home' && (
        <>
          <main>
            {/* Hero Section */}
            <Hero
              onStartInterview={handleStartInterview}
              onWatchDemo={handleOpenDemo}
              onNavigate={handleNavigate}
            />

            {/* Trusted Companies Strip */}
            <CompanyLogos
              onSelectCompany={(companyId) => {
                setTargetCompany(companyId);
                handleNavigate('companies');
              }}
            />

            {/* 4. How It Works (Informational Architectural Pipeline Flow) */}
            <HowItWorks />

            {/* 5. Practice for Your Next Role */}
            <RoleCards onSelectRole={handleStartInterview} />

            {/* 6. Student Feedback & Infinite Review Loop */}
            <ReviewsSection />

            {/* 7. Final CTA Banner */}
            <CtaBanner onStartInterview={handleStartInterview} />
          </main>

          <Footer
            onOpenLegal={handleOpenLegal}
            onSelectRole={handleStartInterview}
            onNavigate={handleNavigate}
            onOpenContact={() => setContactModalOpen(true)}
          />
        </>
      )}

      {/* 4. DEDICATED PLANS & PRICING VIEW */}
      {currentView === 'plans' && (
        <>
          <main style={{ minHeight: '80vh', paddingTop: 'var(--nav-height)' }}>
            <PlansPage
              onStartInterview={handleStartInterview}
              onBackToHome={handleNavigateToHome}
            />
          </main>

          <Footer
            onOpenLegal={handleOpenLegal}
            onSelectRole={handleStartInterview}
            onNavigate={handleNavigate}
            onOpenContact={() => setContactModalOpen(true)}
          />
        </>
      )}

      {/* 5. DEDICATED PROFILE VIEW */}
      {currentView === 'profile' && (
        <>
          <ProfilePage
            currentUser={currentUser}
            onStartInterview={handleStartInterview}
            onNavigate={handleNavigate}
            onViewReport={handleViewSampleReport}
            onLogout={handleLogout}
          />

          <Footer
            onOpenLegal={handleOpenLegal}
            onSelectRole={handleStartInterview}
            onNavigate={handleNavigate}
            onOpenContact={() => setContactModalOpen(true)}
          />
        </>
      )}

      {/* Step 1: Configuration Modal */}
      <SetupModal
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        initialRole={selectedRoleForSetup}
        onStartSession={handleLaunchSession}
      />

      {/* Step 2: Device & Hardware Permission Setup Modal */}
      <DeviceSetupModal
        isOpen={deviceSetupOpen}
        onClose={() => setDeviceSetupOpen(false)}
        config={interviewConfig}
        onEnterRoom={handleEnterInterviewRoom}
      />

      {/* Step 4: Official Performance Report Modal */}
      <SampleReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reportData={reportData}
        onRetake={() => handleStartInterview(reportData?.role || 'Software Engineer')}
      />

      {/* Additional Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
      />

      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        topic={legalTopic}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
}
