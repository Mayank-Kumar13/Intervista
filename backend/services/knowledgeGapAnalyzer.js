/**
 * Knowledge Gap & Study Plan Analyzer
 * Task 3: Analyzes tested vs untested concepts, assigns evidence-based priorities,
 * and generates actionable study topics, practice exercises, and follow-up questions.
 */

const { GAP_PRIORITY } = require('../shared/interviewContract');

// Domain concept knowledge graph with recommended resources and drill exercises
const CONCEPT_KNOWLEDGE_BASE = {
  'Database Indexing': {
    priority: GAP_PRIORITY.HIGH,
    resource: 'PostgreSQL Manual: Index Types & B-Tree Internals; Designing Data-Intensive Applications (Ch. 3)',
    practiceExercise: 'Write an EXPLAIN ANALYZE query comparing bitmap index scans against sequential scans on a 10M row table.',
    drillQuestions: [
      'How does PostgreSQL determine whether to use an Index Scan vs a Bitmap Heap Scan?',
      'Why can adding an index negatively impact write-heavy transaction throughput?'
    ]
  },
  'Caching Strategies': {
    priority: GAP_PRIORITY.HIGH,
    resource: 'AWS Whitepaper: Database Caching Strategies Using Redis & Memcached',
    practiceExercise: 'Implement Cache-Aside with probabilistic early expiration (XFetch) in Node.js/TypeScript to eliminate cache stampedes.',
    drillQuestions: [
      'What are the key trade-offs between Write-Through and Write-Back caching?',
      'How do you handle distributed cache invalidation when multiple application pods have local in-memory L1 caches?'
    ]
  },
  'Saga Pattern': {
    priority: GAP_PRIORITY.HIGH,
    resource: 'Chris Richardson: Microservices Patterns (Sagas & Transactional Messaging)',
    practiceExercise: 'Model an e-commerce order workflow using an Orchestrated Saga with Temporal or AWS Step Functions, including compensating refund actions.',
    drillQuestions: [
      'What happens if a compensating transaction fails halfway through an orchestration loop?',
      'How does the Outbox Pattern guarantee atomic database writes and message publishing without 2PC distributed transactions?'
    ]
  },
  'Two-Phase Commit (2PC)': {
    priority: GAP_PRIORITY.MEDIUM,
    resource: 'Tanenbaum: Distributed Systems Principles & Paradigms (Consensus & Atomic Commit)',
    practiceExercise: 'Diagram the prepare and commit phase states, noting coordinator crash scenarios during commit blocks.',
    drillQuestions: [
      'Why is 2PC considered a blocking protocol, and how does 3PC attempt to mitigate coordinator failure?'
    ]
  },
  'Distributed Tracing': {
    priority: GAP_PRIORITY.MEDIUM,
    resource: 'OpenTelemetry Specification: Trace Context & W3C Traceparent Standard',
    practiceExercise: 'Instrument an Express.js API gateway and downstream service with OpenTelemetry SDK and export spans to Jaeger.',
    drillQuestions: [
      'How does trace context propagation work across asynchronous message queues like Kafka?',
      'What sampling rate strategies would you implement for an API handling 100,000 RPS to control storage costs?'
    ]
  },
  'Largest Contentful Paint (LCP)': {
    priority: GAP_PRIORITY.HIGH,
    resource: 'web.dev/articles/lcp - Optimize Largest Contentful Paint Guide',
    practiceExercise: 'Audit a web page with Chrome DevTools Performance panel, preload critical hero images, and eliminate render-blocking CSS.',
    drillQuestions: [
      'What is the difference between Time to First Byte (TTFB), Resource Load Delay, and Element Render Delay in LCP breakdown?',
      'How does font-display: optional differ from font-display: swap in eliminating layout shifts and improving LCP?'
    ]
  },
  'Interaction to Next Paint (INP)': {
    priority: GAP_PRIORITY.HIGH,
    resource: 'web.dev/articles/inp - Interaction to Next Paint Core Web Vital',
    practiceExercise: 'Break up a long JavaScript task (>50ms) using scheduler.yield() or requestIdleCallback to keep input latency under 16ms.',
    drillQuestions: [
      'How does INP differ from the deprecated First Input Delay (FID) metric?',
      'When should a heavy calculation be moved to a Web Worker versus yielded in chunks on the main thread?'
    ]
  },
  'State Colocation': {
    priority: GAP_PRIORITY.MEDIUM,
    resource: 'Kent C. Dodds: State Colocation will make your React app faster',
    practiceExercise: 'Refactor an over-centralized React Redux store into colocated local state and URL query parameters.',
    drillQuestions: [
      'When is it appropriate to lift state up versus using context or external subscriptions?',
      'How do selectors with shallow equality checks prevent unnecessary React re-renders?'
    ]
  },
  'STAR Framework': {
    priority: GAP_PRIORITY.HIGH,
    resource: 'Harvard Business Review: The Right Way to Answer Behavioral Interview Questions',
    practiceExercise: 'Draft 3 bulleted stories (Situation, Task, Action, Result) focusing specifically on measurable business metric outcomes.',
    drillQuestions: [
      'What specific percentage or dollar impact did your architectural decision deliver to the organization?'
    ]
  }
};

