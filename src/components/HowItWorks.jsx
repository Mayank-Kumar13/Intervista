import React from 'react';
import { User, Mic, BarChart3, ArrowRight, ArrowDown, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      id: 'step-role',
      icon: User,
      title: 'Choose your role',
    },
    {
      id: 'step-interview',
      icon: Mic,
      title: 'Take the interview',
    },
    {
      id: 'step-feedback',
      icon: BarChart3,
      title: 'Get your feedback',
    },
  ];

  return (
    <section id="how-it-works" className="section-wrapper" style={{ padding: '6rem 0' }}>
      <div className="container" style={{ maxWidth: '1120px' }}>
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '4.5rem' }}>
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle">
            Get interview ready in three simple steps.
          </p>
        </div>

        {/* 3 Step Flowchart Cards Row */}
        <div className="flow-cards-container">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <React.Fragment key={step.id}>
                {/* Step Card */}
                <div className="flow-card">
                  {/* Top Glowing Node Circle (Halo effect, NO numbers as requested) */}
                  <div className="flow-top-node" aria-hidden="true">
                    <Sparkles size={14} className="node-sparkle" />
                  </div>

                  {/* Card Icon */}
                  <div className="flow-icon-wrap">
                    <Icon size={32} strokeWidth={1.6} />
                  </div>

                  {/* Card Title */}
                  <h3 className="flow-title">
                    {step.title}
                  </h3>
                </div>

                {/* Connecting Arrow between cards (with sequential flowing glow) */}
                {idx < steps.length - 1 && (
                  <div className={`flow-connector-wrap flow-arrow-${idx + 1}`} aria-hidden="true">
                    {/* Glowing conduit line */}
                    <div className="flow-line-track">
                      <div className={`flow-beam flow-beam-${idx + 1}`} />
                    </div>

                    {/* Circular Glowing Arrow Badge */}
                    <div className={`flow-arrow-circle flow-pulse-${idx + 1}`}>
                      <ArrowRight size={17} strokeWidth={2.2} className="desktop-arrow-icon" />
                      <ArrowDown size={17} strokeWidth={2.2} className="mobile-arrow-icon" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Scoped CSS for Clean Luxury Flowchart & Flowing Glow */}
      <style>{`
        .flow-cards-container {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          position: relative;
          gap: 1.25rem;
          padding: 2rem 0;
        }

        /* Clean, uncluttered dark card matching reference */
        .flow-card {
          flex: 1;
          min-width: 0;
          height: 200px;
          background-color: #101010;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          padding: 2.25rem 1.5rem 1.75rem 1.5rem;
          cursor: default;
          user-select: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }

        .flow-card:hover {
          border-color: rgba(226, 201, 154, 0.28);
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.65), 0 0 20px rgba(226, 201, 154, 0.06);
        }

        /* Top Glowing Circle (Matching reference halo, no numbers) */
        .flow-top-node {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: #111111;
          border: 1px solid rgba(226, 201, 154, 0.4);
          display: flex;
          align-items: center;
          justifyContent: center;
          box-shadow: 0 0 20px rgba(226, 201, 154, 0.4), inset 0 0 6px rgba(226, 201, 154, 0.2);
          animation: nodeHalo 3.6s ease-in-out infinite;
          z-index: 5;
        }

        .node-sparkle {
          color: var(--accent-gold);
          filter: drop-shadow(0 0 4px rgba(226, 201, 154, 0.8));
        }

        @keyframes nodeHalo {
          0%, 100% {
            box-shadow: 0 0 16px rgba(226, 201, 154, 0.35), inset 0 0 4px rgba(226, 201, 154, 0.2);
            border-color: rgba(226, 201, 154, 0.35);
          }
          50% {
            box-shadow: 0 0 26px rgba(226, 201, 154, 0.65), inset 0 0 8px rgba(226, 201, 154, 0.4);
            border-color: rgba(226, 201, 154, 0.7);
          }
        }

        /* Minimal Centered Icon */
        .flow-icon-wrap {
          display: flex;
          align-items: center;
          justifyContent: center;
          color: #FDFBF7;
          margin-bottom: 1.25rem;
          opacity: 0.9;
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .flow-card:hover .flow-icon-wrap {
          color: var(--accent-gold);
          transform: scale(1.06);
        }

        /* Clean Label */
        .flow-title {
          font-family: var(--font-sans);
          font-size: 1.15rem;
          font-weight: 500;
          color: var(--text-primary);
          margin: 0;
          text-align: center;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        /* =======================================================
           CONNECTING ARROWS & FLOWING GLOW ANIMATION
           ======================================================= */
        .flow-connector-wrap {
          display: flex;
          align-items: center;
          justifyContent: center;
          position: relative;
          width: 58px;
          flex-shrink: 0;
          z-index: 2;
        }

        .flow-line-track {
          position: absolute;
          left: -4px;
          right: -4px;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          overflow: hidden;
          z-index: 1;
        }

        /* Luminous beam traveling along the conduit */
        .flow-beam {
          position: absolute;
          top: 0;
          height: 100%;
          width: 24px;
          background: linear-gradient(90deg, transparent, rgba(226, 201, 154, 0.9), transparent);
          box-shadow: 0 0 8px rgba(226, 201, 154, 0.8);
        }

        .flow-beam-1 {
          animation: beamTravel1 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .flow-beam-2 {
          animation: beamTravel2 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes beamTravel1 {
          0% {
            left: -30%;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          45% {
            left: 110%;
            opacity: 0;
          }
          100% {
            left: 110%;
            opacity: 0;
          }
        }

        @keyframes beamTravel2 {
          0%, 45% {
            left: -30%;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          85% {
            left: 110%;
            opacity: 0;
          }
          100% {
            left: 110%;
            opacity: 0;
          }
        }

        /* Circular Arrow Badge with sequential glowing pulse */
        .flow-arrow-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: #0c0c0c;
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justifyContent: center;
          color: rgba(255, 255, 255, 0.4);
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }

        /* Flowing Glow: Arrow 1 lights up first, then Arrow 2 */
        .flow-pulse-1 {
          animation: glowFlow1 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .flow-pulse-2 {
          animation: glowFlow2 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes glowFlow1 {
          0%, 100% {
            box-shadow: 0 0 0px rgba(226, 201, 154, 0);
            border-color: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.4);
            transform: scale(1);
          }
          18%, 42% {
            box-shadow: 0 0 22px rgba(226, 201, 154, 0.8), 0 0 10px rgba(245, 231, 200, 0.9), inset 0 0 6px rgba(226, 201, 154, 0.4);
            border-color: rgba(226, 201, 154, 0.95);
            color: #FDFBF7;
            background-color: #14120e;
            transform: scale(1.12);
          }
        }

        @keyframes glowFlow2 {
          0%, 100% {
            box-shadow: 0 0 0px rgba(226, 201, 154, 0);
            border-color: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.4);
            transform: scale(1);
          }
          52%, 78% {
            box-shadow: 0 0 22px rgba(226, 201, 154, 0.8), 0 0 10px rgba(245, 231, 200, 0.9), inset 0 0 6px rgba(226, 201, 154, 0.4);
            border-color: rgba(226, 201, 154, 0.95);
            color: #FDFBF7;
            background-color: #14120e;
            transform: scale(1.12);
          }
        }

        .desktop-arrow-icon {
          display: block;
        }
        .mobile-arrow-icon {
          display: none;
        }

        /* Mobile / Tablet Responsive Behavior */
        @media (max-width: 868px) {
          .flow-cards-container {
            flex-direction: column;
            gap: 2rem;
            padding: 1.5rem 0;
          }
          .flow-card {
            width: 100%;
            height: 180px;
          }
          .flow-connector-wrap {
            width: auto;
            height: 48px;
            margin: -0.5rem 0;
          }
          .flow-line-track {
            left: 50%;
            top: 0;
            bottom: 0;
            width: 1px;
            height: 100%;
            transform: translateX(-50%);
          }
          .flow-beam {
            width: 100%;
            height: 24px;
            background: linear-gradient(180deg, transparent, rgba(226, 201, 154, 0.9), transparent);
          }
          .desktop-arrow-icon {
            display: none;
          }
          .mobile-arrow-icon {
            display: block;
          }
        }
      `}</style>
    </section>
  );
}
