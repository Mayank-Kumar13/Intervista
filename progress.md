# Intervista — Project Progress & Design Specification

> **Project Tagline:** *Practice like it's the real interview.*  
> **Repository:** `https://github.com/Mayank-Kumar13/Intervista.git`  
> **Status:** Active Development (Planning & Foundation Phase)  
> **Last Updated:** October 2026

---

## 1. Executive Summary & Vision

**Intervista** is an AI-powered interview preparation platform designed to simulate realistic, voice-first mock interviews. Unlike conventional text chatbots or static question lists, Intervista creates a live, high-fidelity interview experience featuring real-time conversational voice interaction, optional camera participation, screen-sharing capabilities for technical/project walkthroughs, and instant personalized post-interview performance reports.

---

## 2. Core Website Theme & Design System

The visual identity and design system of Intervista are defined by the sleek, ultra-premium dark aesthetic shown in the official reference design. It blends luxury editorial typography with modern glassmorphism, warm ambient glows, and clean interactive components.

### 2.1 Color Palette Tokens

```css
:root {
  /* Surface & Background */
  --bg-primary: #080808;             /* Deep cosmos black */
  --bg-surface: #111111;             /* Primary card background */
  --bg-surface-elevated: #161616;    /* Floating modals & hover states */
  --bg-surface-subtle: #1c1c1c;      /* Inset boxes, secondary containers */

  /* Borders & Dividers */
  --border-subtle: rgba(255, 255, 255, 0.08); /* 1px hairline border */
  --border-card: rgba(255, 255, 255, 0.12);   /* Card perimeter border */
  --border-hover: rgba(245, 231, 200, 0.35);  /* Warm champagne border glow on hover */

  /* Brand Accents & Ambient Glows */
  --accent-champagne: #F5E7C8;       /* Primary luxury champagne accent */
  --accent-gold: #E2C99A;            /* Warm golden tone for badges & highlights */
  --accent-amber: #D4A373;           /* Subdued warm amber for glows */
  --glow-warm: rgba(245, 231, 200, 0.15); /* Soft ambient radial diffusion */
  --glow-orb: radial-gradient(circle, rgba(245, 231, 200, 0.25) 0%, rgba(212, 163, 115, 0.1) 40%, transparent 70%);

  /* High-Contrast Light Surface (Bottom CTA & Highlights) */
  --surface-cream: #F3EFE6;          /* Luxury cream/ivory highlight card */
  --surface-cream-border: #E5DEC9;
  --text-on-cream-primary: #0F0F0F;  /* Deep black text on cream surface */
  --text-on-cream-secondary: #57534E;/* Muted secondary text on cream surface */

  /* Typography Colors */
  --text-primary: #FDFBF7;           /* Crisp warm white for headlines */
  --text-secondary: #A1A1AA;         /* Soft neutral zinc for body copy */
  --text-muted: #71717A;             /* Footnotes, timestamps, microcopy */
  --text-accent: #E8D8BD;            /* Subdued gold for highlights & links */

  /* Semantic Feedback & Status */
  --status-active: #EF4444;          /* Recording / live indicator dot */
  --status-live: #22C55E;            /* Online / active connection pulse */
  --status-success: #10B981;         /* Positive feedback checks */
  --status-waveform: #FFFFFF;        /* Soundwave audio bars */
}
```

### 2.2 Typography Hierarchy

