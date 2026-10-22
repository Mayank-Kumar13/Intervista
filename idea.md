# Intervista --- Product Idea

> **Tagline:** Practice like it's the real interview.

## 1. Overview

**Intervista** is an AI-powered interview preparation platform where
candidates can practise in realistic mock interviews and receive a
personalized report after every session.

Unlike a simple chatbot that asks interview questions, Intervista aims
to recreate the environment of a real interview. With the candidate's
permission, a session can use the camera, microphone, and screen sharing
so candidates can practise speaking, presenting their work, explaining
code, walking through a project, or answering role-specific questions
under more realistic conditions.

The goal is to help people understand how they perform, identify gaps,
build confidence, and improve with every practice session.

## 2. The Problem

Interview preparation can be difficult because candidates often:

-   Do not have a consistent partner available for realistic mock
    interviews.
-   Practise questions without experiencing the pressure and flow of a
    live interview.
-   Struggle to judge their own communication, clarity, confidence, and
    technical explanations.
-   Receive little structured feedback---or feedback that is too vague
    to act on.
-   Repeat practice sessions without tracking whether they are
    improving.
-   Need different kinds of preparation for technical, behavioural, HR,
    case-study, or project-based interviews.

## 3. The Solution

Intervista provides an interactive AI interviewer that conducts
structured mock interviews tailored to a candidate's goals. It can ask
follow-up questions, respond to answers, and adapt the interview to the
selected role, experience level, and interview type.

After each session, Intervista creates a clear report with strengths,
improvement areas, answer-level feedback, and practical next steps. Over
time, users can compare reports and track their progress.

## 4. Product Vision

Make high-quality interview practice accessible to anyone, at any time,
with an experience that feels closer to a real interview than reading
questions or chatting with a bot.

## 5. Target Users

-   **Students and fresh graduates** preparing for their first job or
    internship.
-   **Job seekers** preparing for upcoming interviews.
-   **Software developers and technical candidates** practising coding,
    system design, project explanations, and technical discussions.
-   **Experienced professionals** preparing for role changes,
    promotions, or leadership interviews.
-   **Career switchers** learning how to communicate transferable skills
    and explain their background.

## 6. Core User Journey

1.  **Create a profile:** Add a résumé or enter relevant experience,
    skills, education, and career goals.
2.  **Choose an interview:** Select a target role, seniority, interview
    type, difficulty, and session length.
3.  **Configure the session:** Review the camera, microphone, and
    screen-sharing requirements. The user can see why each permission is
    needed and choose whether to proceed.
4.  **Start the mock interview:** The AI interviewer introduces the
    session, asks questions, listens to answers, and asks relevant
    follow-ups.
5.  **Use the real-interview setup:** When relevant and explicitly
    enabled, the candidate can speak on camera, share their screen,
    explain a project, present a résumé, or work through a technical
    task.
6.  **Receive the report:** Once the interview ends, the user receives a
    structured performance report with actionable feedback.
7.  **Improve and repeat:** The platform recommends practice topics and
    lets users compare results across sessions.

## 7. Core Features

### 7.1 AI Mock Interviews

-   Role-specific and experience-level-specific questions.
-   Behavioural, HR, technical, coding, system design, case-study, and
    project-based interview modes.
-   Follow-up questions based on the candidate's answers.
-   Adjustable difficulty and session duration.
-   Natural conversational flow, including clarifications and deeper
    probing.
-   Optional interview styles, such as friendly practice or a more
    formal, challenging interviewer.

### 7.2 Realistic Interview Environment

Intervista is designed to recreate important parts of a real remote
interview.

-   **Camera:** Optional video participation to practise presenting
    oneself on camera.
-   **Microphone:** Spoken answers and conversational interaction.
-   **Screen sharing:** The candidate can present a project, résumé,
    code editor, slides, or other relevant work when appropriate.
-   **Task-based sessions:** For example, explain a project, debug a
    problem, present a design, or walk through a portfolio.
-   **Session setup checks:** Help the user confirm that the required
    devices and browser permissions work before starting.

Access to camera, microphone, and screen sharing must be requested
clearly, separately where applicable, and only when needed for the
selected session. Users should be able to understand what is captured,
what is analysed, how long it is retained, and how to end sharing.

### 7.3 Personalized Post-Interview Report

Every completed interview should generate a report that is easy to
understand and act on. Depending on the interview mode and the evidence
available, the report can include:

-   **Overall summary:** A concise assessment of the session.
-   **Answer quality:** Relevance, completeness, structure, reasoning,
    and use of examples.
-   **Role-specific skills:** Feedback on the competencies tested during
    the interview.
-   **Communication:** Clarity, concision, organization, and explanation
    of complex ideas.
-   **Strengths:** What the candidate did well, supported by examples
    from the session.
-   **Areas to improve:** Specific gaps and how to address them.
-   **Question-by-question feedback:** The question, a summary of the
    answer, what worked, and what could be stronger.
-   **Suggested answer structure:** Guidance for improving an answer
    without encouraging candidates to memorize scripts.
-   **Next steps:** Recommended topics, exercises, or another mock
    interview.
-   **Session history:** Previous reports and progress over time.

Scores should be accompanied by explanations and evidence rather than
presented as unquestionable judgments. Video-based impressions, emotion,
personality, or other sensitive inferences should not be treated as
reliable measures of interview ability.

### 7.4 Progress Tracking

-   A history of completed mock interviews.
-   Performance trends by competency and interview type.
-   Repeated strengths and recurring gaps.
-   Recommendations for the next practice session.
-   Comparisons between attempts at similar questions or interview
    formats.

Progress indicators should be transparent and should account for
differences in interview difficulty and format.

