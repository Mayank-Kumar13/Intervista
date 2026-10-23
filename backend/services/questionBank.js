/**
 * Intervista Question Bank & Competency Mapping
 * Role-specific, difficulty-adaptive questions with tested concepts and expected competencies.
 */

const QUESTION_BANK = [
  // ─── Software Engineer / General Backend ──────────────────────────────────────
  {
    id: 'swe_arch_1',
    role: 'Software Engineer',
    category: 'System Architecture & Scaling',
    difficulty: 'Medium',
    experienceLevel: 'Mid Level',
    questionText: 'Can you describe the architecture of a high-throughput backend service you designed or maintained? How did you handle data consistency and database load during peak traffic spikes?',
    testedConcepts: ['Database Indexing', 'Read Replicas', 'Caching Strategies', 'Eventual Consistency', 'Connection Pooling'],
    expectedCompetencies: [
      'Explains read/write splitting or caching layer (e.g. Redis)',
      'Discusses consistency trade-offs (ACID vs BASE, cache invalidation)',
      'Mentions database connection management or queueing (Kafka, RabbitMQ)',
      'Identifies failure modes and circuit breakers'
    ],
    adaptiveFollowUps: [
      {
        trigger: 'cache',
        question: 'You mentioned using a cache. How did you handle cache invalidation and prevent cache stampedes (thundering herd) during cache evictions?',
        testedConcepts: ['Cache Stampede', 'Mutex/Locking', 'TTL Jitter', 'Cache Invalidation'],
      },
      {
        trigger: 'shallow',
        question: 'Could you walk through a concrete example with numbers—such as requests per second, database read/write ratios, or latency budgets you optimized?',
        testedConcepts: ['Throughput Estimation', 'P99 Latency', 'Database Bottlenecks'],
      }
    ]
  },
  {
    id: 'swe_concurrency_2',
    role: 'Software Engineer',
    category: 'Concurrency & Distributed Systems',
    difficulty: 'Hard',
    experienceLevel: 'Senior',
    questionText: 'When multiple microservices need to update shared state across independent databases, what transaction management pattern would you select (e.g., Two-Phase Commit vs Saga Pattern), and how do you handle compensating transactions on failure?',
    testedConcepts: ['Saga Pattern', 'Two-Phase Commit (2PC)', 'Compensating Transactions', 'Outbox Pattern', 'Idempotency'],
    expectedCompetencies: [
      'Contrasts 2PC locking limitations with Saga orchestration vs choreography',
      'Explains idempotency keys for retry safety',
      'Details compensating actions and handling partial rollback failures',
      'Mentions transactional outbox pattern to prevent dual-write bugs'
    ],
    adaptiveFollowUps: [
      {
        trigger: 'saga',
        question: 'In an orchestrated Saga, how do you prevent the orchestrator service itself from becoming a single point of failure and handle delayed timeout acknowledgments?',
        testedConcepts: ['Orchestrator High Availability', 'Dead Letter Queues', 'Timeout Handling'],
      },
      {
        trigger: 'shallow',
        question: 'What specific database guarantees did your services rely on locally, and what happened if the network dropped halfway through an order placement?',
        testedConcepts: ['Network Partitions', 'Idempotent Consumers', 'At-least-once Delivery'],
      }
    ]
  },
  {
    id: 'swe_debug_3',
    role: 'Software Engineer',
    category: 'Production Debugging & Observability',
    difficulty: 'Medium',
    experienceLevel: 'Mid Level',
    questionText: 'Imagine your production API p99 latency suddenly jumps from 45ms to 2.4 seconds, but CPU utilization remains low at 15%. How do you systematically diagnose the root cause?',
    testedConcepts: ['Distributed Tracing', 'Thread Pool Starvation', 'Database Lock Contention', 'Downstream Network I/O', 'Flamegraphs'],
    expectedCompetencies: [
      'Inspects APM / distributed tracing (OpenTelemetry, Datadog)',
      'Recognizes low CPU + high latency indicates blocked I/O, lock contention, or network wait',
      'Examines database slow query logs and active connection pool status',
      'Analyzes external third-party API dependencies or garbage collection pauses'
    ],
    adaptiveFollowUps: [
      {
        trigger: 'lock',
        question: 'If tracing points to database row lock contention on an inventory table, what architectural patterns would you use to eliminate that bottleneck?',
        testedConcepts: ['Optimistic Concurrency Control', 'Redis Atomic Decrement', 'Batching Updates'],
      },
      {
        trigger: 'shallow',
        question: 'Which specific metrics or dashboards would you check first, and how would you distinguish an infrastructure issue from an application code bug?',
        testedConcepts: ['RED Method', 'USE Method', 'Correlation of Logs and Metrics'],
      }
    ]
  },

  // ─── Frontend Engineer ───────────────────────────────────────────────────────
  {
    id: 'fe_perf_1',
    role: 'Frontend Developer',
    category: 'Web Performance & Core Web Vitals',
    difficulty: 'Medium',
    experienceLevel: 'Mid Level',
    questionText: 'How do you profile, diagnose, and optimize Core Web Vitals—specifically Largest Contentful Paint (LCP) and Interaction to Next Paint (INP)—in a modern Single Page Application?',
    testedConcepts: ['Largest Contentful Paint (LCP)', 'Interaction to Next Paint (INP)', 'Long Tasks', 'Code Splitting', 'Resource Hints (preload/preconnect)'],
    expectedCompetencies: [
      'Explains LCP resource prioritization and critical rendering path',
      'Addresses INP by breaking up long tasks using requestIdleCallback, Web Workers, or scheduler.yield()',
      'Discusses bundle size budgeting and dynamic imports (React.lazy)',
      'Uses Chrome Performance tab and PerformanceObserver in production'
    ],
    adaptiveFollowUps: [
      {
        trigger: 'render',
        question: 'When a candidate interaction causes main thread jank due to massive React component re-rendering, what profiling tools and memoization strategies do you deploy?',
        testedConcepts: ['React Profiler', 'useMemo/useCallback Trade-offs', 'Virtual DOM Diffing', 'State Colocation'],
      },
      {
        trigger: 'shallow',
        question: 'What are typical causes for poor LCP on image or font assets, and how does your build pipeline mitigate them?',
        testedConcepts: ['Image CDN Formats (AVIF/WebP)', 'Font-display: swap', 'Critical CSS'],
      }
    ]
  },
  {
    id: 'fe_state_2',
    role: 'Frontend Developer',
    category: 'State Management & Component Architecture',
    difficulty: 'Hard',
    experienceLevel: 'Senior',
    questionText: 'When designing a scalable frontend design system and global state architecture for an enterprise dashboard with real-time WebSocket feeds, how do you prevent cascading re-renders and decouple business logic from presentational components?',
    testedConcepts: ['State Colocation', 'Selectors & Subscriptions (Zustand/Redux Toolkit)', 'Custom Hooks Separation', 'Compound Components', 'WebSocket Throttling'],
    expectedCompetencies: [
      'Distinguishes server state (TanStack Query/RTK Query) from client UI state',
      'Implements atomic selectors or subscription patterns to isolate component re-renders',
      'Uses RAF or throttling on high-frequency WebSocket message batches',
      'Applies compound component patterns for design system reusability'
    ],
    adaptiveFollowUps: [
      {
        trigger: 'websocket',
        question: 'If the WebSocket delivers 50 updates per second, how do you batch those updates into the React render tree to prevent frame dropping?',
        testedConcepts: ['Microtask Batching', 'requestAnimationFrame Buffer', 'Concurrent React (useDeferredValue)'],
      },
      {
        trigger: 'shallow',
        question: 'Could you explain why prop drilling and top-level Context can degrade performance in deeply nested component trees?',
        testedConcepts: ['React Context Invalidation', 'Re-render Propagation', 'Memoization Boundaries'],
      }
    ]
  },

  // ─── Data Scientist / Machine Learning Engineer ──────────────────────────────
  {
    id: 'ds_eval_1',
    role: 'Data Scientist',
    category: 'Model Evaluation & Drift Detection',
    difficulty: 'Medium',
    experienceLevel: 'Mid Level',
    questionText: 'When deploying a classification model in production where the business cost of a False Positive is 10x higher than a False Negative, how do you tune your decision threshold and monitor for data drift over time?',
    testedConcepts: ['Precision-Recall Curves', 'Cost-Sensitive Threshold Tuning', 'Population Stability Index (PSI)', 'Concept Drift vs Data Drift', 'KL Divergence'],
    expectedCompetencies: [
      'Chooses Precision/F-beta over simple accuracy or ROC-AUC',
      'Applies expected value framework or utility matrix for threshold selection',
      'Monitors feature distributions with PSI or KS-test',
      'Distinguishes covariate shift from label drift'
    ],
    adaptiveFollowUps: [
      {
        trigger: 'drift',
        question: 'Once your monitoring alert flags severe covariate shift on an input feature, what is your automated fallback and retraining protocol?',
        testedConcepts: ['Model Fallback', 'Shadow Deployments', 'Active Learning', 'Automated Retraining Pipelines'],
      },
      {
        trigger: 'shallow',
        question: 'Why would standard ROC-AUC be deceptive on highly imbalanced datasets like fraud detection or rare event prediction?',
        testedConcepts: ['Class Imbalance', 'True Negative Rate Skew', 'Precision-Recall AUC'],
      }
    ]
  },

  // ─── Product Manager ────────────────────────────────────────────────────────
  {
    id: 'pm_metrics_1',
    role: 'Product Manager',
    category: 'Product Sense & Experimentation',
    difficulty: 'Medium',
    experienceLevel: 'Mid Level',
    questionText: 'How would you measure the product health and north-star retention of an AI-assisted developer tool? If an A/B test shows a 5% bump in free user activation but a 2% dip in 30-day conversion to paid tiers, how do you decide whether to roll it out?',
    testedConcepts: ['North Star Metric', 'Counter Metrics', 'LTV vs CAC', 'Cannibalization Analysis', 'Cohort Analysis'],
    expectedCompetencies: [
      'Defines measurable leading indicators for developer productivity',
      'Identifies whether the activation uplift brings lower-intent users (cohort dilution)',
      'Evaluates net revenue impact and statistical power',
      'Designs qualitative follow-ups or feature flag segmentation'
    ],
    adaptiveFollowUps: [
      {
        trigger: 'cohort',
        question: 'What specific cohort segmentation would you run first to pinpoint which user personas experienced the conversion drop?',
        testedConcepts: ['Persona Segmentation', 'Funnel Drop-off Analysis', 'User Friction Mapping'],
      },
      {
        trigger: 'shallow',
        question: 'How do you communicate this trade-off to executive leadership and engineering teams with competing priorities?',
        testedConcepts: ['Executive Communication', 'Data-Driven Trade-offs', 'Prioritization Frameworks (RICE)'],
      }
    ]
  },

  // ─── Behavioral / Leadership (All Roles) ────────────────────────────────────
  {
    id: 'behav_conflict_1',
    role: 'Behavioral Interview',
    category: 'Cross-Functional Collaboration & Conflict',
    difficulty: 'Medium',
    experienceLevel: 'Mid Level',
    questionText: 'Tell me about a project where you had a strong technical or product disagreement with a senior engineer or product manager. How did you resolve the conflict, and what was the ultimate project outcome?',
    testedConcepts: ['STAR Framework', 'Objective Disagreement Resolution', 'Data-Driven Alignment', 'Disagree and Commit', 'Measurable Business Impact'],
    expectedCompetencies: [
      'Structures narrative with clear Situation, Task, Action, and Result',
      'Focuses on objective benchmarks or user data rather than personal opinion',
      'Demonstrates empathy and active listening for opposing viewpoints',
      'Reflects on lessons learned and relationship maintenance post-decision'
    ],
    adaptiveFollowUps: [
      {
        trigger: 'data',
        question: 'If you had to run a quick proof-of-concept or benchmark to settle the debate, how did you define the success criteria beforehand?',
        testedConcepts: ['Spike / Prototype Validation', 'Agreed Success Criteria', 'Empirical Decision Making'],
      },
      {
        trigger: 'shallow',
        question: 'Looking back on that outcome, what would you have done differently in terms of early stakeholder alignment?',
        testedConcepts: ['Retrospective Learning', 'Stakeholder Management', 'Early Communication'],
      }
    ]
  }
];

