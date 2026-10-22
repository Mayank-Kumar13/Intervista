import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CompanyLogos from './components/CompanyLogos';
import HowItWorks from './components/HowItWorks';
import RoleCards from './components/RoleCards';
import ReviewsSection from './components/ReviewsSection';
import CtaBanner from './components/CtaBanner';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';

// Modals
import SetupModal from './components/SetupModal';
import LiveDemoModal from './components/LiveDemoModal';
import SampleReportModal from './components/SampleReportModal';
import AuthModal from './components/AuthModal';
import LegalModal from './components/LegalModal';
import ContactModal from './components/ContactModal';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    return window.location.hash === '#dashboard' ? 'dashboard' : 'home';
  });
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [selectedRoleForSetup, setSelectedRoleForSetup] = useState('Software Engineer');

  const [liveDemoOpen, setLiveDemoOpen] = useState(false);
  const [demoConfig, setDemoConfig] = useState({
    role: 'Software Engineer',
    level: 'Mid Level',
  });

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTopic, setLegalTopic] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Sync with browser hash
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#dashboard') {
        setCurrentView('dashboard');
      } else if (window.location.hash === '#home' || window.location.hash === '') {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigateToDashboard = () => {
    window.location.hash = 'dashboard';
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToHome = () => {
    window.location.hash = 'home';
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers
  const handleStartInterview = (role = 'Software Engineer') => {
    setSelectedRoleForSetup(role === 'all' ? 'Software Engineer' : role);
    setSetupModalOpen(true);
  };

  const handleLaunchSession = (config) => {
    setSetupModalOpen(false);
    setDemoConfig(config);
    setLiveDemoOpen(true);
  };

  const handleFinishInterview = (evaluationResults) => {
    setLiveDemoOpen(false);
    setReportData(evaluationResults);
    setReportModalOpen(true);
  };

  const handleOpenDemo = () => {
    setDemoConfig({
      role: 'Software Engineer',
      level: 'Mid Level',
    });
    setLiveDemoOpen(true);
  };

  const handleViewSampleReport = (customData = null) => {
    if (customData) {
      setReportData({
        role: customData.role || 'Software Engineer',
        level: customData.level || 'Mid Level',
        overallScore: customData.overallScore || 86,
        scores: customData.scores || {
          communication: 90,
          technicalDepth: 86,
          problemSolving: 88,
          confidence: 82,
        },
        strengths: customData.strengths,
        improvements: customData.improvements,
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

  return (
    <div className="intervista-app">
      {currentView === 'dashboard' ? (
        /* =====================================================================
           DASHBOARD OVERVIEW PAGE (Matches Reference Screenshot)
           ===================================================================== */
        <Dashboard
          onStartInterview={handleStartInterview}
          onViewReport={handleViewSampleReport}
          onBackToHome={handleNavigateToHome}
        />
      ) : (
        /* =====================================================================
           HOMEPAGE (Warm Dark Luxury Aesthetic)
           ===================================================================== */
        <>
          {/* 1. Navigation Bar with HOME, DASHBOARD, COMPANIES, REVIEWS, CONTACT US */}
          <Navbar
            onStartInterview={() => handleStartInterview()}
            onOpenLogin={() => setAuthModalOpen(true)}
            onOpenContact={() => setContactModalOpen(true)}
            onNavigateToDashboard={handleNavigateToDashboard}
            onNavigateToHome={handleNavigateToHome}
          />

          <main>
            {/* 2. Hero Section (with live oval removed) */}
            <Hero
              onStartInterview={handleStartInterview}
              onWatchDemo={handleOpenDemo}
            />

            {/* 3. Trusted Companies Strip (with brand colors on hover) */}
            <CompanyLogos />

            {/* 4. How It Works (Informational 3-Step Flow) */}
            <HowItWorks />

            {/* 5. Practice for Your Next Role */}
            <RoleCards onSelectRole={handleStartInterview} />

            {/* 7. Student Feedback & Infinite Review Loop */}
            <ReviewsSection />

            {/* 9. Final CTA Banner */}
            <CtaBanner onStartInterview={handleStartInterview} />
          </main>

          {/* 10. Footer */}
          <Footer
            onOpenLegal={handleOpenLegal}
            onSelectRole={handleStartInterview}
          />
        </>
      )}

      {/* Interactive Flow Modals (Shared across Home & Dashboard) */}
      <SetupModal
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        initialRole={selectedRoleForSetup}
        onStartSession={handleLaunchSession}
      />

      <LiveDemoModal
        isOpen={liveDemoOpen}
        onClose={() => setLiveDemoOpen(false)}
        config={demoConfig}
        onFinishInterview={handleFinishInterview}
      />

      <SampleReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reportData={reportData}
        onRetake={() => handleStartInterview(reportData?.role || 'Software Engineer')}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
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
