import { defineMcqProblem } from '../../../../problems/problemAuthoring.js';

const problem = defineMcqProblem({
  id: 'scalability-realtime-updates-001',
  category: 'system',
  type: 'mcq',
  topicId: 'scalability',
  title: 'Scaling Live Order Status Updates',
  difficulty: 'Hard',
  estimatedTime: '7 min',
  tags: ['system', 'scalability', 'websockets', 'pub-sub', 'senior', 'mcq', 'architecture-reasoning'],
  scenario: 'A delivery platform shows live order status updates to users. The first version uses WebSocket connections handled by one server. Traffic is growing, and users connected to different servers must still receive the correct updates.',
  question: 'What design is most appropriate?',
  starterThought: 'Once WebSocket connections are spread across servers, the event producer may not know which server owns the user connection.',
  constraints: [
    'Support many WebSocket servers.',
    'Deliver updates to the server holding the active connection.',
    'Avoid a single server bottleneck.'
  ],
  hints: ['When connections are spread across many servers, updates need a way to reach the server holding the user’s active connection.'],
  intuition: 'Pub/sub decouples event creation from connection ownership in real-time systems.',
  visualExplanation: 'order service → pub/sub channel → WebSocket server with user connection → user device',
  stepByStepBreakdown: [
    'Publish order status changes to a shared channel.',
    'Subscribe WebSocket servers to relevant channels or routing keys.',
    'Deliver the update from the server that owns the user connection.',
    'Scale WebSocket servers horizontally as connection count grows.'
  ],
  bruteForceThought: 'Keeping all connections on one server avoids routing complexity but creates a bottleneck and a single point of failure.',
  optimizationJourney: 'Introduce pub/sub so updates can reach whichever server currently owns the active connection.',
  finalPattern: 'Scalability / WebSockets / Pub-Sub',
  complexityAnalysis: 'Pub/sub adds messaging infrastructure and delivery semantics, but enables horizontal scaling of real-time connections.',
  explanation: 'A pub/sub layer helps scale real-time systems across multiple WebSocket servers. Order events can be published to a shared channel, and the server that has the user’s active connection can receive the event and deliver it. This avoids forcing all users onto one server and supports horizontal scaling. Frontend-only storage cannot deliver server-side state changes reliably. Forcing all users onto one server creates a bottleneck and single point of failure. Disabling live updates avoids the problem instead of designing a scalable solution.',
  engineeringInsight: 'Real-time scale is mostly a routing problem: events must find the server that owns the live connection.',
  commonMistake: 'Scaling WebSockets like stateless HTTP without planning event routing.',
  commonMistakes: [
    'Putting every connection on one server.',
    'Assuming the frontend can invent authoritative state updates.',
    'Turning off core product behavior during normal traffic growth.'
  ],
  productionReality: 'Production real-time systems need connection tracking, authorization, heartbeat handling, backpressure, and fan-out monitoring.',
  followUpQuestion: 'How would you handle a user connected from multiple devices?',
  followUpQuestions: [
    'How are users authorized for order channels?',
    'What happens if a WebSocket server disconnects?',
    'How do you avoid overwhelming slow clients?'
  ],
  relatedConcepts: ['WebSockets', 'pub/sub', 'fan-out', 'horizontal scaling'],
  references: ['publish-subscribe pattern', 'real-time messaging architectures'],
  options: [
    'Add a pub/sub layer so any server can publish updates and connected servers can deliver them to users',
    'Store all WebSocket messages in the frontend only',
    'Force all users to connect to one server forever',
    'Disable live updates during peak traffic'
  ],
  correctAnswer: 0,
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod']
  }
});

export default problem;