### 7.5 Candidate Profile and Preparation

-   Résumé or job-description input to personalize questions.
-   Target job title, company type, experience level, and skill areas.
-   A preparation plan based on the candidate's goals and previous
    reports.
-   Optional question review and practice outside a live mock interview.

## 8. What Makes Intervista Different?

  -----------------------------------------------------------------------
  Typical preparation                 Intervista
  ----------------------------------- -----------------------------------
  Reading lists of interview          Interactive AI-led mock interviews
  questions                           

  Practising only through text        Voice-first practice, with optional
                                      camera and screen sharing

  Generic tips                        Feedback based on the specific
                                      session

  Little follow-up                    Questions that respond to the
                                      candidate's answers

  No clear record of improvement      Session reports and progress
                                      history

  One-size-fits-all preparation       Practice tailored to role, level,
                                      and goals
  -----------------------------------------------------------------------

The key differentiator is the combination of **realistic practice,
contextual feedback, and a repeatable improvement loop**.

## 9. MVP --- First Version

The first release should focus on delivering one complete, reliable
practice cycle.

### Must-have

-   Account creation and candidate profile.
-   Role, interview type, difficulty, and duration selection.
-   AI-led mock interview with text and/or voice interaction.
-   Microphone and camera permission flow for supported sessions.
-   Optional screen sharing for sessions that require it.
-   Interview session controls, including start, end, and clear
    permission status.
-   Automatically generated post-interview report.
-   Saved interview history and report access.
-   Basic progress indicators and recommended next steps.
-   Clear consent, privacy information, and data deletion controls.

### Later enhancements

-   Live coding environment and code execution.
-   Company- or job-description-specific interview plans.
-   Advanced system-design whiteboard.
-   More detailed voice and delivery feedback.
-   Custom interviewer personas and interview formats.
-   Coach, mentor, or peer review.
-   Integrations with calendars, learning platforms, and job-search
    workflows.

Prioritize reliability, useful feedback, accessibility, and user trust
before adding many advanced features.

## 10. Privacy, Consent, and Trust

Camera, microphone, and screen sharing are sensitive capabilities. Trust
must be part of the product from the beginning.

-   Explain the purpose of each permission before requesting it.
-   Request access only for features the user has chosen to use.
-   Make recording or analysis status visible throughout the session.
-   Let users stop the interview or screen sharing at any time.
-   Explain whether audio, video, transcripts, screenshots, or
    shared-screen content are processed or stored.
-   Collect only the information required to provide the service.
-   Set clear retention periods and provide deletion options.
-   Protect stored reports and any retained session data.
-   Never imply that AI scores predict hiring outcomes with certainty.
-   Avoid unsupported claims about emotion, personality, honesty, or
    employability based on a face or voice.
-   Provide an alternative practice mode when camera or screen sharing
    is unnecessary or unavailable.

The final implementation should be reviewed against applicable privacy
laws and browser/platform requirements for the markets in which
Intervista operates.

## 11. Business Model Possibilities

Potential models to validate with users:

-   **Freemium:** A limited number of mock interviews and basic reports
    for free.
-   **Subscription:** More sessions, detailed reports, progress
    analytics, and personalized preparation plans.
-   **One-time interview packs:** A fixed number of sessions for
    candidates preparing for a specific interview.
-   **Institutional plans:** Access for universities, bootcamps, and
    career centres.
-   **Recruiting or enterprise offerings:** Customized practice
    environments for organizations, subject to clear boundaries between
    candidate preparation and actual hiring assessments.

These are hypotheses, not finalized pricing decisions. Pricing should be
tested with target users.

## 12. Success Metrics

Measure whether Intervista helps candidates practise consistently and
improve.

-   Percentage of users who complete their first mock interview.
-   Interview completion rate.
-   Percentage of users who read or engage with their report.
-   Return rate for a second and subsequent practice session.
-   Report usefulness ratings and user feedback.
-   Improvement on comparable skills across multiple sessions.
-   Session reliability, latency, and permission/setup failure rates.
-   User trust, consent comprehension, and data-deletion request
    completion.

Avoid optimizing only for session length or AI-generated scores. The
central measure of success should be whether candidates find the
practice useful and return to improve.

## 13. Key Risks and Open Questions

-   **Feedback quality:** Reports must be specific, consistent, and
    grounded in what happened during the session.
-   **Latency:** Long pauses in voice interaction can break the realism
    of an interview.
-   **Permission friction:** Camera and screen-sharing requests may
    discourage users if their purpose is unclear.
-   **Evaluation fairness:** Different accents, communication styles,
    disabilities, and hardware conditions should not be unfairly
    penalized.
-   **Privacy:** Screen sharing can expose private messages, personal
    files, or confidential work.
-   **AI reliability:** The interviewer may misunderstand an answer or
    evaluate it incorrectly.
-   **Scope:** Building voice interaction, video, screen sharing, coding
    tools, and high-quality reporting all at once could delay the MVP.

Questions to validate early:

1.  Which user group should Intervista serve first?
2.  Which interview mode provides the strongest initial value?
3.  Should the MVP begin with voice interviews, or include camera and
    screen sharing from day one?
4.  What evidence should support each report category and score?
5.  Which data must be stored, for how long, and what should be
    processed transiently?
6.  What would make users trust the feedback enough to practise again?

## 14. Product Principle

**Intervista should help candidates become better at interviewing---not
pretend to guarantee that they will get hired.**

Every feature should support realistic practice, understandable
feedback, measurable learning, and user control.

## 15. One-Line Pitch

**Intervista is an AI-powered interview practice platform that simulates
realistic interviews and turns every session into a personalized,
actionable report so candidates can improve with every attempt.**
