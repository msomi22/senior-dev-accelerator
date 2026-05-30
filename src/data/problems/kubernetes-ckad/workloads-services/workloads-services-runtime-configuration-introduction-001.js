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

const configMapYaml = `apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-tasker-api-config
  namespace: kubetasker
data:
  LOG_LEVEL: info
  APP_MODE: learning
  TASK_MODE: learning
  ENABLE_SAMPLE_TASKS: 'true'
  WELCOME_MESSAGE: Welcome to KubeTasker Runtime Configuration`;

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

const secretYaml = `apiVersion: v1
kind: Secret
metadata:
  name: kube-tasker-api-secret
  namespace: kubetasker
type: Opaque
stringData:
  API_TOKEN: replace-me-in-real-labs`;

const configMapEnvYaml = `env:
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
        key: WELCOME_MESSAGE`;

const secretEnvYaml = `env:
  - name: API_TOKEN
    valueFrom:
      secretKeyRef:
        name: kube-tasker-api-secret
        key: API_TOKEN`;

const mountedConfigFileYaml = `apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-tasker-file-config
  namespace: kubetasker
data:
  app-config.yaml: |
    taskMode: learning
    welcomeMessage: Mounted config is active
    requireRuntimeConfig: false`;

const configFileMountYaml = `volumeMounts:
  - name: app-config-file
    mountPath: /etc/kubetasker
    readOnly: true
volumes:
  - name: app-config-file
    configMap:
      name: kube-tasker-file-config`;

const commandArgsYaml = `command: ['python']
args: ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8080']`;