/**
 * Analyzes questions and candidate responses to extract tested concepts,
 * missing concepts, weaknesses vs untested concepts, and actionable study plan.
 * 
 * @param {Array} evaluatedQuestions - Array of evaluated questions with questionText, candidateAnswer, testedConcepts
 * @param {string} role - Target job role
 * @returns {Object} { knowledgeGaps: Array, studyPlan: Array }
 */
function analyzeKnowledgeGaps(evaluatedQuestions = [], role = 'Software Engineer') {
  const knowledgeGaps = [];
  const studyPlanMap = new Map();

  for (const eq of evaluatedQuestions) {
    const questionId = eq.questionId || 'q_' + Math.random().toString(36).slice(2, 7);
    const candidateAnswer = (eq.candidateAnswer || '').toLowerCase();
    const testedConcepts = Array.isArray(eq.testedConcepts) && eq.testedConcepts.length > 0
      ? eq.testedConcepts
      : ['System Design Fundamentals', 'Trade-off Analysis'];

    const demonstratedStrengths = [];
    const demonstratedWeaknesses = [];
    const untestedTopics = [];

    // Check which tested concepts were covered in the answer using root stems
    for (const concept of testedConcepts) {
      const conceptTokens = concept.toLowerCase().split(/\s+/).filter(t => t.length > 3);
      const isMentioned = conceptTokens.some(token => {
        const stem = token.replace(/(ing|ed|es|s)$/i, '');
        return candidateAnswer.includes(token) || (stem.length >= 4 && candidateAnswer.includes(stem));
      });

      if (isMentioned && candidateAnswer.length > 40) {
        demonstratedStrengths.push(concept);
      } else {
        demonstratedWeaknesses.push(concept);
      }
    }

    // Add related topics that were NOT tested in this question
    if (role.toLowerCase().includes('front')) {
      untestedTopics.push('Web Workers & SharedArrayBuffer', 'Wasm Performance Boundaries', 'Service Worker Offline Caching');
    } else {
      untestedTopics.push('Consensus Algorithms (Raft/Paxos)', 'Database Partition Pruning', 'Multi-Region Replication Latency');
    }

    // Determine evidence-based priority
    let priority = GAP_PRIORITY.LOW;
    if (demonstratedWeaknesses.length >= 2 || (eq.score !== undefined && eq.score < 75)) {
      priority = GAP_PRIORITY.HIGH;
    } else if (demonstratedWeaknesses.length > 0 || (eq.score !== undefined && eq.score < 85)) {
      priority = GAP_PRIORITY.MEDIUM;
    }

    // Generate specific study recommendation
    const primaryMissingConcept = demonstratedWeaknesses[0] || testedConcepts[0];
    const kbEntry = CONCEPT_KNOWLEDGE_BASE[primaryMissingConcept];

    const studyRecommendation = kbEntry
      ? `Deep dive into ${primaryMissingConcept}: Review ${kbEntry.resource}. Practice by implementing concrete trade-off benchmarks.`
      : `Deepen practical knowledge in ${primaryMissingConcept}. Formulate clear explanations covering concurrency, failure modes, and metrics.`;

    knowledgeGaps.push({
      questionId,
      questionText: eq.questionText,
      testedConcepts,
      demonstratedStrengths,
      demonstratedWeaknesses,
      untestedTopics: untestedTopics.slice(0, 2),
      priority,
      studyRecommendation,
    });

    // Populate aggregated study plan
    if (demonstratedWeaknesses.length > 0) {
      for (const weakConcept of demonstratedWeaknesses) {
        if (!studyPlanMap.has(weakConcept)) {
          const entry = CONCEPT_KNOWLEDGE_BASE[weakConcept] || {
            priority,
            resource: `Official Documentation & Engineering Case Studies for ${weakConcept}`,
            practiceExercise: `Build a minimal proof-of-concept demonstrating ${weakConcept} with benchmarked latency.`,
            drillQuestions: [
              `What are the 3 biggest operational failure modes when scaling ${weakConcept}?`,
              `How would you explain the trade-offs of ${weakConcept} to a junior engineer?`
            ]
          };

          studyPlanMap.set(weakConcept, {
            topic: weakConcept,
            priority: entry.priority || priority,
            recommendedResources: [entry.resource],
            practiceExercises: [entry.practiceExercise],
            followUpInterviewQuestions: entry.drillQuestions || [
              `How does ${weakConcept} behave under unexpected network partitions?`
            ],
          });
        }
      }
    }
  }

  // If candidate performed flawlessly with no major gaps, provide enrichment study plan
  if (studyPlanMap.size === 0) {
    studyPlanMap.set('Advanced Distributed Systems & Scalability', {
      topic: 'Advanced Distributed Systems & Scalability',
      priority: GAP_PRIORITY.LOW,
      recommendedResources: ['Designing Data-Intensive Applications (Kleppmann) - Part III'],
      practiceExercises: ['Design an active-active multi-region synchronization engine with conflict-free replicated data types (CRDTs).'],
      followUpInterviewQuestions: [
        'How do you resolve conflicting concurrent writes in an event-driven microservices architecture without centralized locks?'
      ],
    });
  }

  return {
    knowledgeGaps,
    studyPlan: Array.from(studyPlanMap.values()),
  };
}

module.exports = {
  CONCEPT_KNOWLEDGE_BASE,
  analyzeKnowledgeGaps,
};
