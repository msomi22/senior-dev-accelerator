const topic = {
  id: 'complex-system-design',
  name: 'Complex System Design',
  category: 'system',
  description: 'Practice full-system architecture prompts with rubric-based scoring and production trade-off feedback.',
  questions: [
    {
      id: 'complex-system-design-url-shortener-001',
      type: 'complex-system-design',
      topicId: 'complex-system-design',
      title: 'Design a URL Shortener',
      difficulty: 'Hard',
      estimatedTime: '30-45 min',
      tags: ['system', 'scalability', 'url-shortener', 'complex-system-design'],
      scenario: 'You are asked to design a URL shortener similar to Bitly.',
      question: 'Design a URL shortener that supports creating short links, redirecting users, tracking analytics, expiry, custom aliases, abuse prevention, and high availability.',
      requirements: {
        functional: [
          'Create a short URL from a long URL',
          'Redirect users from short URL to long URL',
          'Support optional custom aliases',
          'Support link expiry',
          'Track basic analytics such as click count'
        ],
        nonFunctional: [
          'Low redirect latency',
          'High availability',
          'Read-heavy traffic',
          'Safe handling of duplicate or invalid links',
          'Observable and debuggable production behavior'
        ]
      },
      constraints: [
        'Assume the system is read-heavy.',
        'Assume short links may become hot.',
        'Assume users may retry create requests.',
        'Assume analytics can be eventually consistent.'
      ],
      hints: [
        'Start with APIs and the core short-code mapping.',
        'Explain why your code generation strategy is safe.',
        'Separate redirect latency from asynchronous analytics.',
        'Discuss what happens when cache, database, or a region fails.'
      ],
      expectedAnswerOutline: [
        'Clarify requirements and assumptions',
        'Define APIs',
        'Design short-code generation',
        'Design storage model',
        'Explain create and redirect flows',
        'Add caching for hot links',
        'Handle collisions and uniqueness',
        'Discuss scaling and partitioning',
        'Discuss reliability and failure modes',
        'Discuss security and abuse prevention',
        'Add observability and metrics'
      ],
      scoringRubric: [
        {
          id: 'requirements',
          title: 'Requirements Clarification',
          weight: 10,
          criteria: [
            { id: 'functional-requirements', label: 'Functional requirements', points: 4, aliases: ['create short url', 'shorten request', 'long url', 'short url', 'redirect', 'custom alias', 'expiry', 'analytics', 'click count'] },
            { id: 'non-functional-requirements', label: 'Non-functional requirements', points: 4, aliases: ['latency', 'availability', 'scale', 'throughput', 'read heavy', 'load balancer', 'k8s', 'autoscaler', 'network traffic'] },
            { id: 'assumptions', label: 'Assumptions and traffic estimates', points: 2, aliases: ['assume', 'traffic', 'qps', 'read write ratio', 'estimate'] }
          ]
        },
        {
          id: 'short-code-generation',
          title: 'Short Code Generation',
          weight: 15,
          criteria: [
            { id: 'base62', label: 'Base62 or URL-safe encoding', points: 5, aliases: ['base62', 'base 62', '62 characters', 'url safe alphabet', 'digits and letters', 'shorten url'], requiresReasoning: true },
            { id: 'unique-id-generation', label: 'Unique ID generation strategy', points: 4, aliases: ['sequence id', 'snowflake', 'distributed id', 'auto increment', 'random token', 'hashcode', 'hash code', 'generate hashcode', 'generate code'] },
            { id: 'collision-handling', label: 'Collision handling', points: 4, aliases: ['collision', 'duplicate short code', 'unique constraint', 'retry', 'hash exists', 'hash existing', 'exists in database', 'already exists', 'return cached value'] },
            { id: 'generation-tradeoffs', label: 'Generation trade-offs', points: 2, aliases: ['predictable', 'random', 'security', 'trade-off', 'guessable', 'hash', 'unique id'] }
          ]
        },
        {
          id: 'storage-design',
          title: 'Storage Design',
          weight: 10,
          criteria: [
            { id: 'url-mapping', label: 'URL mapping table', points: 4, aliases: ['short code to long url', 'short url to long url', 'hashcode long url', 'hashcode', 'mapping', 'url table', 'lookup original url', 'save long url', 'save short url'] },
            { id: 'metadata', label: 'Metadata', points: 3, aliases: ['created at', 'expiry', 'owner', 'click count', 'status', 'metadata', 'other metadata'] },
            { id: 'indexes', label: 'Indexes', points: 3, aliases: ['index', 'primary key', 'lookup index', 'unique index', 'database lookup'] }
          ]
        },
        {
          id: 'read-write-flows',
          title: 'Read and Write Flows',
          weight: 10,
          criteria: [
            { id: 'create-flow', label: 'Create short URL flow', points: 4, aliases: ['create flow', 'shortening request', 'receive request', 'insert mapping', 'generate code', 'store url', 'save in database', 'update cache'] },
            { id: 'redirect-flow', label: 'Redirect flow', points: 4, aliases: ['redirect flow', 'accessing short url', 'user provides short url', 'lookup short code', 'retrieve long url', 'redirect user', 'redirect to long url', '301', '302', 'return long url'] },
            { id: 'retry-idempotency', label: 'Retry and idempotency behavior', points: 2, aliases: ['idempotency', 'retry', 'duplicate request', 'same result', 'if exists return', 'return cached value'] }
          ]
        },
        {
          id: 'scaling-performance',
          title: 'Scaling and Performance',
          weight: 15,
          criteria: [
            { id: 'cache', label: 'Caching hot links', points: 5, aliases: ['cache', 'redis', 'cdn', 'edge cache', 'hot link', 'cached value', 'update cache'] },
            { id: 'partitioning', label: 'Partitioning or sharding', points: 4, aliases: ['shard', 'partition', 'consistent hashing', 'split by code', 'hash partition', 'database partition'] },
            { id: 'read-heavy-optimization', label: 'Read-heavy optimization', points: 3, aliases: ['read heavy', 'read replica', 'low latency', 'high qps', 'cache lookup', 'check cache'] },
            { id: 'backpressure', label: 'Backpressure and rate limits', points: 3, aliases: ['rate limit', 'throttle', 'throttling', 'backpressure', 'protect service', 'api gateway'] }
          ]
        },
        {
          id: 'reliability-consistency',
          title: 'Reliability and Consistency',
          weight: 15,
          criteria: [
            { id: 'high-availability', label: 'High availability', points: 4, aliases: ['high availability', 'failover', 'multi region', 'replication', 'load balancer', 'k8s', 'pod autoscaler'] },
            { id: 'consistency-tradeoffs', label: 'Consistency trade-offs', points: 4, aliases: ['eventual consistency', 'strong consistency', 'stale', 'consistency'] },
            { id: 'failure-modes', label: 'Failure modes', points: 4, aliases: ['database down', 'cache down', 'partial failure', 'fallback', 'cache miss', 'if cache fails'] },
            { id: 'analytics-consistency', label: 'Analytics consistency', points: 3, aliases: ['async analytics', 'eventual analytics', 'queue clicks', 'click events'] }
          ]
        },
        {
          id: 'security-abuse',
          title: 'Security and Abuse Prevention',
          weight: 10,
          criteria: [
            { id: 'malicious-url-protection', label: 'Malicious URL protection', points: 4, aliases: ['malicious url', 'spam', 'phishing', 'blocklist', 'safe browsing', 'ssl termination', 'authentication'] },
            { id: 'rate-limiting', label: 'Rate limiting', points: 3, aliases: ['rate limit', 'quota', 'abuse', 'throttle', 'throttling', 'api gateway', 'per user', 'ip address'] },
            { id: 'custom-alias-protection', label: 'Custom alias protection', points: 3, aliases: ['reserved alias', 'custom alias', 'namespace', 'ownership', 'authentication'] }
          ]
        },
        {
          id: 'observability',
          title: 'Observability',
          weight: 10,
          criteria: [
            { id: 'metrics', label: 'Metrics', points: 4, aliases: ['metrics', 'latency', 'error rate', 'cache hit rate', 'qps'] },
            { id: 'logging-tracing', label: 'Logs and tracing', points: 3, aliases: ['logs', 'tracing', 'trace id', 'debug'] },
            { id: 'alerts', label: 'Alerts', points: 3, aliases: ['alert', 'dashboard', 'monitoring', 'slo'] }
          ]
        }
      ],
      modelAnswer: 'A strong answer should clarify requirements, explain APIs, describe generating short codes using a safe strategy such as Base62 encoding over unique IDs, handle collisions, store short-code mappings with indexes, optimize redirects with caching, handle hot links, discuss eventual consistency for analytics, add abuse prevention, and include observability.',
      commonWeakAnswers: [
        'Only says use Base62 without explaining why.',
        'Mentions Redis/PostgreSQL/Kafka without explaining trade-offs.',
        'Ignores collision handling.',
        'Ignores redirect latency.',
        'Ignores abuse prevention.',
        'Ignores failure modes and observability.'
      ],
      finalPattern: 'Complex System Design'
    }
  ]
};

export default topic;