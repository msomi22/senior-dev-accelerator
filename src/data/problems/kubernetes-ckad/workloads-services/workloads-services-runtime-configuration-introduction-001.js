import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const prompt = 'Configure KubeTasker at runtime using ConfigMaps, Secrets, environment variables, mounted files, command, and args.';

function command(title, explanation, code, language = 'bash') {
  return [
    { type: 'section', title, content: explanation },
    { type: 'code', title, language, code }
  ];
}

function yamlExample(title, explanation, filename, code) {
  return [
    { type: 'section', title, content: explanation },
    { type: 'code', title: filename, filename, language: 'yaml', code }
  ];
}

function jsonExample(title, explanation, filename, code) {
  return [
    { type: 'section', title, content: explanation },
    { type: 'code', title: filename, filename, language: 'json', code }
  ];
}

const namespaceYaml = `apiVersion: v1
kind: Namespace
metadata:
  name: kubetasker
  # KubeTasker resources in this lesson live in one namespace so Service DNS,
  # ConfigMap references, Secret references, and Pod lookup commands all match.`;

const configMapYaml = `apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-tasker-api-config
  namespace: kubetasker
data:
  # Used by KubeTasker to set runtime log verbosity.
  # Verify from app: /config/status should show logLevel: info.
  LOG_LEVEL: info

  # Used by KubeTasker to enable learning-mode behavior for this CKAD lesson.
  # Verify from app: /config/status should show appMode: learning.
  APP_MODE: learning

  # Used by KubeTasker to select task behavior for this lab.
  # Verify from app: /config/status should show taskMode: learning.
  TASK_MODE: learning

  # Used by KubeTasker to decide whether sample/demo tasks are loaded.
  # Verify from app: /tasks/stats should show sample task behavior.
  ENABLE_SAMPLE_TASKS: 'true'

  # Used by KubeTasker as visible runtime output.
  # Verify from app: /config/status or / should show this message.
  WELCOME_MESSAGE: Welcome to KubeTasker Runtime Configuration`;

const secretYaml = `apiVersion: v1
kind: Secret
metadata:
  name: kube-tasker-api-secret
  namespace: kubetasker
type: Opaque
stringData:
  # Used by KubeTasker for token-aware/protected demo behavior.
  # Verify from app: /config/status should show apiTokenConfigured: true.
  # Do not verify by printing this value from the Secret or container env.
  API_TOKEN: replace-me-in-real-labs`;

const mountedConfigFileYaml = `apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-tasker-file-config
  namespace: kubetasker
data:
  # Mounted into the container as /etc/kubetasker/app-config.yaml.
  # Used by KubeTasker when it needs structured file-based runtime config.
  # Verify from app: /config/status should show mountedConfigLoaded: true.
  app-config.yaml: |
    taskMode: learning
    welcomeMessage: Mounted config is active
    requireRuntimeConfig: false`;

