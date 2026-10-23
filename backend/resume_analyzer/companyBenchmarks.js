/**
 * Company Benchmarks & Industry Hiring Rubrics
 * Used by Resume Analyzer to calculate company fit and gap analysis.
 */

const ROLE_KEYWORDS = {
  'Software Engineer': [
    'data structures', 'algorithms', 'system design', 'rest api', 'microservices',
    'distributed systems', 'sql', 'nosql', 'git', 'docker', 'ci/cd', 'unit testing',
    'cloud', 'aws', 'scalability', 'concurrency', 'redis', 'caching'
  ],
  'Frontend Engineer': [
    'react', 'typescript', 'javascript', 'css3', 'html5', 'redux', 'next.js',
    'web performance', 'accessibility', 'a11y', 'responsive design', 'vite', 'tailwind',
    'rest api', 'graphql', 'jest', 'testing library', 'browser rendering', 'state management'
  ],
  'Backend Engineer': [
    'node.js', 'express', 'python', 'django', 'java', 'spring boot', 'golang',
    'postgresql', 'mongodb', 'redis', 'kafka', 'message queues', 'microservices',
    'rest api', 'graphql', 'docker', 'kubernetes', 'aws', 'distributed systems', 'grpc'
  ],
  'Full Stack Engineer': [
    'react', 'node.js', 'typescript', 'sql', 'postgresql', 'mongodb', 'rest api',
    'graphql', 'docker', 'git', 'ci/cd', 'aws', 'system design', 'microservices',
    'state management', 'web performance', 'tailwind', 'express'
  ],
  'AI / ML Engineer': [
    'python', 'pytorch', 'tensorflow', 'machine learning', 'deep learning', 'nlp',
    'computer vision', 'pandas', 'numpy', 'scikit-learn', 'data pipelines', 'mlops',
    'docker', 'huggingface', 'llm', 'transformer', 'vector database', 'sql'
  ],
  'DevOps / SRE': [
    'linux', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'github actions', 'aws',
    'gcp', 'monitoring', 'prometheus', 'grafana', 'bash', 'python', 'networking',
    'infrastructure as code', 'iac', 'ansible', 'helm', 'sre', 'incident response'
  ]
};

const COMPANY_TIERS = [
  {
    tier: 'Tier-1 FAANG & Big Tech',
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix'],
    minAtsThreshold: 85,
    requiredKeywords: ['system design', 'distributed systems', 'scalability', 'algorithms', 'microservices'],
    rubricFocus: 'Rigorous DSA problem-solving, architectural scalability under heavy concurrency, and quantified business impact.',
    typicalGapExplanation: 'Top-tier tech screenings require explicit demonstration of large-scale architecture (distributed caching, latency metrics, load trade-offs) and high-impact measurable project metrics.'
  },
  {
    tier: 'High-Growth Tech Unicorns',
    companies: ['Stripe', 'Uber', 'Airbnb', 'Databricks', 'Snowflake', 'DoorDash'],
    minAtsThreshold: 80,
    requiredKeywords: ['api', 'redis', 'kafka', 'cloud', 'docker', 'ci/cd'],
    rubricFocus: 'High engineering velocity, clean production-ready code, end-to-end ownership, and modern cloud ecosystems.',
    typicalGapExplanation: 'Unicorns evaluate product sense alongside engineering depth. Gaps often stem from lack of modern async pipeline experience (Kafka, queues, real-time sync).'
  },
  {
    tier: 'FinTech & High-Frequency Systems',
    companies: ['Goldman Sachs', 'Morgan Stanley', 'Bloomberg', 'JPMorgan Chase', 'Citadel'],
    minAtsThreshold: 78,
    requiredKeywords: ['sql', 'concurrency', 'transactions', 'security', 'caching', 'testing'],
    rubricFocus: 'Fault tolerance, transaction consistency (ACID), zero-data-loss guarantees, and high reliability under latency constraints.',
    typicalGapExplanation: 'Financial technology teams look for data consistency, security best practices, and relational database optimization under transactional workloads.'
  },
  {
    tier: 'Enterprise Software & Cloud Platforms',
    companies: ['Salesforce', 'Adobe', 'Oracle', 'Cisco', 'Intuit', 'ServiceNow'],
    minAtsThreshold: 74,
    requiredKeywords: ['rest api', 'database', 'cloud', 'unit testing', 'git', 'microservices'],
    rubricFocus: 'Enterprise integrations, multi-tenant architectures, maintainability, clean design patterns, and cross-functional agile execution.',
    typicalGapExplanation: 'Enterprise screens look for solid core CS fundamentals, automated test coverage, and documentation/collaboration methodologies.'
  }
];

module.exports = {
  ROLE_KEYWORDS,
  COMPANY_TIERS,
};
