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
  scenario: 'KubeTasker now runs as a workload and is reachable through a Service. In this lesson, the application uses Kubernetes runtime configuration for real behavior: log level, app mode, sample task behavior, welcome message, token presence, mounted config status, and readiness.',
  starterThought: 'Do not rebuild the KubeTasker image just because the environment changed. Keep the image stable, then use Kubernetes configuration to change how KubeTasker behaves at startup.',
  intuition: 'Runtime configuration is the bridge between a reusable container image and the real environment where the app runs. The KubeTasker image contains the app. Kubernetes provides the values, files, and startup arguments that tell KubeTasker how to behave now.',
  mentalPicture: 'Think of the KubeTasker image as a sealed appliance. ConfigMaps, Secrets, environment variables, mounted files, command, and args are the switches and setup instructions applied when the appliance starts in a specific cluster.',
  patternSignal: 'Use runtime configuration when KubeTasker should keep the same image but change environment-specific behavior such as learning mode, log level, sample data, token-protected actions, file-based config, or readiness validation.',
  invariant: 'The KubeTasker container image should stay stable while environment-specific behavior comes from Kubernetes runtime configuration.',
  finalPattern: 'Step 4: Configure KubeTasker behavior at runtime before moving into the hands-on broken-configuration mini-project.',
  commonMistake: 'Do not print secret values while debugging. Prove the Secret exists and is referenced correctly by checking metadata, keys, /config/status, readiness, events, and logs without exposing the token.',
  commonMistakes: [
    'Creating the ConfigMap in the default namespace while the KubeTasker Deployment runs in kubetasker.',
    'Using a key name in the Deployment that does not exist in the ConfigMap or Secret.',
    'Referencing the wrong Secret name from the Pod template.',
    'Mounting the config file at one path while KubeTasker reads a different path.',
    'Overriding command or args in a way that prevents the API server process from starting.',
    'Changing configuration but forgetting that existing Pods may need a rollout restart or replacement to pick up the reference.',
    'Debugging by printing secret values instead of inspecting object names, keys, references, events, readiness, and safe status output.'
  ],
  edgeCases: [
    'A missing ConfigMap key can prevent Pod creation when the reference is required.',
    'A wrong mounted-file path can let the Pod start but make /config/status report that mounted config is not loaded.',
    'A wrong command can replace the image default startup process and make the container exit immediately.',
    'Secret data may exist but still be unusable if the Deployment references the wrong key.',
    'KubeTasker can be alive on /health while not ready on /ready because required runtime configuration is invalid.'
  ],
  complexityAnalysis: 'This is application configuration complexity. The learner should understand where KubeTasker values come from, how they enter the Pod, how the app reports safe configuration status, and how Kubernetes exposes mistakes through readiness, Pod state, events, and logs.',
  explanation: 'This introduction explains how KubeTasker uses ConfigMaps, Secrets, environment variables, mounted config files, command, args, /config/status, /ready, and common configuration failure signals in Kubernetes workloads.',
  stepByStepBreakdown: [
    'Separate KubeTasker application code from environment-specific configuration.',
    'Use ConfigMaps for non-sensitive KubeTasker behavior such as log level, app mode, sample tasks, task mode, and welcome message.',
    'Use Secrets for sensitive KubeTasker values such as API tokens.',
    'Inject small KubeTasker settings as environment variables when the app expects environment input.',
    'Mount configuration as files when KubeTasker should read config from /etc/kubetasker/app-config.yaml.',
    'Use command and args carefully because they can replace the image startup behavior.',
    'Use /config/status and /ready to verify runtime configuration without leaking secrets.',
    'Inspect ConfigMaps, Secrets, Deployments, Pods, events, and logs without exposing secret values.',
    'Prepare for a later CKAD mini-project where KubeTasker fails because runtime configuration is missing or mounted incorrectly.'
  ],
  finalTakeaway: 'Runtime configuration lets one trusted KubeTasker image run safely in many environments. In CKAD practice, the job is to create the right configuration objects, reference them correctly, mount or inject them correctly, and verify KubeTasker behavior without leaking secrets.',
  visualExplanation: 'The visual shows the stable KubeTasker image receiving environment-specific runtime configuration from a Deployment, ConfigMap, Secret, env vars, mounted files, command, and args before the app reaches a ready state.',
  visualWalkthrough: {
    title: 'KubeTasker runtime configuration flow',
    summary: 'See how a stable KubeTasker image receives Kubernetes runtime configuration and becomes a correctly configured Pod.',
    diagram: {
      type: 'graph',
      variant: 'kubernetes-object-relationship',
      title: 'KubeTasker image to configured running Pod',
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
        { from: 'pod', to: 'status', label: 'reports safe config state' },
        { from: 'pod', to: 'ready', label: 'reports config validity' },
        { from: 'deployment', to: 'failure', label: 'bad reference or path' },
        { from: 'pod', to: 'failure', label: 'startup or readiness issue' }
      ],
      frames: [
        {
          title: 'Stable image first',
          activeNodes: ['image'],
          visitedNodes: [],
          state: { label: 'Invariant', values: { image: 'KubeTasker code and safe defaults', environment: 'provided later' }, helper: 'The image should not be rebuilt just to change log level, learning mode, sample data, or welcome text.' },
          description: 'The container image carries the reusable application. Environment-specific KubeTasker behavior is supplied at runtime.'
        },
        {
          title: 'Deployment wires KubeTasker configuration',
          activeNodes: ['deployment', 'configmap', 'secret'],
          visitedNodes: ['image'],
          state: { label: 'References', values: { ConfigMap: 'mode and app behavior', Secret: 'API token presence', Deployment: 'Pod template wiring' }, helper: 'The Deployment points the Pod template to configuration objects instead of baking values into the image.' },
          description: 'The Pod template references ConfigMaps and Secrets by name and key so values can enter KubeTasker at startup.'
        },
        {
          title: 'Values enter the Pod',
          activeNodes: ['env', 'files', 'commandargs', 'pod'],
          visitedNodes: ['deployment', 'configmap', 'secret'],
          state: { label: 'Runtime inputs', values: { env: 'LOG_LEVEL and APP_MODE', files: 'mounted app-config.yaml', commandArgs: 'startup behavior' }, helper: 'Choose the input shape that matches how KubeTasker expects to read configuration.' },
          description: 'Configuration can appear as environment variables, mounted files, or startup command and args.'
        },
        {
          title: 'KubeTasker reports safe status',
          activeNodes: ['pod', 'status', 'ready'],
          visitedNodes: ['image', 'deployment', 'env', 'files'],
          state: { label: 'Verification', values: { configStatus: 'shows non-secret config', readiness: 'passes only when required config is valid' }, helper: 'Use app endpoints to prove behavior without leaking secret values.' },
          description: 'KubeTasker exposes safe verification endpoints so learners can connect Kubernetes configuration to application behavior.'
        },
        {
          title: 'Bad configuration creates symptoms',
          activeNodes: ['failure', 'deployment', 'pod', 'ready'],
          visitedNodes: ['configmap', 'secret', 'env', 'files', 'commandargs'],
          state: { label: 'Debug signal', values: { events: 'missing object or key', logs: 'app startup error', readiness: 'not ready when config is invalid' }, helper: 'Use read-only inspection first. Do not expose secret values while debugging.' },
          description: 'Wrong names, missing keys, wrong paths, or bad startup overrides appear in Pod events, status, logs, /ready, and /config/status.'
        }
      ]
    }
  },
  body: [
    {
      type: 'checklist',
      title: 'Objective',
      items: [
        'I can explain why KubeTasker runtime behavior should not be baked into the container image.',
        'I can use a ConfigMap to control KubeTasker log level, app mode, sample tasks, task mode, and welcome message.',
        'I can use a Secret to provide a sensitive KubeTasker API token without exposing the token value.',
        'I can choose when KubeTasker should read configuration from environment variables or mounted files.',
        'I can explain how command and args affect KubeTasker startup behavior.',
        'I can use /config/status and /ready to connect Kubernetes configuration to application behavior.',
        'I can use Kubernetes inspection commands to identify common configuration mistakes safely.'
      ]
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Why this lesson exists',
      content: 'The first three lessons taught workload creation, YAML-driven changes, and Kubernetes architecture. This lesson explains the configuration layer by showing how Kubernetes changes KubeTasker behavior without rebuilding the image.'
    },
    {
      type: 'section',
      title: 'KubeTasker scenario',
      content: 'KubeTasker supports runtime settings for learning mode, task mode, sample task loading, welcome message, log level, API token presence, mounted config status, and readiness. That means every Kubernetes configuration object in this lesson maps to real application behavior.'
    },
    {
      type: 'comparison',
      title: 'How KubeTasker uses each Kubernetes feature',
      items: [
        { label: 'ConfigMap', content: 'Controls non-sensitive app behavior such as LOG_LEVEL, APP_MODE, TASK_MODE, ENABLE_SAMPLE_TASKS, and WELCOME_MESSAGE.' },
        { label: 'Secret', content: 'Provides API_TOKEN so protected demo behavior can be enabled without showing the token in YAML output, logs, or status responses.' },
        { label: 'Environment variables', content: 'Pass small runtime values directly into the KubeTasker process at container startup.' },
        { label: 'Mounted config file', content: 'Provides /etc/kubetasker/app-config.yaml when KubeTasker should load structured configuration from a file path.' },
        { label: 'command and args', content: 'Control the startup process when the lab needs to demonstrate how container entry behavior can be overridden.' },
        { label: '/config/status', content: 'Lets the learner verify active non-sensitive config, mounted config status, and whether a token is configured without exposing the token value.' },
        { label: '/ready', content: 'Shows whether KubeTasker considers its required runtime configuration valid enough to receive traffic.' }
      ]
    },
    {
      type: 'section',
      title: 'Runtime configuration mental model',
      content: 'The image answers what application code should run. Runtime configuration answers how KubeTasker should behave in this namespace, cluster, or environment. Kubernetes connects the two through the Pod template.'
    },
    {
      type: 'comparison',
      title: 'Configuration choices',
      items: [
        { label: 'Container image', content: 'Use it for KubeTasker code, dependencies, and safe defaults that should stay the same across environments.' },
        { label: 'ConfigMap', content: 'Use it for non-sensitive KubeTasker configuration such as log level, feature mode, display message, and ordinary app settings.' },
        { label: 'Secret', content: 'Use it for sensitive KubeTasker configuration such as tokens, passwords, and credentials. Verify references without printing values.' },
        { label: 'Environment variable', content: 'Use it for small values that KubeTasker expects to read from the process environment.' },
        { label: 'Mounted file', content: 'Use it when KubeTasker expects a file, a directory of config files, or a config document at a known path.' }
      ]
    },
    {
      type: 'section',
      title: 'Command and args explanation',
      content: 'command and args control how the container process starts. They are powerful because they can override the image default startup behavior. In CKAD tasks, use them carefully and verify KubeTasker still starts the intended API process.'
    },
    ...yamlExample('ConfigMap example', 'This ConfigMap stores non-sensitive KubeTasker behavior. The key point is not only that these values exist, but that each one changes something observable in the running app.', 'configmap.yaml', configMapYaml),
    {
      type: 'comparison',
      title: 'ConfigMap values: why they exist, how KubeTasker uses them, and how to verify them',
      items: [
        { label: 'LOG_LEVEL', content: 'Why: control application logging without rebuilding the image. App usage: KubeTasker configures its logger using this value. Verify: check startup logs and /config/status for logLevel.' },
        { label: 'APP_MODE', content: 'Why: tell the same image which environment style it is running in. App usage: KubeTasker can enable learning-friendly behavior and messages when APP_MODE is learning. Verify: call /config/status and confirm appMode is learning.' },
        { label: 'TASK_MODE', content: 'Why: control how task behavior should run during the lab. App usage: KubeTasker uses this to choose learning-oriented task behavior instead of hard-coded defaults. Verify: call /config/status and confirm taskMode.' },
        { label: 'ENABLE_SAMPLE_TASKS', content: 'Why: decide whether the app should load demo tasks for learners. App usage: when true, KubeTasker exposes seeded/sample task behavior for practice. Verify: call /tasks/stats or the task listing endpoint and confirm sample tasks are present.' },
        { label: 'WELCOME_MESSAGE', content: 'Why: prove visible app behavior can change from Kubernetes config. App usage: KubeTasker returns or displays this message from the running configuration. Verify: call /config/status or the root endpoint and confirm the message changed.' }
      ]
    },
    ...jsonExample('Expected safe config status response', 'After the Deployment injects ConfigMap and Secret values, KubeTasker should expose safe verification output. Notice that the Secret value is not shown; only apiTokenConfigured is reported.', 'config-status-response.json', configStatusJson),
    ...yamlExample('Secret example', 'This Secret stores a placeholder token for the learning lab. KubeTasker can report that the token is configured, but it must never return or log the token value.', 'secret.yaml', secretYaml),
    ...yamlExample('Mounted config file example', 'This ConfigMap provides a file named app-config.yaml. When mounted into /etc/kubetasker, KubeTasker can load structured file-based settings and report mountedConfigLoaded through /config/status.', 'file-config-configmap.yaml', mountedConfigFileYaml),
    ...yamlExample('ConfigMap values as environment variables', 'This snippet injects ConfigMap keys into the KubeTasker container environment. The Deployment must reference the correct ConfigMap name and keys.', 'configmap-env-snippet.yaml', configMapEnvYaml),
    ...yamlExample('Secret value as an environment variable', 'This snippet injects the Secret key into the KubeTasker container environment. Debug the reference and object metadata without printing the sensitive value.', 'secret-env-snippet.yaml', secretEnvYaml),
    ...yamlExample('ConfigMap mounted as files', 'This snippet mounts ConfigMap data as files under /etc/kubetasker. KubeTasker can read /etc/kubetasker/app-config.yaml from that mount.', 'configmap-file-mount-snippet.yaml', configFileMountYaml),
    ...yamlExample('Command and args startup snippet', 'This snippet shows the shape of command and args. Only override startup behavior when the lab or application requires it, because a wrong override can stop KubeTasker from starting.', 'command-args-snippet.yaml', commandArgsYaml),
    ...yamlExample('Small Deployment wiring example', 'This compact example is a valid apps/v1 Deployment shape. It includes selector.matchLabels and matching template.metadata.labels, then shows how the Pod template references the KubeTasker image, ConfigMap, Secret, and mounted config directory together.', 'deployment-runtime-config-snippet.yaml', deploymentSnippetYaml),
    {
      type: 'callout',
      tone: 'warning',
      title: 'Do not expose secret values while debugging',
      content: 'For CKAD practice, prove that a Secret exists, has the expected key, is referenced by the Deployment, and appears as configured in /config/status. Avoid commands that print sensitive values from the Secret or from the running container environment.'
    },
    ...command('1. Show ConfigMaps in the namespace', 'This checks whether the namespace contains ConfigMap objects. Run it first when you expect non-sensitive KubeTasker configuration to exist and want to confirm you are looking in the right namespace.', 'k -n kubetasker get configmaps'),
    ...command('2. Describe the app ConfigMap', 'This checks the ConfigMap metadata and keys without requiring you to open every value. Notice whether LOG_LEVEL, APP_MODE, TASK_MODE, ENABLE_SAMPLE_TASKS, and WELCOME_MESSAGE exist.', 'k -n kubetasker describe configmap kube-tasker-api-config'),
    ...command('3. Show Secrets safely', 'This confirms Secret objects exist in the namespace without printing secret values. Notice the Secret name and type, then compare the name with the Deployment reference.', 'k -n kubetasker get secrets'),
    ...command('4. Describe the Deployment', 'This checks how the Pod template references configuration. Look for environment variables, ConfigMap references, Secret references, volumes, volume mounts, command, args, and recent events.', 'k -n kubetasker describe deploy kube-tasker-api'),
    ...command('5. Show Pods', 'This checks whether Pods were created and whether they are Running, Pending, not Ready, or restarting. Configuration problems often appear as waiting, crash, or readiness symptoms.', 'k -n kubetasker get pods -o wide'),
    ...command('6. Inspect Pod events', 'This checks detailed Pod events and container state. Replace the placeholder with the real Pod name from the previous command, then look for missing ConfigMap, missing Secret, missing key, mount, or startup errors.', 'k -n kubetasker describe pod <pod-name>'),
    ...command('7. Read application logs', 'This checks what KubeTasker reported during startup. Replace the placeholder with the real Pod name and look for configuration parsing, missing file, or invalid startup argument messages.', 'k -n kubetasker logs <pod-name>'),
    ...command('8. Verify KubeTasker config status safely', 'This calls the app status endpoint through the Service. The response should show logLevel, appMode, taskMode, sampleTasksEnabled, welcomeMessage, token presence, mounted config status, and readiness without exposing secret values.', 'k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/config/status'),
    ...command('9. Verify KubeTasker readiness', 'This confirms whether KubeTasker considers the runtime configuration valid enough to receive traffic.', 'k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/ready'),
    ...command('10. Verify sample task behavior', 'This confirms whether ENABLE_SAMPLE_TASKS changed visible task behavior. The exact output depends on the app implementation, but sample task counts should be visible through task stats or listing endpoints.', 'k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/tasks/stats'),
    ...command('11. Inspect a non-sensitive environment value', 'This checks one safe environment variable from inside the Pod. Only use this approach for non-sensitive values such as log level, never for tokens or passwords.', 'k -n kubetasker exec <pod-name> -- printenv LOG_LEVEL'),
    {
      type: 'comparison',
      title: 'Failure interpretation',
      items: [
        { label: 'ConfigMap not found', content: 'The object may be missing, named differently, or created in another namespace. KubeTasker may not receive app mode, log level, or feature flags.' },
        { label: 'Key not found', content: 'The object exists, but the Deployment references a key that the ConfigMap or Secret does not contain.' },
        { label: 'Mount path wrong', content: 'The file may be mounted successfully, but KubeTasker reads a different directory or filename, so /config/status may show mountedConfigLoaded as false.' },
        { label: 'Container exits quickly', content: 'KubeTasker may reject a required config value, or command and args may have replaced the normal startup process incorrectly.' },
        { label: 'Pod Running but not Ready', content: 'The process may be alive on /health but failing /ready because required runtime configuration is invalid.' }
      ]
    },
    {
      type: 'checklist',
      title: 'Common mistakes to avoid',
      items: [
        'ConfigMap exists in the wrong namespace.',
        'Deployment key name does not match the ConfigMap or Secret key.',
        'Secret exists but the Deployment references the wrong Secret name.',
        'Mounted file path is different from what KubeTasker expects.',
        'command or args override the image startup behavior incorrectly.',
        'Existing Pods are not restarted after a configuration reference changes.',
        'Learner prints secret values while debugging.'
      ]
    },
    {
      type: 'callout',
      tone: 'success',
      title: 'How this prepares you for the mini-project',
      content: 'The later runtime configuration mini-project will be hands-on. You will fix KubeTasker when it fails because configuration is missing, referenced incorrectly, injected in the wrong shape, mounted at the wrong path, or causing readiness to fail. This lesson gives the mental model before the broken lab.'
    },
    {
      type: 'section',
      title: 'Final takeaway',
      content: 'A good CKAD answer does not only create a ConfigMap or Secret. It proves the object is in the right namespace, the Pod template references the right names and keys, KubeTasker receives the value in the expected shape, /config/status and /ready show the correct behavior, and debugging avoids exposing sensitive data.'
    }
  ]
});

export default problem;