const deploymentYaml = `apiVersion: apps/v1
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
          # v0.2.0 is required for this runtime-configuration lesson only.
          image: msomi22/kubetasker-api:0.2.0
          ports:
            - containerPort: 8080
          env:
            # KubeTasker reads this from the process environment.
            # Verify from app: /config/status.logLevel.
            - name: LOG_LEVEL
              valueFrom:
                configMapKeyRef:
                  name: kube-tasker-api-config
                  key: LOG_LEVEL

            # KubeTasker reads this to enable learning behavior.
            # Verify from app: /config/status.appMode.
            - name: APP_MODE
              valueFrom:
                configMapKeyRef:
                  name: kube-tasker-api-config
                  key: APP_MODE

            # KubeTasker reads this to choose task behavior.
            # Verify from app: /config/status.taskMode.
            - name: TASK_MODE
              valueFrom:
                configMapKeyRef:
                  name: kube-tasker-api-config
                  key: TASK_MODE

            # KubeTasker reads this to decide whether sample tasks should load.
            # Verify from app: /config/status.sampleTasksEnabled and /tasks/stats.
            - name: ENABLE_SAMPLE_TASKS
              valueFrom:
                configMapKeyRef:
                  name: kube-tasker-api-config
                  key: ENABLE_SAMPLE_TASKS

            # KubeTasker reads this as visible runtime output.
            # Verify from app: /config/status.welcomeMessage or /.
            - name: WELCOME_MESSAGE
              valueFrom:
                configMapKeyRef:
                  name: kube-tasker-api-config
                  key: WELCOME_MESSAGE

            # KubeTasker reads this as a sensitive token.
            # Verify from app: /config/status.apiTokenConfigured only.
            # Never print the token value.
            - name: API_TOKEN
              valueFrom:
                secretKeyRef:
                  name: kube-tasker-api-secret
                  key: API_TOKEN
          volumeMounts:
            # KubeTasker reads /etc/kubetasker/app-config.yaml from this mount.
            # Verify from app: /config/status.mountedConfigLoaded.
            - name: app-config-file
              mountPath: /etc/kubetasker
              readOnly: true
      volumes:
        - name: app-config-file
          configMap:
            name: kube-tasker-file-config`;

const serviceYaml = `apiVersion: v1
kind: Service
metadata:
  name: kube-tasker-api
  namespace: kubetasker
spec:
  selector:
    app: kube-tasker-api
  ports:
    - name: http
      port: 80
      targetPort: 8080
  # Used by the verification client to reach KubeTasker by DNS name.
  # Verify from app: wget http://kube-tasker-api/config/status from inside the namespace.`;

const clientPodYaml = `apiVersion: v1
kind: Pod
metadata:
  name: kube-tasker-client
  namespace: kubetasker
spec:
  restartPolicy: Never
  containers:
    - name: client
      image: busybox:1.36
      command: ['sh', '-c', 'sleep 3600']
  # Used only as a simple in-cluster client for app verification commands.
  # Verify from app: exec into this Pod and call the KubeTasker Service.`;

const commandArgsYaml = `apiVersion: apps/v1
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
          image: msomi22/kubetasker-api:0.2.0
          # Overrides the image startup command.
          # Used by KubeTasker only when this is the supported app startup shape.
          # Verify from app: /health and /ready should still respond.
          command: ['python']
          args: ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8080']
          ports:
            - containerPort: 8080
          env:
            - name: LOG_LEVEL
              valueFrom:
                configMapKeyRef:
                  name: kube-tasker-api-config
                  key: LOG_LEVEL
            - name: APP_MODE
              valueFrom:
                configMapKeyRef:
                  name: kube-tasker-api-config
                  key: APP_MODE
            - name: TASK_MODE
              valueFrom:
                configMapKeyRef:
                  name: kube-tasker-api-config
                  key: TASK_MODE
            - name: ENABLE_SAMPLE_TASKS
              valueFrom:
                configMapKeyRef:
                  name: kube-tasker-api-config
                  key: ENABLE_SAMPLE_TASKS
            - name: WELCOME_MESSAGE
              valueFrom:
                configMapKeyRef:
                  name: kube-tasker-api-config
                  key: WELCOME_MESSAGE
            - name: API_TOKEN
              valueFrom:
                secretKeyRef:
                  name: kube-tasker-api-secret
                  key: API_TOKEN
          volumeMounts:
            - name: app-config-file
              mountPath: /etc/kubetasker
              readOnly: true
      volumes:
        - name: app-config-file
          configMap:
            name: kube-tasker-file-config`;

const configStatusJson = `{
  "appMode": "learning",
  "taskMode": "learning",
  "logLevel": "info",
  "sampleTasksEnabled": true,
  "welcomeMessage": "Welcome to KubeTasker Runtime Configuration",
  "apiTokenConfigured": true,
  "mountedConfigLoaded": true,
  "ready": true
}`;

