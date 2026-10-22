import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CompanyLogos from './components/CompanyLogos';
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
        onStartInterview={() => handleStartInterview()}
        onOpenLogin={() => setAuthModalOpen(true)}
        onOpenContact={() => setContactModalOpen(true)}
      />

      <main>
        {/* 2. Hero Section (with live oval removed) */}
        <Hero
          onStartInterview={handleStartInterview}
          onWatchDemo={handleOpenDemo}
        />

        {/* 3. Trusted Companies Strip (with brand colors on hover) */}
        <CompanyLogos />

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

      {/* 10. Footer */}
      <Footer
        onOpenLegal={handleOpenLegal}
        onSelectRole={handleStartInterview}
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
