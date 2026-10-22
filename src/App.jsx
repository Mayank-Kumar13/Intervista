import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CompanyLogos from './components/CompanyLogos';
import CompaniesSection from './components/CompaniesSection';
import HowItWorks from './components/HowItWorks';
import InterviewShowcase from './components/InterviewShowcase';
import RoleCards from './components/RoleCards';
import PerformanceReport from './components/PerformanceReport';
import ReviewsSection from './components/ReviewsSection';
import CtaBanner from './components/CtaBanner';
import Footer from './components/Footer';

// Modals
import SetupModal from './components/SetupModal';
import LiveDemoModal from './components/LiveDemoModal';
import SampleReportModal from './components/SampleReportModal';
import AuthModal from './components/AuthModal';
import LegalModal from './components/LegalModal';
import ContactModal from './components/ContactModal';

export default function App() {
  // Page Routing State ('home' | 'companies')
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#companies')) {
      return 'companies';
    }
    return 'home';
  });

  // Modal states
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
  const [targetCompany, setTargetCompany] = useState('google');

  // Synchronize URL hash with page state & handle browser back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#companies')) {
        setCurrentPage('companies');
        const parts = hash.split('/');
        if (parts[1]) {
          setTargetCompany(parts[1]);
        }
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page, sectionId) => {
    setCurrentPage(page);
    if (page === 'companies') {
      window.location.hash = '#companies';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (sectionId && sectionId !== 'hero') {
        window.location.hash = `#${sectionId}`;
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        window.location.hash = '#';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
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

  const handleViewSampleReport = () => {
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
    setReportModalOpen(true);
  };

  const handleSelectStep = (action) => {
    if (action === 'role') handleStartInterview('Software Engineer');
    else if (action === 'demo') handleOpenDemo();
    else if (action === 'report') handleViewSampleReport();
  };

  const handleOpenLegal = (topic) => {
    setLegalTopic(topic);
    setLegalModalOpen(true);
  };

  return (
    <div className="intervista-app">
      {/* 1. Navigation Bar with HOME, DASHBOARD, COMPANIES, REVIEWS, CONTACT US */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onStartInterview={() => handleStartInterview()}
        onOpenLogin={() => setAuthModalOpen(true)}
        onOpenContact={() => setContactModalOpen(true)}
      />

      {currentPage === 'home' ? (
        <main>
          {/* 2. Hero Section */}
          <Hero
            onStartInterview={handleStartInterview}
            onWatchDemo={handleOpenDemo}
          />

          {/* 3. Trusted Companies Strip (click any company to open its preparation page) */}
          <CompanyLogos
            onSelectCompany={(companyId) => {
              setTargetCompany(companyId);
              handleNavigate('companies');
            }}
          />

          {/* 4. How It Works */}
          <HowItWorks onSelectStep={handleSelectStep} />

          {/* 5. Interview Experience Showcase (Dashboard) */}
          <InterviewShowcase onTryDemo={handleOpenDemo} />

          {/* 6. Practice for Your Next Role */}
          <RoleCards onSelectRole={handleStartInterview} />

          {/* 7. Performance Report Section */}
          <PerformanceReport onViewReport={handleViewSampleReport} />

          {/* 8. Student Feedback & Infinite Review Loop */}
          <ReviewsSection />

          {/* 9. Final CTA Banner */}
          <CtaBanner onStartInterview={handleStartInterview} />
        </main>
      ) : (
        <main style={{ minHeight: '80vh' }}>
          {/* Dedicated Companies Preparation Page */}
          <CompaniesSection
            activeCompanyId={targetCompany}
            onCompanyChange={setTargetCompany}
            onStartInterview={handleStartInterview}
            onBackToHome={() => handleNavigate('home')}
          />
        </main>
      )}

      {/* Footer */}
      <Footer
        onOpenLegal={handleOpenLegal}
        onSelectRole={handleStartInterview}
        onNavigate={handleNavigate}
      />

      {/* Interactive Flow Modals */}
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