const problem = defineLearningProblem({
  id: 'workloads-services-runtime-configuration-introduction-001',
  category: 'kubernetes-ckad',
  topicId: 'workloads-services',
  title: 'Step 4: Runtime Configuration Introduction',
  difficulty: 'Easy',
  estimatedTime: '30 min',
  estimatedTimeSeconds: 1800,
  type: 'learning',
  tags: [
    'kubernetes-ckad',
    'runtime-configuration',
    'configmap',
    'secret',
    'environment-variables',
    'volume-mounts',
    'command-args',
    'readiness',
    'debugging',
    'workloads-services',
    'kubetasker'
  ],
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod']
  },
  rendering: { variant: 'deep-dive', density: 'comfortable', accent: 'green' },
  prompt,
  question: prompt,
  scenario: 'KubeTasker now runs as a workload and is reachable through a Service. In this lesson, each YAML block includes comments showing what the app uses, followed by kubectl commands to apply it and verify the result from the running app.',
  starterThought: 'Do not stop at explaining YAML. Read the comments in the manifest, apply the manifest, then prove KubeTasker consumed the configuration from app endpoints or logs.',
  intuition: 'Runtime configuration is useful only when the app consumes it. Kubernetes stores, injects, or mounts values; KubeTasker proves those values are active through /config/status, /ready, /tasks/stats, root output, and logs.',
  mentalPicture: 'Think of each manifest as a contract: comments say what KubeTasker expects, kubectl applies the contract, and app endpoints prove the contract is working.',
  patternSignal: 'For each runtime configuration feature, use this sequence: manifest comments, kubectl apply, Kubernetes wiring check, app-level verification.',
  invariant: 'The work is complete only when KubeTasker behavior confirms the configuration, not merely when kubectl shows an object exists.',
  commonMistake: 'Checking only the Kubernetes object and not checking /config/status, /ready, /tasks/stats, root output, or logs.',
  explanation: 'This lesson uses YAML comments plus kubectl apply and verification commands to show how KubeTasker consumes ConfigMaps, Secrets, environment variables, mounted files, command, args, Services, and readiness configuration.',
  stepByStepBreakdown: [
    'Read the comments inside the YAML to see which KubeTasker behavior depends on each field.',
    'Apply the YAML with kubectl.',
    'Check Kubernetes wiring with get or describe commands.',
    'Verify from KubeTasker endpoints or logs that the app consumed the configuration.',
    'Move to the next manifest and repeat the same pattern.'
  ],
  finalTakeaway: 'A good CKAD runtime configuration answer is not just valid YAML. It is valid YAML plus proof from the running app that the configuration was consumed safely.',
  visualExplanation: 'The flow is manifest comments, kubectl apply, Kubernetes wiring check, then KubeTasker verification.',
  visualWalkthrough: {
    title: 'Runtime configuration verification loop',
    summary: 'Every YAML block follows the same loop: comment, apply, inspect, verify from KubeTasker.',
    diagram: {
      type: 'graph',
      variant: 'kubernetes-object-relationship',
      title: 'YAML to verified app behavior',
      nodes: [
        { id: 'yaml', label: 'YAML comments\nwhat the app uses' },
        { id: 'apply', label: 'kubectl apply\ncreate or update resource' },
        { id: 'inspect', label: 'kubectl inspect\nobject and wiring exist' },
        { id: 'app', label: 'KubeTasker endpoint\napp consumed config' },
        { id: 'logs', label: 'KubeTasker logs\nsafe startup evidence' }
      ],
      edges: [
        { from: 'yaml', to: 'apply', label: 'apply manifest' },
        { from: 'apply', to: 'inspect', label: 'check Kubernetes state' },
        { from: 'inspect', to: 'app', label: 'verify behavior' },
        { from: 'inspect', to: 'logs', label: 'debug startup' }
      ]
    }
  },
  body: [
    {
      type: 'checklist',
      title: 'Objective',
      items: [
        'I can read YAML comments to understand what KubeTasker uses from each manifest.',
        'I can apply each manifest with kubectl.',
        'I can verify Kubernetes wiring with get and describe commands.',
        'I can verify app behavior from /config/status, /ready, /tasks/stats, /, and logs.',
        'I can avoid leaking Secret values while still proving the app received a Secret.'
      ]
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Lesson rule',
      content: 'Each step follows the same shape: read the YAML comments, apply the YAML, then verify from KubeTasker. Avoid separate theory blocks that explain values without showing how to run and verify them.'
    },
    ...yamlExample('1. Namespace manifest', 'The namespace keeps all KubeTasker runtime configuration resources together. Read the YAML comments, then apply it.', 'namespace.yaml', namespaceYaml),
    ...command('Apply the namespace', 'Create the namespace used by all later manifests.', 'k apply -f namespace.yaml'),
    ...command('Verify the namespace', 'Kubernetes proof: the namespace exists and later objects should be created inside it.', 'k get ns kubetasker'),

    ...yamlExample('2. ConfigMap manifest', 'The comments inside this YAML show exactly which values KubeTasker uses and which app endpoint proves each value is active.', 'configmap.yaml', configMapYaml),
    ...command('Apply the ConfigMap', 'Create or update the non-sensitive runtime settings used by KubeTasker.', 'k apply -f configmap.yaml'),
    ...command('Verify the ConfigMap exists', 'Kubernetes proof: confirm the object and keys exist in the correct namespace.', 'k -n kubetasker describe configmap kube-tasker-api-config'),
    ...command('Apply ConfigMap changes to a running app', 'When the Deployment already exists, restart it so env values are loaded by a new Pod.', `k -n kubetasker rollout restart deploy/kube-tasker-api
k -n kubetasker rollout status deploy/kube-tasker-api`),
    ...command('Verify ConfigMap values from the app', 'App proof: KubeTasker must show that it consumed the ConfigMap values.', `k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/config/status
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/tasks/stats
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/`),

    ...yamlExample('3. Secret manifest', 'The Secret provides sensitive runtime input. The YAML comments show how KubeTasker uses it and how to verify it without printing the token.', 'secret.yaml', secretYaml),
    ...command('Apply the Secret', 'Create or update the sensitive value used by KubeTasker.', 'k apply -f secret.yaml'),
    ...command('Verify the Secret exists without printing it', 'Kubernetes proof: confirm the Secret exists and has data without revealing the value.', `k -n kubetasker get secret kube-tasker-api-secret
k -n kubetasker describe secret kube-tasker-api-secret`),
    ...command('Apply Secret changes to a running app', 'When the Deployment already exists, restart it so Secret-backed env values are loaded by a new Pod.', `k -n kubetasker rollout restart deploy/kube-tasker-api
k -n kubetasker rollout status deploy/kube-tasker-api`),
    ...command('Verify Secret usage from the app', 'App proof: KubeTasker should report only token presence. It must not return or log the token value.', 'k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/config/status'),

    ...yamlExample('4. Mounted config file manifest', 'This ConfigMap becomes a file inside the container. The comments show the file path KubeTasker reads and the app signal used to verify it.', 'file-config-configmap.yaml', mountedConfigFileYaml),
    ...command('Apply the mounted file ConfigMap', 'Create or update the ConfigMap that will be mounted as /etc/kubetasker/app-config.yaml.', 'k apply -f file-config-configmap.yaml'),
    ...command('Verify the file ConfigMap exists', 'Kubernetes proof: confirm the ConfigMap contains app-config.yaml.', 'k -n kubetasker describe configmap kube-tasker-file-config'),
    ...command('Apply mounted config changes to a running app', 'When the Deployment already exists, restart it so startup logs and /config/status clearly reflect the file content.', `k -n kubetasker rollout restart deploy/kube-tasker-api
k -n kubetasker rollout status deploy/kube-tasker-api`),
    ...command('Verify mounted file usage from the app', 'App proof: KubeTasker should report mountedConfigLoaded: true and logs should safely mention config file loading.', `k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/config/status
k -n kubetasker logs deploy/kube-tasker-api`),

    ...yamlExample('5. Deployment manifest', 'The Deployment wires the KubeTasker v0.2.0 image to ConfigMap values, Secret values, and the mounted config file for this lesson.', 'deployment.yaml', deploymentYaml),
    ...command('Apply the Deployment', 'Create or update the KubeTasker API Deployment.', `k apply -f deployment.yaml
k -n kubetasker rollout status deploy/kube-tasker-api`),
    ...command('Verify Deployment wiring', 'Kubernetes proof: confirm selector, labels, env refs, Secret refs, volume, and mount are present.', `k -n kubetasker describe deploy kube-tasker-api
k -n kubetasker get pods -l app=kube-tasker-api -o wide`),
    ...command('Verify Deployment wiring from the app', 'App proof: confirm the running KubeTasker container consumed env values, Secret presence, and mounted config.', `k -n kubetasker logs deploy/kube-tasker-api
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/config/status`),

    ...yamlExample('6. Service manifest', 'The Service gives in-cluster clients a stable DNS name for KubeTasker. The comments show how the verification client will use it.', 'service.yaml', serviceYaml),
    ...command('Apply the Service', 'Create the stable in-cluster access point for KubeTasker.', 'k apply -f service.yaml'),
    ...command('Verify the Service selects the Pod', 'Kubernetes proof: endpoints should point to the KubeTasker Pod.', `k -n kubetasker get svc kube-tasker-api
k -n kubetasker get endpoints kube-tasker-api`),

    ...yamlExample('7. Verification client manifest', 'The client Pod exists only so learners can call the KubeTasker Service from inside the cluster.', 'client-pod.yaml', clientPodYaml),
    ...command('Apply the verification client', 'Create a simple client Pod for in-cluster app verification.', `k apply -f client-pod.yaml
k -n kubetasker wait --for=condition=Ready pod/kube-tasker-client --timeout=90s`),
    ...command('Verify KubeTasker from the client Pod', 'App proof: use the Service DNS name to call KubeTasker endpoints.', `k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/health
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/ready
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/config/status
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/tasks/stats`),

    ...jsonExample('Expected /config/status response', 'This is the kind of safe app-level proof expected after the manifests are applied. Secret values are never shown.', 'config-status-response.json', configStatusJson),

    ...yamlExample('8. Optional command and args override', 'Use this only when the app image supports the startup shape. The manifest is a full Deployment so it remains valid if copied.', 'command-args-deployment.yaml', commandArgsYaml),
    ...command('Apply the command/args Deployment', 'Replace the Deployment with the supported command/args startup form.', `k apply -f command-args-deployment.yaml
k -n kubetasker rollout status deploy/kube-tasker-api`),
    ...command('Verify command/args from the app', 'App proof: the API must still start. If command or args are wrong, /health and /ready will fail and logs will show startup errors.', `k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/health
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/ready
k -n kubetasker logs deploy/kube-tasker-api`),

    {
      type: 'comparison',
      title: 'Debugging pattern',
      items: [
        { label: 'If Kubernetes object is missing', content: 'Use get/describe first, then re-apply the YAML in the correct namespace.' },
        { label: 'If the object exists but the app shows old values', content: 'Restart or roll the Deployment, then call /config/status again.' },
        { label: 'If Secret exists but app says token is missing', content: 'Check secretKeyRef name/key in the Deployment. Do not print the token value.' },
        { label: 'If mountedConfigLoaded is false', content: 'Check the ConfigMap key, volume name, mountPath, and the path KubeTasker reads.' },
        { label: 'If Pod runs but /ready fails', content: 'Use /config/status and logs to find which required runtime configuration is invalid.' }
      ]
    },
    {
      type: 'section',
      title: 'Final takeaway',
      content: 'For this lesson style, the YAML carries its own explanation through comments. The commands below each YAML apply it and prove it. That is the habit to build for CKAD: write the manifest, apply it, inspect Kubernetes, and verify from the app.'
    }
  ]
});

export default problem;