| Role | Font Family | Weight & Style | Sample Usage |
| :--- | :--- | :--- | :--- |
| **Display Headings** | Editorial Serif (`Playfair Display`, `Instrument Serif`, or `Newsreader`) | 400 Regular / Italic Accent | *"Your next interview, reimagined."*, *"Everything you need to ace your interview"* |
| **Section Headings** | Editorial Serif / Modern Serif | 400-500 Medium | *"It's simple. Just 3 steps."*, *"Build the confidence you need"* |
| **Brand Identity** | Modern Serif / Sans with Star | 500 Medium | `✦ Intervista AI` |
| **Navigation & UI** | Clean Sans (`Plus Jakarta Sans` or `Inter`) | 500 Medium, 14px | Top navbar links, tab items, dropdowns |
| **Eyebrow / Category** | Geometric Sans | 600 SemiBold, 11px, Uppercase, Tracking `0.15em` | `FEATURES`, `HOW IT WORKS`, `REAL RESULTS`, `TRUSTED BY LEADING COMPANIES` |
| **Body & Explanations**| Clean Sans (`Plus Jakarta Sans` or `Inter`) | 400 Regular, 15px-16px, Line-height 1.6 | Descriptive paragraphs, question prompts, report feedback |
| **Metrics & Numbers** | High-contrast Sans / Mono | 600 SemiBold | `88%`, `92%`, `02:34`, `+4.8k` |

### 2.3 Visual Components & Design Motifs

1. **Brand Motif (`✦ Intervista AI`)**:
   - 4-pointed sparkle icon in warm champagne paired with sleek brand lettering.
2. **Hero Audio Orb & Waveforms**:
   - Central floating sphere with illuminated rim glow and dynamic audio wave bars reflecting real-time voice synthesis.
   - Translucent floating cards with backdrop blur (`backdrop-filter: blur(16px)`), micro-waveforms, and speaker/interviewer status tags.
3. **Pill Badges & Buttons**:
   - **Primary Action:** Warm ivory pill button (`background: var(--surface-cream); color: var(--text-on-cream-primary); border-radius: 9999px;`) with forward arrow icon.
   - **Secondary Action:** Glassmorphic dark pill button (`background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-card); color: var(--text-primary); border-radius: 9999px;`) with media/play icon.
   - **Status Badges:** Small pill (`Live now — Real-time voice interviews`) with live pulsing indicator.
4. **Feature & Step Cards**:
   - Soft rounded cards (`border-radius: 20px`) with 1px subtle borders.
   - Minimal circular icon containers with fine-line icons (Microphone, Brain, Chart, Shield).
   - Step sequence with numbered circular badges (`1`, `2`, `3`).
5. **Interactive Console Preview**:
   - Deep charcoal console window with glowing amber rim, interview timer (`02:34 ●`), question subtitle, and live microphone listener button.
6. **Results & Social Proof**:
   - Monochrome corporate logos (Google, Microsoft, Amazon, Apple, Meta, Tesla, Adobe, Shopify).
   - Circular progress wheel (`88% Average Improvement`).
   - Clean horizontal competency progress bars (Communication, Technical Depth, Problem Solving, Confidence).
   - Social proof learner stack (`+4.8k Active learners`) with quote snippet.
7. **Contrasting Bottom Call to Action**:
   - Inverted warm cream container (`--surface-cream`) with dark editorial serif headline and dark pill button (`Start interview →`), providing high visual impact before the footer.

---

## 3. Architecture & Implementation Roadmap

```
Intervista System Architecture
│
├── 1. Frontend Web App (Vite / React + Vanilla CSS Design System)
│    ├── Landing Page (Hero, Audio Orb, Features, 3-Step Flow, Metrics, CTA)
│    ├── Candidate Onboarding & Profile Setup (Target role, resume, experience)
│    ├── Session Configuration & Permissions (Mic, Camera, Screen share check)
│    ├── Live Mock Interview Console (Real-time voice stream, waveform, prompt display)
│    └── Post-Interview Performance Report (Scores, breakdown, actionable roadmap)
│
├── 2. Voice & Multimodal Engine
│    ├── Web Audio API / Audio Worklet for real-time speech capture
│    ├── Speech-to-Text (Streaming STT / Whisper API)
│    ├── Conversational AI Core (Interviewer persona, adaptive follow-ups)
│    └── Text-to-Speech (Natural low-latency speech synthesis)
│
└── 3. Evaluation & Progress Engine
     ├── Rubric-based evaluation (Communication, Technical depth, Structure, Clarity)
     ├── Structured report generation
     └── Historical session tracking & competency trends
```

