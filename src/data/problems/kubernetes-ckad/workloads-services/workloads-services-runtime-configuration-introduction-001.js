import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const prompt = 'Configure KubeTasker at runtime using ConfigMaps, Secrets, environment variables, mounted files, command, and args.';

function command(title, explanation, code, language = 'bash') {
  return [
    { type: 'section', title, content: explanation },
    { type: 'code', title, language, code }
  ];
}

function createFileWithVim(title, explanation, filename, code) {
  return [
    { type: 'section', title: `${title}: open ${filename} with vim`, content: `Run this command first to create ${filename}. Paste the content shown in the next block, then save with :wq.` },
    { type: 'code', title: `${title}: open ${filename} with vim`, language: 'bash', code: `vim ${filename}` },
    { type: 'section', title: `${title}: copy this content into ${filename}`, content: explanation },
    { type: 'code', title: filename, filename, language: 'yaml', code }
  ];
}

function editFileWithVim(title, explanation, filename, code, blockTitle = 'Changed snippet') {
  return [
    { type: 'section', title: `${title}: open ${filename} with vim`, content: `Run this command first to edit ${filename}. Make only the change described in the next block, then save with :wq.` },
    { type: 'code', title: `${title}: open ${filename} with vim`, language: 'bash', code: `vim ${filename}` },
    { type: 'section', title: `${title}: what to change in ${filename}`, content: explanation },
    { type: 'code', title: blockTitle, filename, language: 'yaml', code }
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
  TASK_MODE: configmap-env-learning
  ENABLE_SAMPLE_TASKS: 'true'
  WELCOME_MESSAGE: Welcome from ConfigMap env`;

const secretYaml = `apiVersion: v1
kind: Secret
metadata:
  name: kube-tasker-api-secret
  namespace: kubetasker
type: Opaque
stringData:
  API_TOKEN: replace-me-in-real-labs`;

const mountedConfigFileYaml = `apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-tasker-file-config
  namespace: kubetasker
data:
  app-config.yaml: |
    taskMode: mounted-file-learning
    welcomeMessage: Mounted config is active
    requireRuntimeConfig: false`;

const mountedSecretYaml = `apiVersion: v1
kind: Secret
metadata:
  name: kube-tasker-file-secret
  namespace: kubetasker
type: Opaque
stringData:
  api-token.txt: mounted-secret-token-for-lab`;

const imageUpdateSnippet = `# In deployment.yaml, find the existing api container image:
image: msomi22/kubetasker-api:0.1.1

# Change only that image line to the v0.2.0 image:
image: msomi22/kubetasker-api:0.2.0`;

const directEnvSnippet = `# In deployment.yaml, add this env block under the existing api container.
# It must be aligned with image and ports.
env:
  - name: DIRECT_MESSAGE
    value: Direct environment variable is active`;

const configMapEnvSnippet = `# In deployment.yaml, keep the existing env block.
# Append these entries under env.
# Do not create a second env block under the same container.
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

const secretEnvSnippet = `# In deployment.yaml, append this entry under the same env list.
# Do not print the Secret value during verification.
  - name: API_TOKEN
    valueFrom:
      secretKeyRef:
        name: kube-tasker-api-secret
        key: API_TOKEN`;

const mountedConfigSnippet = `# In deployment.yaml, add this volumeMounts block under the existing api container.
# It must be aligned with image, ports, and env.
volumeMounts:
  - name: app-config-file
    mountPath: /etc/kubetasker
    readOnly: true

# Add this volumes block under spec.template.spec.
# It must be aligned with containers.
volumes:
  - name: app-config-file
    configMap:
      name: kube-tasker-file-config`;

const mountedSecretSnippet = `# In deployment.yaml, append this item under the existing volumeMounts list.
# Do not create a second volumeMounts block under the same container.
  - name: api-secret-file
    mountPath: /etc/kubetasker-secret
    readOnly: true

# In deployment.yaml, append this item under the existing volumes list.
# Do not print the mounted Secret file content during verification.
  - name: api-secret-file
    secret:
      secretName: kube-tasker-file-secret`;

const downwardApiSnippet = `# In deployment.yaml, append these entries under the existing env list.
# These values come from the Pod metadata/status at runtime.
  - name: POD_NAME
    valueFrom:
      fieldRef:
        fieldPath: metadata.name
  - name: POD_NAMESPACE
    valueFrom:
      fieldRef:
        fieldPath: metadata.namespace
  - name: POD_IP
    valueFrom:
      fieldRef:
        fieldPath: status.podIP
  - name: NODE_NAME
    valueFrom:
      fieldRef:
        fieldPath: spec.nodeName`;

const resourcesAndResourceFieldSnippet = `# In deployment.yaml, add resources under the existing api container.
# It must be aligned with image, ports, env, and volumeMounts.
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 256Mi

# Then append these entries under the existing env list.
# They expose selected resource values to the app.
  - name: CPU_LIMIT
    valueFrom:
      resourceFieldRef:
        resource: limits.cpu
  - name: MEMORY_LIMIT
    valueFrom:
      resourceFieldRef:
        resource: limits.memory`;

const commandArgsPatchYaml = `# Optional: add this under the existing api container only if the question asks for command/args.
# Keep the rest of deployment.yaml unchanged.
command: ['python']
args: ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8080']`;

const directEnvStatusJson = `{
  "runtimeConfigVersion": "v0.2.0",
  "directMessage": "Direct environment variable is active",
  "ready": true
}`;

const configMapEnvStatusJson = `{
  "runtimeConfigVersion": "v0.2.0",
  "appMode": "learning",
  "taskMode": "configmap-env-learning",
  "logLevel": "info",
  "sampleTasksEnabled": true,
  "welcomeMessage": "Welcome from ConfigMap env",
  "ready": true
}`;

const secretEnvStatusJson = `{
  "runtimeConfigVersion": "v0.2.0",
  "apiTokenConfigured": true,
  "apiTokenValueExposed": false,
  "ready": true
}`;

const mountedConfigStatusJson = `{
  "runtimeConfigVersion": "v0.2.0",
  "mountedConfigLoaded": true,
  "taskMode": "mounted-file-learning",
  "welcomeMessage": "Mounted config is active",
  "ready": true
}`;

const mountedSecretStatusJson = `{
  "runtimeConfigVersion": "v0.2.0",
  "mountedSecretLoaded": true,
  "mountedSecretValueExposed": false,
  "ready": true
}`;

const downwardApiStatusJson = `{
  "runtimeConfigVersion": "v0.2.0",
  "podNameConfigured": true,
  "podNamespace": "kubetasker",
  "podIpConfigured": true,
  "nodeNameConfigured": true
}`;

const resourceFieldStatusJson = `{
  "runtimeConfigVersion": "v0.2.0",
  "cpuLimitConfigured": true,
  "memoryLimitConfigured": true,
  "ready": true
}`;

const previousQuestionLink = '[previous question](https://academy.qubitel.net/problem/kubetasker-yaml-modify-001)';

const problem = defineLearningProblem({
  id: 'workloads-services-runtime-configuration-introduction-001',
  category: 'kubernetes-ckad',
  topicId: 'workloads-services',
  title: 'Step 4: Runtime Configuration Introduction',
  difficulty: 'Easy',
  estimatedTime: '45 min',
  estimatedTimeSeconds: 2700,
  type: 'learning',
  tags: [
    'kubernetes-ckad',
    'runtime-configuration',
    'configmap',
    'secret',
    'environment-variables',
    'volume-mounts',
    'downward-api',
    'resourcefieldref',
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
  scenario: 'In this lesson, you use KubeTasker v0.2.0 to test the main ways Kubernetes can provide runtime configuration to an application: direct env values, ConfigMap env values, Secret env values, mounted ConfigMap files, mounted Secret files, Downward API values, resource field values, and command/args.',
  starterThought: 'Runtime configuration is easier to understand when each mechanism is tested separately. Make one focused change, apply it, then verify what the running app received.',
  intuition: 'Runtime configuration changes app behavior without rebuilding the image. Kubernetes can inject values as environment variables, mount data as files, expose Pod metadata, expose resource settings, or override startup command and args.',
  mentalPicture: 'Think of the app image as the packaged application. Runtime configuration is the set of values Kubernetes supplies when the Pod starts.',
  patternSignal: 'Use this sequence for each scenario: create any required object, edit only the required part of deployment.yaml, apply, wait for rollout, then verify from the running app.',
  invariant: 'Do not replace whole manifests when only one part changes. In CKAD-style work, careful targeted edits are part of the skill.',
  commonMistake: 'Mixing every runtime configuration mechanism into one large edit before proving each mechanism works independently.',
  explanation: 'This lesson introduces the common Kubernetes runtime configuration mechanisms one by one. The Deployment first moves to v0.2.0 because that app version exposes verification endpoints for these scenarios.',
  stepByStepBreakdown: [
    'Apply namespace.yaml if the kubetasker namespace is missing.',
    'Update deployment.yaml to the v0.2.0 image.',
    'Scenario 1: add a direct environment variable and verify it.',
    'Scenario 2: create a ConfigMap, inject keys as environment variables, and verify them.',
    'Scenario 3: create a Secret, inject one key as an environment variable, and verify only that it is configured.',
    'Scenario 4: mount ConfigMap data as a file and verify the app loaded it.',
    'Scenario 5: mount Secret data as a file and verify only that it is loaded.',
    'Scenario 6: inject Pod metadata using the Downward API.',
    'Scenario 7: inject resource values using resourceFieldRef.',
    'Scenario 8: review command and args as startup configuration.'
  ],
  finalTakeaway: 'A good CKAD runtime configuration answer changes only the required fields and proves each configuration mechanism from the running app.',
  visualExplanation: 'The flow is one runtime configuration mechanism at a time, with a rollout and app-level verification after each change.',
  visualWalkthrough: {
    title: 'Runtime configuration scenarios',
    summary: 'Test each Kubernetes runtime configuration mechanism separately with KubeTasker v0.2.0.',
    diagram: {
      type: 'graph',
      variant: 'kubernetes-object-relationship',
      title: 'Runtime config scenarios',
      nodes: [
        { id: 'image', label: 'KubeTasker v0.2.0\nruntime-config app' },
        { id: 'direct', label: 'Direct env\nvalue in Deployment' },
        { id: 'cmEnv', label: 'ConfigMap\nas env values' },
        { id: 'secretEnv', label: 'Secret\nas env value' },
        { id: 'mountedCm', label: 'ConfigMap\nmounted as file' },
        { id: 'mountedSecret', label: 'Secret\nmounted as file' },
        { id: 'downward', label: 'Downward API\nPod metadata' },
        { id: 'resources', label: 'resourceFieldRef\nCPU and memory values' },
        { id: 'status', label: '/config/status\nproof from app' }
      ],
      edges: [
        { from: 'image', to: 'direct', label: 'start simple' },
        { from: 'direct', to: 'cmEnv', label: 'externalize non-sensitive config' },
        { from: 'cmEnv', to: 'secretEnv', label: 'add sensitive env config' },
        { from: 'secretEnv', to: 'mountedCm', label: 'test file config' },
        { from: 'mountedCm', to: 'mountedSecret', label: 'test sensitive file config' },
        { from: 'mountedSecret', to: 'downward', label: 'inject Pod identity' },
        { from: 'downward', to: 'resources', label: 'inject resource values' },
        { from: 'resources', to: 'status', label: 'verify each result' }
      ]
    }
  },
  body: [
    {
      type: 'checklist',
      title: 'Objective',
      items: [
        'I can update an existing Deployment to use KubeTasker v0.2.0.',
        'I can test a direct environment variable defined in the Deployment.',
        'I can test ConfigMap values injected as environment variables.',
        'I can test Secret values injected as environment variables without printing the Secret value.',
        'I can test ConfigMap data mounted as a file inside the container.',
        'I can test Secret data mounted as a file without printing the Secret value.',
        'I can test Pod metadata injected through the Downward API.',
        'I can test CPU and memory values injected through resourceFieldRef.',
        'I can understand command and args as startup configuration.',
        'I can verify each mechanism separately from /config/status.'
      ]
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'What you will do next',
      content: `Use KubeTasker v0.2.0 to test one runtime configuration mechanism at a time. Need the earlier base files? Open the ${previousQuestionLink}.`
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'How to save files in this lesson',
      content: 'For each file, run the vim command shown, press i to enter insert mode, paste or edit the content from the next block, press Esc, type :wq, and press Enter. The same save pattern applies to every file in this lesson.'
    },

    ...command('0. Ensure the namespace exists', 'Start with namespace.yaml only. If you do not have this file yet, open the previous question from the link above and create it there first.', `k apply -f namespace.yaml
k get ns kubetasker`),

    ...editFileWithVim('1. Update the app image for runtime configuration', 'Open deployment.yaml. Find the existing image line from the earlier Deployment and change only that line to the v0.2.0 image. This app version is used to test runtime configuration.', 'deployment.yaml', imageUpdateSnippet, 'image change in deployment.yaml'),
    ...command('Apply the image update', 'Apply deployment.yaml after changing only the image line.', `k apply -f deployment.yaml
k -n kubetasker rollout status deploy/kube-tasker-api`),

    { type: 'divider' },
    {
      type: 'section',
      title: 'Scenario 1: Direct environment variable',
      content: 'Start with the simplest runtime configuration method: a value written directly in the Deployment. This teaches where env belongs before using ConfigMaps or Secrets.'
    },
    ...editFileWithVim('2. Add a direct env value to the Deployment', 'Open deployment.yaml. Add this env block under the existing api container. This is a direct value, so no extra Kubernetes object is needed.', 'deployment.yaml', directEnvSnippet, 'direct env change in deployment.yaml'),
    ...command('Apply and verify the direct env value', 'Apply deployment.yaml, wait for rollout, then verify that KubeTasker received the direct env value.', `k apply -f deployment.yaml
k -n kubetasker rollout status deploy/kube-tasker-api
k apply -f service.yaml
k apply -f client-pod.yaml
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/config/status`),
    ...jsonExample('Expected /config/status after Scenario 1', 'The app should show that the direct environment variable was received.', 'config-status-direct-env-response.json', directEnvStatusJson),

    { type: 'divider' },
    {
      type: 'section',
      title: 'Scenario 2: ConfigMap as environment variables',
      content: 'Now move non-sensitive settings out of the Deployment and into a ConfigMap. The Deployment references specific ConfigMap keys and exposes them to the app as environment variables.'
    },
    ...createFileWithVim('3. Create the ConfigMap manifest', 'This file stores non-sensitive runtime settings that KubeTasker will read through environment variables.', 'configmap.yaml', configMapYaml),
    ...command('Apply the ConfigMap', 'Create or update the non-sensitive runtime settings.', 'k apply -f configmap.yaml'),
    ...command('Verify the ConfigMap exists', 'Confirm the object and keys exist in the correct namespace.', 'k -n kubetasker describe configmap kube-tasker-api-config'),
    ...editFileWithVim('4. Add ConfigMap env refs to the Deployment', 'Open deployment.yaml again. Append these entries under the existing env list. Do not create another env block.', 'deployment.yaml', configMapEnvSnippet, 'ConfigMap env change in deployment.yaml'),
    ...command('Apply and verify ConfigMap env values', 'Apply deployment.yaml, wait for rollout, then use the app endpoint to prove ConfigMap env injection worked.', `k apply -f deployment.yaml
k -n kubetasker rollout status deploy/kube-tasker-api
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/config/status`),
    ...jsonExample('Expected /config/status after Scenario 2', 'The app should show the non-sensitive values from the ConfigMap.', 'config-status-configmap-env-response.json', configMapEnvStatusJson),

    { type: 'divider' },
    {
      type: 'section',
      title: 'Scenario 3: Secret as environment variable',
      content: 'Use a Secret for sensitive values. The app should prove the token is configured, but the lesson must not print the token value.'
    },
    ...createFileWithVim('5. Create the Secret manifest', 'This file stores a sensitive runtime value. Verify that the Secret exists, but do not print the token value.', 'secret.yaml', secretYaml),
    ...command('Apply the Secret', 'Create or update the sensitive runtime value.', 'k apply -f secret.yaml'),
    ...command('Verify the Secret exists without printing it', 'Confirm the Secret exists and has data without revealing the value.', `k -n kubetasker get secret kube-tasker-api-secret
k -n kubetasker describe secret kube-tasker-api-secret`),
    ...editFileWithVim('6. Add the Secret env ref to the Deployment', 'Open deployment.yaml. Append this Secret entry under the existing env list. Keep the ConfigMap env entries from Scenario 2.', 'deployment.yaml', secretEnvSnippet, 'Secret env change in deployment.yaml'),
    ...command('Apply and verify Secret env value safely', 'Apply deployment.yaml, wait for rollout, then verify only that the app received a token. Do not print the Secret value.', `k apply -f deployment.yaml
k -n kubetasker rollout status deploy/kube-tasker-api
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/config/status`),
    ...jsonExample('Expected /config/status after Scenario 3', 'The app should confirm that the token is configured without exposing the token itself.', 'config-status-secret-env-response.json', secretEnvStatusJson),

    { type: 'divider' },
    {
      type: 'section',
      title: 'Scenario 4: ConfigMap mounted as a file',
      content: 'Some apps read configuration files instead of individual environment variables. In this scenario, a ConfigMap key becomes a file mounted inside the container.'
    },
    ...createFileWithVim('7. Create the mounted ConfigMap manifest', 'This file becomes /etc/kubetasker/app-config.yaml inside the KubeTasker container.', 'file-config-configmap.yaml', mountedConfigFileYaml),
    ...command('Apply the mounted ConfigMap', 'Create or update the ConfigMap that will be mounted as /etc/kubetasker/app-config.yaml.', 'k apply -f file-config-configmap.yaml'),
    ...command('Verify the mounted ConfigMap exists', 'Confirm the ConfigMap contains app-config.yaml.', 'k -n kubetasker describe configmap kube-tasker-file-config'),
    ...editFileWithVim('8. Add the mounted ConfigMap file to the Deployment', 'Open deployment.yaml. Add the volumeMounts block under the api container and the volumes block under spec.template.spec.', 'deployment.yaml', mountedConfigSnippet, 'mounted ConfigMap change in deployment.yaml'),
    ...command('Apply and verify mounted ConfigMap config', 'Apply deployment.yaml, wait for rollout, then confirm the app loaded the mounted config file.', `k apply -f deployment.yaml
k -n kubetasker rollout status deploy/kube-tasker-api
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/config/status
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/ready`),
    ...jsonExample('Expected /config/status after Scenario 4', 'The app should confirm that the mounted ConfigMap file was loaded.', 'config-status-mounted-configmap-response.json', mountedConfigStatusJson),

    { type: 'divider' },
    {
      type: 'section',
      title: 'Scenario 5: Secret mounted as a file',
      content: 'Secrets can also be mounted as files. This is common for tokens, certificates, keys, and credentials. Verify that the app can see the file without printing its contents.'
    },
    ...createFileWithVim('9. Create the mounted Secret manifest', 'This Secret will be mounted as a file inside the container. The Secret value should not be printed during verification.', 'file-secret.yaml', mountedSecretYaml),
    ...command('Apply the mounted Secret', 'Create or update the Secret that will be mounted as a file.', 'k apply -f file-secret.yaml'),
    ...command('Verify the mounted Secret exists without printing it', 'Confirm the Secret exists. Do not decode or print the Secret value.', `k -n kubetasker get secret kube-tasker-file-secret
k -n kubetasker describe secret kube-tasker-file-secret`),
    ...editFileWithVim('10. Add the mounted Secret file to the Deployment', 'Open deployment.yaml. Append one item under volumeMounts and one item under volumes. Do not create duplicate volumeMounts or volumes blocks.', 'deployment.yaml', mountedSecretSnippet, 'mounted Secret change in deployment.yaml'),
    ...command('Apply and verify mounted Secret config safely', 'Apply deployment.yaml, wait for rollout, then verify only that the Secret file was loaded.', `k apply -f deployment.yaml
k -n kubetasker rollout status deploy/kube-tasker-api
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/config/status`),
    ...jsonExample('Expected /config/status after Scenario 5', 'The app should confirm that the mounted Secret file was loaded without exposing the Secret content.', 'config-status-mounted-secret-response.json', mountedSecretStatusJson),

    { type: 'divider' },
    {
      type: 'section',
      title: 'Scenario 6: Downward API values',
      content: 'The Downward API lets the app receive information about its own Pod, such as Pod name, namespace, Pod IP, and node name.'
    },
    ...editFileWithVim('11. Add Downward API env values to the Deployment', 'Open deployment.yaml. Append these entries under the existing env list. These values are filled by Kubernetes when the Pod starts.', 'deployment.yaml', downwardApiSnippet, 'Downward API change in deployment.yaml'),
    ...command('Apply and verify Downward API values', 'Apply deployment.yaml, wait for rollout, then verify that the app received Pod metadata.', `k apply -f deployment.yaml
k -n kubetasker rollout status deploy/kube-tasker-api
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/config/status`),
    ...jsonExample('Expected /config/status after Scenario 6', 'The app should confirm that Pod metadata was injected.', 'config-status-downward-api-response.json', downwardApiStatusJson),

    { type: 'divider' },
    {
      type: 'section',
      title: 'Scenario 7: Resource field references',
      content: 'resourceFieldRef lets the app receive selected CPU or memory request/limit values. This is useful when apps need to tune behavior based on assigned resources.'
    },
    ...editFileWithVim('12. Add resources and resourceFieldRef values', 'Open deployment.yaml. Add resources under the api container, then append CPU_LIMIT and MEMORY_LIMIT under the existing env list.', 'deployment.yaml', resourcesAndResourceFieldSnippet, 'resourceFieldRef change in deployment.yaml'),
    ...command('Apply and verify resource field values', 'Apply deployment.yaml, wait for rollout, then verify that resource values are available to the app.', `k apply -f deployment.yaml
k -n kubetasker rollout status deploy/kube-tasker-api
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/config/status`),
    ...jsonExample('Expected /config/status after Scenario 7', 'The app should confirm that CPU and memory values are configured.', 'config-status-resourcefield-response.json', resourceFieldStatusJson),

    { type: 'divider' },
    {
      type: 'section',
      title: 'Scenario 8: Command and args',
      content: 'command and args are startup configuration. They do not inject values like ConfigMaps or Secrets, but they change how the container process starts.'
    },
    ...editFileWithVim('13. Optional command and args amendment', 'Use this only when a question asks you to override the container startup command. Do not replace the Deployment. Add only these fields under the existing api container.', 'deployment.yaml', commandArgsPatchYaml, 'command and args change in deployment.yaml'),
    ...command('Apply and verify command/args amendment', 'If command or args are wrong, /health and /ready will fail and logs will show startup errors.', `k apply -f deployment.yaml
k -n kubetasker rollout status deploy/kube-tasker-api
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/health
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/ready
k -n kubetasker logs deploy/kube-tasker-api`),

    {
      type: 'comparison',
      title: 'Debugging pattern',
      items: [
        { label: 'If /config/status does not show env values', content: 'Check the env indentation and the ConfigMap or Secret key names.' },
        { label: 'If the Secret exists but app says token is missing', content: 'Check secretKeyRef name and key. Do not print the token value.' },
        { label: 'If mounted config is not loaded', content: 'Check the ConfigMap key, volume name, mountPath, and volumes indentation.' },
        { label: 'If Downward API values are missing', content: 'Check fieldPath spelling and make sure the entries are under env.' },
        { label: 'If resource values are missing', content: 'Check that resources are set on the same container and resourceFieldRef points to the correct resource.' },
        { label: 'If the app still shows old values', content: 'Confirm the Deployment rolled out and the Pod was recreated after the manifest change.' }
      ]
    },
    {
      type: 'section',
      title: 'Final takeaway',
      content: 'Kubernetes can provide runtime configuration in several ways. Test one mechanism at a time: direct env, ConfigMap env, Secret env, mounted ConfigMap file, mounted Secret file, Downward API, resourceFieldRef, and command/args.'
    }
  ]
});

export default problem;