const deploymentSnippetYaml = `apiVersion: apps/v1
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
  scenario: 'KubeTasker now runs as a workload and is reachable through a Service. In this lesson, every Kubernetes runtime configuration feature is tied to an app behavior and an app-level verification step: explain it, wire it, then prove it through KubeTasker.',
  starterThought: 'Do not stop at explaining the Kubernetes object. Ask what KubeTasker does with the value, then verify that behavior from the running app.',
  intuition: 'Runtime configuration is useful only when the application consumes it. The Kubernetes object provides the value, the Pod injects or mounts it, and KubeTasker proves the value is active through endpoints, logs, readiness, or task behavior.',
  mentalPicture: 'Think of the KubeTasker image as a sealed appliance. Kubernetes supplies switches and setup files at startup, and the app itself must show that those switches changed real behavior.',
  patternSignal: 'Use runtime configuration when KubeTasker should keep the same image but change behavior such as learning mode, log level, sample data, token-protected actions, file-based config, or readiness validation.',
  invariant: 'Every runtime configuration lesson should connect three things: the Kubernetes mechanism, the KubeTasker behavior, and the app-level verification signal.',
  finalPattern: 'Step 4: Configure KubeTasker behavior at runtime and verify the configuration from the application before moving into the hands-on broken-configuration mini-project.',
  commonMistake: 'Do not stop after kubectl shows the object exists. A ConfigMap or Secret existing in the cluster is not enough; KubeTasker must receive it, use it, and expose safe evidence that it is active.',
  commonMistakes: [
    'Creating the ConfigMap in the default namespace while the KubeTasker Deployment runs in kubetasker.',
    'Using a key name in the Deployment that does not exist in the ConfigMap or Secret.',
    'Referencing the wrong Secret name from the Pod template.',
    'Mounting the config file at one path while KubeTasker reads a different path.',
    'Overriding command or args in a way that prevents the API server process from starting.',
    'Changing configuration but forgetting that existing Pods may need a rollout restart or replacement to pick up the reference.',
    'Checking only Kubernetes resources and never verifying the result from /config/status, /ready, /tasks/stats, or app logs.',
    'Debugging by printing secret values instead of inspecting object names, keys, references, events, readiness, and safe status output.'
  ],
  edgeCases: [
    'A missing ConfigMap key can prevent Pod creation when the reference is required.',
    'A wrong mounted-file path can let the Pod start but make /config/status report that mounted config is not loaded.',
    'A wrong command can replace the image default startup process and make the container exit immediately.',
    'Secret data may exist but still be unusable if the Deployment references the wrong key.',
    'KubeTasker can be alive on /health while not ready on /ready because required runtime configuration is invalid.',
    'kubectl can show that a ConfigMap exists while the app still uses old values because Pods were not restarted.'
  ],
  complexityAnalysis: 'This is application configuration complexity. The learner should understand where KubeTasker values come from, how they enter the Pod, how the app uses them, and how to verify the result from safe app behavior before trusting the Kubernetes wiring.',
  explanation: 'This introduction explains how KubeTasker uses ConfigMaps, Secrets, environment variables, mounted config files, command, args, /config/status, /ready, logs, and task endpoints as a complete explain-and-verify workflow.',
  stepByStepBreakdown: [
    'Explain the Kubernetes runtime configuration feature.',
    'Wire the feature into the KubeTasker Deployment or Pod template.',
    'Verify from Kubernetes that the object, reference, mount, or env wiring exists.',
    'Verify from KubeTasker that the app actually consumed the configuration.',
    'Use ConfigMaps for non-sensitive KubeTasker behavior such as log level, app mode, sample tasks, task mode, and welcome message.',
    'Use Secrets for sensitive KubeTasker values such as API tokens, while verifying only token presence.',
    'Use mounted files when KubeTasker should read structured config from /etc/kubetasker/app-config.yaml.',
    'Use command and args carefully, then verify KubeTasker still starts and becomes ready.',
    'Prepare for a later CKAD mini-project where KubeTasker fails because runtime configuration is missing, mounted incorrectly, or not consumed by the app.'
  ],
  finalTakeaway: 'Runtime configuration is successful only when the running app proves it. A good CKAD answer creates the object, wires the Pod correctly, and verifies KubeTasker behavior through /config/status, /ready, /tasks/stats, root output, or logs without leaking secrets.',
  visualExplanation: 'The visual shows the stable KubeTasker image receiving environment-specific runtime configuration from Kubernetes and then proving the configuration through safe application endpoints and readiness.',
  visualWalkthrough: {
    title: 'KubeTasker runtime configuration flow',
    summary: 'See how a stable KubeTasker image receives Kubernetes runtime configuration and proves the result from the running app.',
    diagram: {
      type: 'graph',
      variant: 'kubernetes-object-relationship',
      title: 'Kubernetes config to verified KubeTasker behavior',
      description: 'A beginner-friendly map for ConfigMaps, Secrets, env vars, mounted files, command, args, /config/status, readiness, and failure signals.',
      nodes: [
        { id: 'image', label: 'KubeTasker image\napp code and defaults' },
        { id: 'deployment', label: 'Deployment\nPod template references config' },
        { id: 'configmap', label: 'ConfigMap\nmode log sample message' },
        { id: 'secret', label: 'Secret\nAPI token' },
        { id: 'env', label: 'Environment vars\nsmall app settings' },
        { id: 'files', label: 'Mounted config\n/etc/kubetasker' },
        { id: 'commandargs', label: 'command and args\nstartup behavior' },
        { id: 'pod', label: 'Pod\nconfigured container starts' },
        { id: 'status', label: '/config/status\nsafe verification' },
        { id: 'ready', label: '/ready\nconfig-valid readiness' },
        { id: 'tasks', label: '/tasks/stats\nbehavior verification' },
        { id: 'failure', label: 'Failure signal\nevents logs restart state' }
      ],
      edges: [
        { from: 'image', to: 'deployment', label: 'image selected' },
        { from: 'configmap', to: 'deployment', label: 'referenced by name and key' },
        { from: 'secret', to: 'deployment', label: 'referenced safely' },
        { from: 'deployment', to: 'env', label: 'injects values' },
        { from: 'deployment', to: 'files', label: 'mounts files' },
        { from: 'deployment', to: 'commandargs', label: 'sets startup inputs' },
        { from: 'env', to: 'pod', label: 'available at start' },
        { from: 'files', to: 'pod', label: 'available as paths' },
        { from: 'commandargs', to: 'pod', label: 'controls process start' },
        { from: 'pod', to: 'status', label: 'reports config consumed' },
        { from: 'pod', to: 'ready', label: 'reports config validity' },
        { from: 'pod', to: 'tasks', label: 'shows sample task behavior' },
        { from: 'deployment', to: 'failure', label: 'bad reference or path' },
        { from: 'pod', to: 'failure', label: 'startup or readiness issue' }
      ],
      frames: [
        {
          title: 'Explain the mechanism',
          activeNodes: ['configmap', 'secret', 'deployment'],
          visitedNodes: ['image'],
          state: { label: 'Kubernetes side', values: { ConfigMap: 'non-sensitive behavior', Secret: 'token presence', Deployment: 'wiring into Pod' }, helper: 'First understand which Kubernetes object carries the value and how the Pod references it.' },
          description: 'Kubernetes provides runtime inputs without rebuilding the KubeTasker image.'
        },
        {
          title: 'Apply it to KubeTasker',
          activeNodes: ['env', 'files', 'commandargs', 'pod'],
          visitedNodes: ['deployment', 'configmap', 'secret'],
          state: { label: 'App input shape', values: { env: 'LOG_LEVEL and APP_MODE', files: 'app-config.yaml', commandArgs: 'API startup process' }, helper: 'The input shape must match how KubeTasker expects to read configuration.' },
          description: 'The Pod starts KubeTasker with environment variables, mounted files, and startup arguments.'
        },
        {
          title: 'Verify from the app',
          activeNodes: ['status', 'ready', 'tasks'],
          visitedNodes: ['pod', 'env', 'files'],
          state: { label: 'Application proof', values: { configStatus: 'shows active non-secret config', readiness: 'passes when config is valid', tasks: 'shows sample-task behavior' }, helper: 'The lesson is complete only after KubeTasker proves the config is being used.' },
          description: 'Use app endpoints to verify real behavior, not only Kubernetes object existence.'
        },
        {
          title: 'Debug from both sides',
          activeNodes: ['failure', 'deployment', 'pod', 'ready'],
          visitedNodes: ['configmap', 'secret', 'env', 'files', 'commandargs', 'status'],
          state: { label: 'Debug signal', values: { events: 'missing object or key', logs: 'app startup error', readiness: 'not ready when config is invalid' }, helper: 'Use Kubernetes state and KubeTasker endpoints together. Do not expose secret values.' },
          description: 'Wrong names, missing keys, wrong paths, stale Pods, or bad startup overrides appear through events, logs, /ready, /config/status, and task behavior.'
        }
      ]
    }
  },
  body: [
    {
      type: 'checklist',
      title: 'Objective',
      items: [
        'I can explain a Kubernetes runtime configuration feature.',
        'I can apply that feature to KubeTasker behavior.',
        'I can verify from the running KubeTasker app that the configuration is active.',
        'I can use a ConfigMap to control KubeTasker log level, app mode, sample tasks, task mode, and welcome message.',
        'I can use a Secret to provide a sensitive KubeTasker API token and verify only that it is configured.',
        'I can use mounted files, command, args, /config/status, /ready, and /tasks/stats as app-level proof.'
      ]
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Lesson rule: explain, apply, verify from the app',
      content: 'For every Kubernetes feature in this lesson, do not stop at YAML. Explain why the object exists, apply it to KubeTasker, then verify from KubeTasker output that the app consumed it.'
    },
    {
      type: 'section',
      title: 'KubeTasker scenario',
      content: 'KubeTasker supports runtime settings for learning mode, task mode, sample task loading, welcome message, log level, API token presence, mounted config status, and readiness. That means every Kubernetes configuration object in this lesson must map to real application behavior and a verification endpoint or log signal.'
    },
    {
      type: 'comparison',
      title: 'Feature-to-app verification map',
      items: [
        { label: 'ConfigMap', content: 'Explain: stores non-sensitive settings. Apply: inject LOG_LEVEL, APP_MODE, TASK_MODE, ENABLE_SAMPLE_TASKS, and WELCOME_MESSAGE. Verify from app: /config/status, root output, /tasks/stats, and startup logs.' },
        { label: 'Secret', content: 'Explain: stores sensitive values. Apply: inject API_TOKEN. Verify from app: /config/status reports apiTokenConfigured true, while the actual token value is never shown.' },
        { label: 'Environment variables', content: 'Explain: pass small runtime values into the process. Apply: Deployment env entries feed KubeTasker startup config. Verify from app: /config/status reflects those env-driven values.' },
        { label: 'Mounted config file', content: 'Explain: provides file-based config. Apply: mount app-config.yaml under /etc/kubetasker. Verify from app: /config/status reports mountedConfigLoaded and file-derived values where applicable.' },
        { label: 'command and args', content: 'Explain: control process startup. Apply: start the KubeTasker API process with supported arguments. Verify from app: /health, /ready, and logs show the API started correctly.' },
        { label: 'Deployment wiring', content: 'Explain: connects image, env, Secret, and mounts. Apply: Pod template references all config sources. Verify from app: the Service can reach /config/status, /ready, and /tasks/stats.' }
      ]
    },
    {
      type: 'section',
      title: 'Runtime configuration mental model',
      content: 'The image answers what application code should run. Runtime configuration answers how KubeTasker should behave in this namespace, cluster, or environment. Kubernetes connects the two through the Pod template, and KubeTasker must prove the values were consumed.'
    },
    {
      type: 'comparison',
      title: 'Configuration choices',
      items: [
        { label: 'Container image', content: 'Use it for KubeTasker code, dependencies, and safe defaults. Verify by checking the running image and confirming the app responds on /health.' },
        { label: 'ConfigMap', content: 'Use it for non-sensitive app settings. Verify by changing a value, rolling the Pod, and confirming /config/status or visible app behavior changes.' },
        { label: 'Secret', content: 'Use it for sensitive app settings. Verify only presence through /config/status or protected behavior; never print the value.' },
        { label: 'Environment variable', content: 'Use it for small process-level values. Verify from /config/status first; inspect non-sensitive env directly only when needed.' },
        { label: 'Mounted file', content: 'Use it when the app expects a config file path. Verify from /config/status and logs that the file was loaded.' }
      ]
    },
    {
      type: 'section',
      title: 'Command and args explanation',
      content: 'command and args control how the container process starts. Apply them only when KubeTasker supports that startup shape, then verify from the app that /health and /ready respond. A Pod that exists is not enough; the API must actually start.'
    },
    ...yamlExample('ConfigMap example', 'Explain: this ConfigMap stores non-sensitive KubeTasker behavior. Apply: inject these keys into the Deployment. Verify from app: /config/status, /tasks/stats, startup logs, or the root endpoint should prove the values are active.', 'configmap.yaml', configMapYaml),
    {
      type: 'comparison',
      title: 'ConfigMap values: explain, apply, verify from KubeTasker',
      items: [
        { label: 'LOG_LEVEL', content: 'Explain: control logging without rebuilding the image. Apply: inject it as LOG_LEVEL. Verify from app: startup logs use the configured level and /config/status returns logLevel.' },
        { label: 'APP_MODE', content: 'Explain: tell the same image which operating style to use. Apply: inject APP_MODE=learning. Verify from app: /config/status returns appMode learning and learning-specific behavior is enabled.' },
        { label: 'TASK_MODE', content: 'Explain: control task behavior for the lab. Apply: inject TASK_MODE=learning. Verify from app: /config/status returns taskMode and task endpoints behave according to that mode.' },
        { label: 'ENABLE_SAMPLE_TASKS', content: 'Explain: decide whether demo tasks should load. Apply: inject ENABLE_SAMPLE_TASKS=true. Verify from app: /tasks/stats or task listing shows sample task counts or seeded task behavior.' },
        { label: 'WELCOME_MESSAGE', content: 'Explain: prove visible behavior can change from Kubernetes config. Apply: inject WELCOME_MESSAGE. Verify from app: /config/status or the root endpoint returns the configured message.' }
      ]
    },
    ...jsonExample('Expected safe config status response', 'After the Deployment injects ConfigMap and Secret values, KubeTasker should expose safe verification output. This is app proof. Notice that the Secret value is not shown; only apiTokenConfigured is reported.', 'config-status-response.json', configStatusJson),
    ...yamlExample('Secret example', 'Explain: this Secret stores a sensitive token. Apply: inject API_TOKEN into KubeTasker from secretKeyRef. Verify from app: /config/status should report apiTokenConfigured true, but no endpoint or log should reveal the token value.', 'secret.yaml', secretYaml),
    {
      type: 'comparison',
      title: 'Secret usage and verification from KubeTasker',
      items: [
        { label: 'Why it exists', content: 'KubeTasker may need a token for protected demo behavior, but the token must not be stored in a ConfigMap or printed in lesson output.' },
        { label: 'How the app uses it', content: 'The app reads API_TOKEN from its environment and enables token-aware behavior, such as a protected demo endpoint or token presence validation.' },
        { label: 'How to verify from app', content: 'Call /config/status and confirm apiTokenConfigured is true. Optionally call the protected demo endpoint with and without the token. Never print the token value.' }
      ]
    },
    ...yamlExample('Mounted config file example', 'Explain: this ConfigMap provides a structured file. Apply: mount it into /etc/kubetasker. Verify from app: /config/status should report mountedConfigLoaded true and logs should show the config file was loaded.', 'file-config-configmap.yaml', mountedConfigFileYaml),
    {
      type: 'comparison',
      title: 'Mounted file usage and verification from KubeTasker',
      items: [
        { label: 'Why it exists', content: 'Some apps need structured config files instead of many small env vars. KubeTasker uses this to practice file-based runtime configuration.' },
        { label: 'How the app uses it', content: 'KubeTasker reads /etc/kubetasker/app-config.yaml at startup and merges supported values with env/default config.' },
        { label: 'How to verify from app', content: 'Call /config/status and confirm mountedConfigLoaded true. Check logs for a safe message that the config file was loaded. If the path is wrong, readiness or status should show the problem.' }
      ]
    },
    ...yamlExample('ConfigMap values as environment variables', 'Explain: env vars pass small values into the KubeTasker process. Apply: each env entry maps a ConfigMap key to an app environment variable. Verify from app: /config/status should show the same values after the Pod starts.', 'configmap-env-snippet.yaml', configMapEnvYaml),
    {
      type: 'comparison',
      title: 'Environment variable usage and verification from KubeTasker',
      items: [
        { label: 'Why it exists', content: 'KubeTasker needs simple runtime values available immediately when the process starts.' },
        { label: 'How the app uses it', content: 'The app reads environment variables during startup and builds its runtime configuration object.' },
        { label: 'How to verify from app', content: 'Call /config/status first. It should show logLevel, appMode, taskMode, sampleTasksEnabled, and welcomeMessage. Direct printenv checks are only a backup for non-sensitive values.' }
      ]
    },
    ...yamlExample('Secret value as an environment variable', 'Explain: secretKeyRef passes sensitive values into the app without hard-coding them in the Deployment. Apply: API_TOKEN comes from the Secret. Verify from app: /config/status confirms presence only.', 'secret-env-snippet.yaml', secretEnvYaml),
    ...yamlExample('ConfigMap mounted as files', 'Explain: the volume and mount make ConfigMap data available as files. Apply: KubeTasker reads /etc/kubetasker/app-config.yaml. Verify from app: /config/status and logs confirm the file was loaded.', 'configmap-file-mount-snippet.yaml', configFileMountYaml),
    ...yamlExample('Command and args startup snippet', 'Explain: command and args can replace image defaults. Apply: use only a supported KubeTasker startup command. Verify from app: /health, /ready, and logs prove the API process started correctly.', 'command-args-snippet.yaml', commandArgsYaml),
    {
      type: 'comparison',
      title: 'Command and args usage and verification from KubeTasker',
      items: [
        { label: 'Why it exists', content: 'Labs sometimes need to show how Kubernetes controls the container startup process.' },
        { label: 'How the app uses it', content: 'KubeTasker starts the API server process using the supplied command and args instead of relying only on image defaults.' },
        { label: 'How to verify from app', content: 'Call /health and /ready. If command or args are wrong, logs and Pod state should show startup failure, and the app endpoints will not respond.' }
      ]
    },
    ...yamlExample('Small Deployment wiring example', 'Explain: this valid Deployment ties the whole runtime configuration story together. Apply: it selects the KubeTasker image, injects ConfigMap and Secret values, and mounts file config. Verify from app: access /config/status, /ready, and /tasks/stats through the Service.', 'deployment-runtime-config-snippet.yaml', deploymentSnippetYaml),
    {
      type: 'comparison',
      title: 'Deployment wiring verification from KubeTasker',
      items: [
        { label: 'Kubernetes proof', content: 'Use describe deploy and describe pod to confirm env refs, secret refs, volumes, mounts, image, selector, and labels.' },
        { label: 'Application proof', content: 'Use /config/status to confirm injected values, /ready to confirm config validity, and /tasks/stats to confirm behavior affected by ENABLE_SAMPLE_TASKS.' },
        { label: 'Rollout proof', content: 'After changing runtime config, restart or roll the Pod, then verify the new app behavior. Do not trust the ConfigMap update until KubeTasker shows the new values.' }
      ]
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'Do not expose secret values while debugging',
      content: 'For CKAD practice, prove that a Secret exists, has the expected key, is referenced by the Deployment, and appears as configured in /config/status. Avoid commands that print sensitive values from the Secret or from the running container environment.'
    },
    ...command('1. Show ConfigMaps in the namespace', 'Kubernetes proof: confirms the ConfigMap object exists. App proof still required: /config/status must later show the app consumed the values.', 'k -n kubetasker get configmaps'),
    ...command('2. Describe the app ConfigMap', 'Kubernetes proof: confirms the expected keys exist. App proof still required: KubeTasker should return matching values from /config/status after the Pod is running with this ConfigMap.', 'k -n kubetasker describe configmap kube-tasker-api-config'),
    ...command('3. Show Secrets safely', 'Kubernetes proof: confirms the Secret object exists without printing values. App proof still required: /config/status should report apiTokenConfigured true.', 'k -n kubetasker get secrets'),
    ...command('4. Describe the Deployment', 'Kubernetes proof: confirms the Pod template references ConfigMaps, Secrets, volume mounts, command, and args. App proof still required: KubeTasker endpoints must show the configuration is active.', 'k -n kubetasker describe deploy kube-tasker-api'),
    ...command('5. Show Pods', 'Kubernetes proof: confirms Pods were created and whether they are Running, Pending, not Ready, or restarting. App proof still required: /health, /ready, and /config/status should respond correctly.', 'k -n kubetasker get pods -o wide'),
    ...command('6. Inspect Pod events', 'Kubernetes proof: checks detailed Pod events and container state. Use this when app proof fails, for example /ready is unhealthy or /config/status does not show expected values.', 'k -n kubetasker describe pod <pod-name>'),
    ...command('7. Read application logs', 'App proof: checks what KubeTasker reported during startup. Logs should safely confirm active mode, config loading, readiness decisions, or startup errors without printing secrets.', 'k -n kubetasker logs <pod-name>'),
    ...command('8. Verify KubeTasker config status safely', 'App proof: confirms the application consumed runtime config. The response should show logLevel, appMode, taskMode, sampleTasksEnabled, welcomeMessage, token presence, mounted config status, and readiness without exposing secret values.', 'k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/config/status'),
    ...command('9. Verify KubeTasker readiness', 'App proof: confirms whether KubeTasker considers the runtime configuration valid enough to receive traffic.', 'k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/ready'),
    ...command('10. Verify sample task behavior', 'App proof: confirms whether ENABLE_SAMPLE_TASKS changed visible task behavior. Sample task counts should be visible through task stats or listing endpoints.', 'k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/tasks/stats'),
    ...command('11. Verify visible welcome behavior', 'App proof: confirms whether WELCOME_MESSAGE changed visible output. The root endpoint or config status should reflect the configured message.', 'k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/'),
    ...command('12. Inspect a non-sensitive environment value', 'Low-level proof only: this checks one non-sensitive environment variable from inside the Pod. Prefer /config/status because it proves the app consumed the value, not just that the variable exists.', 'k -n kubetasker exec <pod-name> -- printenv LOG_LEVEL'),
    {
      type: 'comparison',
      title: 'Failure interpretation: always pair Kubernetes symptoms with app verification',
      items: [
        { label: 'ConfigMap not found', content: 'Kubernetes symptom: events may show missing ConfigMap. App verification: /config/status will not show expected appMode, logLevel, or feature flags because the app did not receive them.' },
        { label: 'Key not found', content: 'Kubernetes symptom: Pod creation or env injection may fail. App verification: if the Pod starts with defaults, /config/status exposes the wrong or missing value.' },
        { label: 'Mount path wrong', content: 'Kubernetes symptom: volume may be mounted somewhere unexpected. App verification: /config/status reports mountedConfigLoaded false or logs show the file path was not found.' },
        { label: 'Secret reference wrong', content: 'Kubernetes symptom: events may show missing Secret or key. App verification: /config/status reports apiTokenConfigured false while never exposing the token.' },
        { label: 'Command or args wrong', content: 'Kubernetes symptom: container exits or restarts. App verification: /health and /ready do not respond, and logs explain the startup failure.' },
        { label: 'Pod Running but not Ready', content: 'Kubernetes symptom: Pod process exists but readiness fails. App verification: /ready explains configuration validity, while /config/status shows which config was loaded.' }
      ]
    },
    {
      type: 'checklist',
      title: 'Common mistakes to avoid',
      items: [
        'ConfigMap exists, but KubeTasker /config/status still shows old values because the Pod was not restarted.',
        'Deployment key name does not match the ConfigMap or Secret key.',
        'Secret exists, but KubeTasker reports apiTokenConfigured false because the Deployment references the wrong Secret or key.',
        'Mounted file path is different from what KubeTasker expects, so mountedConfigLoaded remains false.',
        'command or args override the image startup behavior incorrectly, so /health and /ready never respond.',
        'Learner checks kubectl output only and never verifies from KubeTasker behavior.',
        'Learner prints secret values instead of verifying safe token presence.'
      ]
    },
    {
      type: 'callout',
      tone: 'success',
      title: 'How this prepares you for the mini-project',
      content: 'The later runtime configuration mini-project will be hands-on. You will fix KubeTasker when configuration is missing, referenced incorrectly, injected in the wrong shape, mounted at the wrong path, not picked up by a running Pod, or causing readiness to fail. The habit is always the same: explain it, apply it, verify from the app.'
    },
    {
      type: 'section',
      title: 'Final takeaway',
      content: 'A good CKAD answer does not only create YAML. It proves the object exists, proves the Pod template references it, and then proves KubeTasker consumed it through /config/status, /ready, /tasks/stats, root output, or safe startup logs. Kubernetes wiring is complete only when the app behavior confirms it.'
    }
  ]
});

export default problem;