---

## 4. Progress Tracker & Milestones

### Phase 1: Foundation & Design System (Current)
- [x] Initial repository setup and GitHub sync (`Mayank-Kumar13/Intervista.git`).
- [x] Product requirement document and vision consolidation ([idea.md](file:///c:/Users/mayan/OneDrive/Desktop/CLASSES/Projects/Intervista/idea.md)).
- [x] Establish official progress tracker and design specifications ([progress.md](file:///c:/Users/mayan/OneDrive/Desktop/CLASSES/Projects/Intervista/progress.md)).
- [x] Initialize modern web frontend application using the verified design tokens.
- [x] Build core design tokens, typography, and utility classes in `index.css`.
- [x] Implement reusable UI primitives (Pill buttons, Glass cards, Badges, Waveform components, Icons).

### Phase 2: Landing Page Implementation (Visual Match)
- [x] **Navbar:** Updated with `HOME`, `DASHBOARD`, `COMPANIES`, `REVIEWS`, `CONTACT US`, Log in, and `Start Interview →` CTA.
- [x] **Hero Section:** Display serif headline (*"Your next interview, reimagined."*), live audio waveform, CTAs, and interactive 3D perspective MacBook laptop displaying live dashboard.
- [x] **Social Proof:** "Trusted by leading companies" with monochrome logos that transition to authentic brand colors on hover.
- [x] **Features Grid:** Interview Experience showcase with Product Manager live console preview.
- [x] **How It Works:** 3-step numbered journey with circular arrow affordances.
- [x] **Role Selection Library:** 4 interactive role cards with skill tags and launch triggers.
- [x] **Real Results & Analysis:** 88% circular score ring, skill progress bars, and sample assessment preview.
- [x] **Student Feedback & Reviews:** 4.9 rating summary, star breakdown bars, "Write a Review" modal, and infinite horizontal marquee loop.
- [x] **Bottom Banner:** Dark warm luxury call-to-action card with flowing champagne gold ribbons (*"Be interview ready, for every opportunity."*).
- [x] **Footer:** Brand links, categorized resources, privacy policy, and ethics disclosures.

### Phase 3: Candidate Setup & Session Configuration
- [x] Role selector (Software Engineer, Product Manager, Data Analyst, UX Designer, System Design, Behavioral/HR).
- [x] Experience level & interview format selection.
- [x] Transparent permission checker with live Web Audio microphone meter, camera & screen sharing toggles.

### Phase 4: Live Mock Interview Experience
- [x] AI Interviewer Voice integration (Web Audio speech synthesis + speech recognition).
- [x] Dynamic audio visualizer reacting to spoken sound.
- [x] Session controls: Mute, sample answers, question skip, real-time transcript.

### Phase 6: Company Interview Preparation Section (Implemented)
- [x] **Structured Data Engine (`frontend/data/companyData.js`)**: Converted the research Markdown guide into a structured dataset covering all 15 target companies (Google, Microsoft, Amazon, Meta, Apple, Netflix, Adobe, Salesforce, IBM, Oracle, NVIDIA, Infosys, TCS, Wipro, Accenture) with distinct candidate-reported questions, curated practice problems, direct problem URLs, core CS topics, aptitude topics, official career guidance links, and source labels.
- [x] **CardSwap Component (`frontend/components/CardSwap.jsx`)**: Integrated the reference CardSwap animation powered by GSAP perspective transforms, smooth 3D cycling, pause on hover, click selection, and `prefers-reduced-motion` compliance matching Intervista's dark luxury theme.
- [x] **Synchronized Company Selection**: Unified selection state across the CardSwap showcase, searchable company browser grid, and the left sidebar directory. Selecting any company synchronizes all three components.
- [x] **Company Directory & Section Navigation**: Left sidebar containing all 15 companies with brand indicator dots, solved counters, active highlights, and quick section jumpers (Overview, Questions, Practice, Resources, Core CS, Aptitude, Behavioral, Roadmap).
- [x] **Question Interaction & Progress Tracking**: Real-time solved/unsolved checkbox toggle with localStorage persistence (`intervista-company-progress`), dynamic progress circle indicator, topic filters, and difficulty filters.
- [x] **Core CS & Technical Fundamentals**: Dedicated section covering OOP (4 pillars, polymorphism, design principles), DBMS & SQL (ACID, joins, indexes, normalization), Operating Systems (processes vs threads, deadlocks, paging, concurrency), and Computer Networks (OSI vs TCP/IP, TCP handshake, HTTP/HTTPS, DNS).
- [x] **Aptitude & Behavioral Prep**: Tailored aptitude topics for services/campus companies (Accenture, TCS, Infosys, Wipro) and STAR-R behavioral framework prompts.
- [x] **Integration & Cross-Navigation**: Connected company logos in the trusted strip to jump directly to specific company prep; linked "Start AI Mock Interview" in company headers to the setup modal.

### Phase 6: AI Dashboard Overview Page (Matches Reference UI)
- [x] **Collapsible Left Sidebar:** Intervista AI wordmark, collapse/expand toggle (`<` / `>`), active `Overview` state with champagne border & subtle glow, navigation items (`Mock Room`, `Analytics & Skills`, `Schedule & Feed`, `Career Prep`, `Settings`), and `← Back to Website` link.
- [x] **Welcome Header:** *"Welcome Back, Mayankkk"*, completed mock sessions subtext, primary `+ Start New Interview →` pill button, upper-right notification bell with unread indicator dot, user avatar (`M`), and understated motivational card (*"Consistent practice today, bigger opportunities tomorrow."*).
- [x] **Yearly Practice Activity Heatmap:** 12-month calendar (Jan–Dec), 53-week × 7-day contribution grid, progressive emerald green intensity tiers (`#064e3b`, `#047857`, `#10B981`, `#34D399`), interactive year navigation (`< 2026 >`), date & session count hover tooltips, and `Less → More` legend.
- [x] **Recent Interviews:** 2-column left section with table rows for Google (86%), Microsoft (78%), Amazon (72%), and Tesla (65%), authentic vector logos, circular SVG score percentage gauges, dates, and interactive `View Report` buttons linked to report modals.
- [x] **Topics to Work On:** 2-column right section with 3 skill cards (Technical depth 62%, Problem solving 71%, Communication 78%), monochrome icons, concise growth guidance, and champagne progress bars.
- [x] **Two-Way Navigation & Routing:** Seamless switching between homepage and dashboard via top Navbar `DASHBOARD` / `HOME` tabs and browser hash (`#dashboard` / `#home`).
- [x] **Responsive Layout:** Adaptive sidebar for desktop, top bar with mobile menu for small screens, and stacked responsive grid for mobile and tablet views.

---

## 5. Change Log & Activity Record

| Date | Milestone / Change | Details |
| :--- | :--- | :--- |
| **2026-10-22** | **Project Kickoff & Git Connection** | Connected folder to remote repository `Mayank-Kumar13/Intervista.git`. Cleaned directory context. |
| **2026-10-22** | **Design System Extraction & Progress Setup** | Created [progress.md](file:///c:/Users/mayan/OneDrive/Desktop/CLASSES/Projects/Intervista/progress.md) defining the project vision, roadmap, and dark luxury theme. |
| **2026-10-22** | **Full Homepage Implementation** | Built complete Intervista frontend with Vite + React + Vanilla CSS matching the reference design: Hero with 3D laptop dashboard, trusted company logo strip, How It Works cards, Interview Experience showcase, Role cards, and Performance Report panel. |
| **2026-10-22** | **Reviews System, Nav Updates & Brand Colors** | 1) Built Student Feedback section with 4.9 rating, star distribution, "Write a Review" modal, and continuous infinite horizontal marquee loop. 2) Updated navbar to `HOME`, `DASHBOARD`, `COMPANIES`, `REVIEWS`, `CONTACT US`. 3) Removed "Live now" oval pill from Hero. 4) Added official brand color transitions to company logos on hover. |
| **2026-10-22** | **Companies Tab & CardSwap Implementation** | Built full Companies Interview Preparation section: 1) Created `companyData.js` with all 15 companies, verified questions, resources, and topics from research guide. 2) Created `CardSwap.jsx` with GSAP perspective swaps. 3) Created `CompaniesSection.jsx` with synchronized 3-way company selection (CardSwap, searchable browser, left sidebar), real-time progress tracking, Core CS fundamentals, aptitude sections, and behavioral prompts. 4) Verified production build and visual interaction via browser automation. |
| **2026-10-22** | **Separate Companies Page & Header Overlap Fix** | 1) Shifted Companies section from single-scroll home page to a dedicated separate page view (`#companies`) routed via React state + URL hash. 2) Fixed typography overlap where CardSwap cards were climbing 120px upwards into the section title/subtitle by centering card slot offsets around the stack midpoint and reducing vertical displacement. 3) Added breadcrumb navigation with "← Back to Home" button and active navbar gold indicators. |
| **2026-10-22** | **Dashboard Overview Page (Matches Reference UI)** | Built dedicated Intervista AI Dashboard Overview page matching the reference screenshot: 1) Left sidebar with collapse control, 2) Welcome header with motivational card and Start Interview CTA, 3) 53-week yearly practice heatmap with year switcher and tooltips, 4) Recent interviews table with circular score rings and View Report modals, 5) Topics to work on with champagne progress bars. Integrated two-way navigation with Navbar and URL hashes. |
| **2026-10-22** | **Premium Plans & Checkout Section** | Built premium pricing cards and interactive checkout modal with Razorpay simulation for subscription access. |
| **2026-10-22** | **Homepage Section Cleanup** | Removed the "Your performance, clearly understood" (`PerformanceReport`) section from the homepage as requested. Cleaned up footer navigation link. |
| **2026-10-22** | **Interview Showcase Removal** | Removed the "Real interviews. Real feedback." (`InterviewShowcase`) section from the homepage as requested. Cleaned up footer navigation link. |
| **2026-10-22** | **How It Works Minimal Flow Redesign & Git Sync** | 1) Redesigned "How it works" matching reference image: uncluttered, no numbers, top glowing halo nodes, and sequential flowing glow through the arrows. 2) Pulled remote changes (Plans & Pricing, Checkout modal, and frontend/ directory refactoring), resolved merge conflicts cleanly, and pushed all commits to origin/main. |
| **2026-10-22** | **Remote Integration & Full Sync to Origin** | Pulled remote changes from `Mayank-Kumar13/Intervista.git`, cleanly resolved branch state retaining all local features (CardSwap showcase, 15-company interview engine, dashboard routing, and checkout), cleaned orphan directories, verified production build, and safely pushed to remote `main`. |
| **2026-10-22** | **Minimalist Footer Refactoring** | Streamlined footer to remove excessive marketing copy, redundant guide lists, and technical status badges. Retained essential brand identity, primary navigation links (Home, Dashboard, Companies, Plans, Contact), and legal disclosures with a clean, luxury aesthetic. |
| **2026-10-22** | **GSAP PillNav Animation Integration** | Integrated GSAP PillNav into main Navbar matching dark champagne luxury palette: 1) Rising circle expanding background on hover with dynamic geometric radius calculation, 2) Vertical flip label stack (.pill-label to .pill-label-hover with high contrast dark text), 3) Rotating logo elastic spin on hover, 4) Active page glow dot indicator, 5) Maintained all current tabs (HOME, DASHBOARD, COMPANIES, PLANS, CONTACT US) and actions (Log in, Start Interview). |

---

> *Note: Update this file with new entries under the **Change Log** and tick off checklist items as features are implemented.*