// Helper to find question by ID or pick role-relevant questions
function getQuestionsForSession({ role, interviewType, experience, count = 5 }) {
  // Normalize search strings
  const roleNorm = (role || 'Software Engineer').toLowerCase();
  const typeNorm = (interviewType || '').toLowerCase();

  // First priority: direct role match
  let exactMatches = QUESTION_BANK.filter(q => {
    const qRole = q.role.toLowerCase();
    const qCategory = (q.category || '').toLowerCase();
    if (typeNorm.includes('behavioral')) {
      return qRole.includes('behavioral');
    }
    if (roleNorm.includes('front')) {
      return qRole.includes('front') || qCategory.includes('front') || qCategory.includes('web');
    }
    if (roleNorm.includes('data') || roleNorm.includes('machine') || roleNorm.includes('ml')) {
      return qRole.includes('data') || qCategory.includes('model') || qCategory.includes('drift');
    }
    if (roleNorm.includes('product')) {
      return qRole.includes('product') || qCategory.includes('product');
    }
    if (roleNorm.includes('architect')) {
      return qCategory.includes('concurrency') || qCategory.includes('distributed');
    }
    if (roleNorm.includes('devops') || roleNorm.includes('sre')) {
      return qCategory.includes('observability') || qCategory.includes('debugging');
    }
    if (roleNorm.includes('manager')) {
      return qRole.includes('behavioral') || qCategory.includes('collaboration');
    }
    return qRole.includes('software');
  });

  // Second priority: related fallbacks
  const fallbacks = QUESTION_BANK.filter(q => !exactMatches.includes(q));
  const combined = [...exactMatches, ...fallbacks];

  return combined.slice(0, count);
}

module.exports = {
  QUESTION_BANK,
  getQuestionsForSession,
};
