import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const prompt = 'Deploy the KubeTasker API into Kubernetes, expose it with an internal Service, and verify it from a temporary client pod using cluster DNS.';

function command(title, explanation, code, language = 'bash') {
  return [
    { type: 'section', title, content: explanation },
    { type: 'code', title, language, code }
  ];
}

const namespaceManifest = `apiVersion: v1
kind: Namespace
metadata:
  name: kubetasker`;

const deploymentManifest = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: kube-tasker-api
  namespace: kubetasker
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kube-tasker-api
  template:
    metadata:
      labels:
        app: kube-tasker-api
    spec:
      containers:
        - name: api
          image: msomi22/kubetasker-api:0.1.1
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8080`;

const serviceManifest = `apiVersion: v1
kind: Service
metadata:
  name: kube-tasker-api
  namespace: kubetasker
spec:
  type: ClusterIP
  selector:
    app: kube-tasker-api
  ports:
    - name: http
      port: 80
      targetPort: 8080`;

const clientPodManifest = `apiVersion: v1
kind: Pod
metadata:
  name: kube-tasker-client
  namespace: kubetasker
spec:
  restartPolicy: Never
  containers:
    - name: client
      image: busybox:1.36
      command: ['sleep', '3600']`;

const problem = defineLearningProblem({
  id: 'ckad-stage-1-deploy-kubetasker-api-foundation-001',
  category: 'kubernetes-ckad',
  topicId: 'ckad-stage-1',
  title: 'CKAD Stage 1: Deploy KubeTasker API Foundation',
  difficulty: 'Easy',
  estimatedTimeSeconds: 1200,
  estimatedTime: '20 min',
  tags: ['kubernetes-ckad', 'ckad-stage-1', 'kubetasker', 'deployment', 'replicaset', 'pod', 'service', 'dns', 'endpoints'],
  rendering: { variant: 'deep-dive', density: 'comfortable', accent: 'green' },
  prompt,
  question: prompt,
  scenario: 'You are onboarding KubeTasker, a lightweight task management API used for CKAD practice. Your first task is to deploy the API into a Kubernetes namespace and prove that another pod inside the cluster can reach it through a Service.',
  starterThought: 'Start small: one namespace, one Deployment, one ClusterIP Service, and one temporary client pod.',
  intuition: 'A Deployment creates and protects the running API Pod. A Service gives that Pod a stable in-cluster name. A client pod proves the API is reachable the same way another workload would call it.',
  mentalPicture: 'Think of the namespace as the practice room, the Deployment as the manager, the ReplicaSet as the assistant keeping the right number of Pods alive, the Pod as the running API, and the Service as the stable front desk name other Pods use.',
  patternSignal: 'Use Deployment + ClusterIP Service when you need a normal internal application workload reachable by other Pods in the cluster.',
  invariant: 'The Service selector must match the API Pod labels; otherwise the Service has no endpoints and traffic has nowhere to go.',
  finalPattern: 'Deploy an internal Kubernetes workload and verify it through Service DNS from inside the cluster.',
  commonMistake: 'The most common failure is a Service selector that does not match the Pod label, leaving the Service with no endpoints.',
  commonMistakes: [
    'Running commands in the wrong namespace or forgetting -n kubetasker.',
    'Expecting localhost to work from the client pod. localhost means the client pod itself, not the API Pod.',
    'Creating the Service with the wrong targetPort. The Service port can be 80, but the API container listens on 8080.',
    'Forgetting to wait for the client pod before running exec.',
    'Looking for KubeTasker in kube-system even though it is a course demo app, not a Kubernetes system component.',
    'Confusing the Deployment name with the Service DNS name. In this lab they match for convenience, but DNS comes from the Service.'
  ],
  edgeCases: ['Image pull delay on a fresh cluster', 'Client pod starts before the API pod is ready', 'Service exists but has no endpoints', 'Using a namespace other than kubetasker'],
  complexityAnalysis: 'This is an operational CKAD task rather than an algorithmic problem. The important complexity is object relationship complexity: Namespace contains the objects, Deployment owns ReplicaSet, ReplicaSet owns Pod, Service selects Pod, Endpoints show selected Pod IPs, and the client pod calls the Service DNS name.',
  explanation: 'The namespace keeps the lab resources together. The Deployment declares one desired API replica. Kubernetes creates a ReplicaSet, and the ReplicaSet creates the Pod that runs the KubeTasker API container. The Service selects Pods with app=kube-tasker-api and provides the stable DNS name kube-tasker-api inside the same namespace. The BusyBox client pod proves the Service works by calling the API from inside the cluster.',
  stepByStepBreakdown: [
    'Confirm kubectl can reach the cluster.',
    'Create the kubetasker namespace.',
    'Create a one-replica Deployment for msomi22/kubetasker-api:0.1.1.',
    'Inspect the Deployment, ReplicaSet, and Pod.',
    'Expose the Deployment with a ClusterIP Service.',
    'Inspect the Service and Endpoints.',
    'Run a temporary BusyBox client pod in the same namespace.',
    'Call the API through the Service DNS name from inside the client pod.',
    'Clean up the Stage 1 application namespace when finished.'
  ],
  finalTakeaway: 'For CKAD foundations, do not just create objects. Always verify the chain: Deployment available, Pod ready, Service has endpoints, and another pod can reach the Service DNS name.',
  visualExplanation: 'The visual shows how the core Stage 1 objects connect: Deployment creates a ReplicaSet, the ReplicaSet keeps the API Pod alive, the Service selects that Pod, and the client pod reaches the API through Service DNS.',
  visualWalkthrough: {
    title: 'KubeTasker Stage 1 object relationships',
    summary: 'Follow the path from desired workload to in-cluster verification.',
    diagram: {
      type: 'graph',
      variant: 'kubernetes-object-relationship',
      title: 'Deployment, Service, and client pod flow',
      description: 'A beginner-friendly map of the Kubernetes objects used in Stage 1.',
      nodes: [
        { id: 'namespace', label: 'Namespace\nkubetasker' },
        { id: 'deployment', label: 'Deployment\nkube-tasker-api' },
        { id: 'replicaset', label: 'ReplicaSet\ncreated by Deployment' },
        { id: 'api-pod', label: 'Pod\nAPI container :8080' },
        { id: 'service', label: 'Service\nClusterIP :80' },
        { id: 'endpoints', label: 'Endpoints\nAPI Pod IP' },
        { id: 'client', label: 'Client Pod\nbusybox' },
        { id: 'dns', label: 'DNS name\nkube-tasker-api' }
      ],
      edges: [
        { from: 'namespace', to: 'deployment', label: 'contains' },
        { from: 'deployment', to: 'replicaset', label: 'creates' },
        { from: 'replicaset', to: 'api-pod', label: 'keeps 1 Pod running' },
        { from: 'service', to: 'api-pod', label: 'selector: app=kube-tasker-api' },
        { from: 'service', to: 'endpoints', label: 'publishes backing Pod IP' },
        { from: 'client', to: 'dns', label: 'calls' },
        { from: 'dns', to: 'service', label: 'resolves to Service' },
        { from: 'service', to: 'api-pod', label: 'forwards to targetPort 8080' }
      ],
      legend: [
        { role: 'active', label: 'current focus' },
        { role: 'visited', label: 'created/verified' },
        { role: 'success', label: 'working access path' },
        { role: 'warning', label: 'relationship to inspect carefully' }
      ],
      frames: [
        {
          title: 'Create an isolated practice space',
          activeNodes: ['namespace'],
          visitedNodes: [],
          state: { label: 'Namespace', values: { name: 'kubetasker', purpose: 'group Stage 1 resources' }, helper: 'A namespace keeps the course app separate from system and unrelated objects.' },
          description: 'Everything in this stage is created inside the kubetasker namespace.'
        },
        {
          title: 'Deployment creates the running API path',
          activeNodes: ['deployment', 'replicaset', 'api-pod'],
          visitedNodes: ['namespace'],
          state: { label: 'Workload', values: { replicas: 1, image: 'msomi22/kubetasker-api:0.1.1', containerPort: 8080 }, helper: 'You create the Deployment. Kubernetes creates the ReplicaSet and Pod from that desired state.' },
          description: 'The API actually runs inside the Pod. The Deployment and ReplicaSet help keep that Pod running.'
        },
        {
          title: 'Service finds the API Pod by label',
          activeNodes: ['service', 'api-pod', 'endpoints'],
          visitedNodes: ['namespace', 'deployment', 'replicaset'],
          state: { label: 'Service selector', values: { selector: 'app=kube-tasker-api', servicePort: 80, targetPort: 8080 }, helper: 'If the selector does not match the Pod label, the Service will have no endpoints.' },
          description: 'The Service gives a stable in-cluster access point and forwards traffic to the selected API Pod.'
        },
        {
          title: 'Client pod verifies the Service through DNS',
          activeNodes: ['client', 'dns', 'service', 'api-pod'],
          visitedNodes: ['namespace', 'deployment', 'replicaset', 'endpoints'],
          state: { label: 'Verification', values: { url: 'http://kube-tasker-api/health', expected: 'API health response' }, helper: 'Inside the same namespace, kube-tasker-api resolves to the Service.' },
          description: 'The client pod calls the Service DNS name, and Kubernetes routes the request to the API Pod.'
        }
      ]
    }
  },
  body: [
    { type: 'section', title: 'Objective', content: '1. Create a dedicated namespace for the KubeTasker demo API.\n2. Deploy the KubeTasker demo API as the first application workload in the cluster.\n3. Expose the API inside the cluster using a ClusterIP Service.\n4. Run a temporary client pod in the same namespace.\n5. Verify the API through Kubernetes DNS from inside the cluster.\n6. Inspect the Deployment, ReplicaSet, Pod, Service, and Endpoints created during the exercise.' },
    { type: 'section', title: 'Builds on the previous quiz', content: 'In the preparation quiz, you created a Kubernetes practice lab and confirmed that kubectl can reach the control-plane node. In this quiz, you will use that working cluster to deploy your first demo application: the KubeTasker API.\n\nYou saw some of these KubeTasker commands during the preparation quiz as a quick smoke test to confirm the lab works. Here we slow down and study those same actions properly: what each Kubernetes object is, why it is needed, how the objects connect, and how to verify them.' },
    { type: 'section', title: 'What is KubeTasker?', content: 'KubeTasker is the demo learning application used throughout this CKAD course. It gives us a realistic API workload for practising Deployments, Services, cluster DNS, logs, configuration, probes, troubleshooting, and cleanup. It is not a built-in Kubernetes component.' },
    { type: 'section', title: 'Scenario', content: 'You are onboarding KubeTasker, a lightweight task management API used for CKAD practice. Your first task is to deploy the API into a Kubernetes namespace and verify that it is reachable from another pod inside the cluster.' },
    { type: 'section', title: 'Starting state', content: 'You already have a working Kubernetes practice cluster from the CKAD preparation quiz. `kubectl get nodes` succeeds, at least one control-plane node is Ready, and you can use `k` as shorthand for `kubectl` after the alias has been introduced. Do not repeat cloud provisioning here unless your cluster was deleted.' },
    { type: 'callout', tone: 'info', title: 'How the image is pulled', content: 'The Deployment uses the public Docker image `msomi22/kubetasker-api:0.1.1`. Kubernetes pulls this image automatically on the node when the Pod is scheduled. You do not need to manually pull the image on a managed Kubernetes node.' },
    ...command('1. Confirm cluster access', 'Before creating application objects, prove that your kubectl context points to the practice cluster and that at least one node is Ready.', 'k get nodes -o wide'),
    ...command('2. Create the namespace', 'A Namespace is like a named workspace inside the cluster. Here it isolates the course app resources from system namespaces and unrelated practice work.', 'k create namespace kubetasker --dry-run=client -o yaml | k apply -f -'),
    ...command('3. Deploy the KubeTasker API', 'A Deployment declares the application workload you want Kubernetes to run. This command asks Kubernetes to run one KubeTasker API Pod using the published practice image.', 'k create deployment kube-tasker-api --image=msomi22/kubetasker-api:0.1.1 -n kubetasker'),
    ...command('4. Verify Deployment, ReplicaSet, and Pod', 'The Deployment is your desired workload. The ReplicaSet is created by the Deployment to maintain the requested Pod count. The Pod is the actual running unit that contains the API container.', 'k -n kubetasker get deployment\nk -n kubetasker get rs\nk -n kubetasker get pods -o wide'),
    ...command('5. Expose the Deployment with a ClusterIP Service', 'A Service is a stable in-cluster access point. The Service port is 80, and it forwards to the API container target port 8080.', 'k expose deployment kube-tasker-api --name=kube-tasker-api --port=80 --target-port=8080 -n kubetasker'),
    ...command('6. Inspect the Service and Endpoints', 'The Service selector finds Pods with the matching label. Endpoints show the Pod IPs currently backing the Service. If endpoints are empty, the selector probably does not match the Pod labels.', 'k -n kubetasker get svc kube-tasker-api\nk -n kubetasker describe svc kube-tasker-api\nk -n kubetasker get endpoints kube-tasker-api'),
    ...command('7. Create a temporary client pod', 'A client pod is a small temporary test pod. It lets you test the Service from inside the cluster, which is the correct place to verify ClusterIP networking and DNS.', 'k -n kubetasker run kube-tasker-client --image=busybox:1.36 --restart=Never --command -- sleep 3600'),
    ...command('8. Wait for the client pod', 'Wait until the client pod is Ready before using exec. This avoids testing from a pod that has not started yet.', 'k -n kubetasker wait --for=condition=Ready pod/kube-tasker-client --timeout=90s'),
    ...command('9. Verify the API through Kubernetes DNS', 'Inside the same namespace, the DNS name `kube-tasker-api` resolves to the Service. Do not use localhost here because localhost would mean the client pod itself.', 'k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/health\nk -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/\nk -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/tasks/stats'),
    ...command('10. Inspect all created objects together', 'This command gives you one final picture of the objects created in the namespace: Deployment, ReplicaSet, Pod, Service, and Endpoints.', 'k -n kubetasker get deployment,rs,pod,svc,endpoints -o wide'),
    { type: 'section', title: 'Expected manifest shapes', content: 'You can solve this stage with imperative commands, but the same objects can also be represented as YAML. Read these manifests to understand what the commands created.' },
    { type: 'code', title: 'namespace.yaml', language: 'yaml', code: namespaceManifest },
    { type: 'code', title: 'api-deployment.yaml', language: 'yaml', code: deploymentManifest },
    { type: 'code', title: 'api-service.yaml', language: 'yaml', code: serviceManifest },
    { type: 'code', title: 'client-pod.yaml', language: 'yaml', code: clientPodManifest },
    { type: 'section', title: 'Beginner explanation of each Kubernetes object', content: '**Namespace**: a named space for this exercise. It keeps KubeTasker objects away from `default`, `kube-system`, and other labs.\n\n**Deployment**: the instruction that says, “Kubernetes, keep this application running.” You create the Deployment instead of manually managing a long-lived Pod.\n\n**ReplicaSet**: the helper object created by the Deployment. It keeps the requested number of matching Pods alive. In this stage, that number is one.\n\n**Pod**: the actual running unit. The KubeTasker API container runs inside the Pod and listens on port 8080.\n\n**Service**: the stable internal access point. Pods can come and go, but the Service name stays the same.\n\n**Selector**: the label rule the Service uses to find Pods. Here the Service looks for `app=kube-tasker-api`.\n\n**Endpoints**: the current Pod IPs behind the Service. If there are no endpoints, the Service is not connected to any Pod.\n\n**Client pod**: a temporary test pod. It acts like another application inside the cluster and proves that Service DNS works.\n\n**DNS name**: `kube-tasker-api` resolves inside the same namespace and points to the Service.' },
    { type: 'section', title: 'Verification: what success looks like', content: '- Namespace `kubetasker` exists.\n- Deployment `kube-tasker-api` exists and is available.\n- One API Pod is Running or Ready.\n- Service `kube-tasker-api` exists.\n- Endpoints exist for the Service.\n- The client pod can call `http://kube-tasker-api/health`.\n- `/tasks/stats` returns task statistics.\n- The root endpoint `/` returns the KubeTasker API landing response.' },
    { type: 'section', title: 'Common mistakes', content: '- Running commands in the wrong namespace.\n- Expecting `localhost` to work from the client pod.\n- Forgetting to wait for the Pod to become Ready.\n- Creating a Service with the wrong target port.\n- Confusing Service port `80` with container target port `8080`.\n- Looking for KubeTasker in `kube-system`.\n- Thinking KubeTasker is a Kubernetes component.\n- Forgetting that the preparation quiz used some of these commands only as a smoke test.' },
    ...command('Cleanup Stage 1 application resources', 'This removes the Stage 1 application resources. It does not delete the cloud cluster. Use the preparation quiz cleanup section when you want to destroy the full lab environment.', 'k delete namespace kubetasker --ignore-not-found')
  ],
  relatedConcepts: ['Namespace', 'Deployment', 'ReplicaSet', 'Pod', 'ClusterIP Service', 'selector', 'Endpoints', 'Kubernetes DNS', 'kubectl exec'],
  metadata: { reviewStatus: 'approved', visibility: ['dev', 'prod'] }
});

export default problem;
