import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const prompt = 'Before starting the KubeTasker CKAD stages, how should a learner create, verify, use, and destroy a safe cloud Kubernetes practice lab?';

const problem = defineLearningProblem({
  id: 'ckad-preparation-cloud-lab-setup-001',
  category: 'kubernetes-ckad',
  topicId: 'ckad-preparation',
  title: 'CKAD Preparation: Create and Destroy Your Cloud Lab',
  difficulty: 'Easy',
  estimatedTimeSeconds: 420,
  tags: ['kubernetes-ckad', 'ckad-preparation', 'cloud-lab', 'kubectl', 'kube-tasker'],
  rendering: {
    variant: 'deep-dive',
    density: 'comfortable',
    accent: 'green'
  },
  prompt,
  question: prompt,
  body: [
    {
      type: 'section',
      title: 'Why this lab exists',
      content: 'CKAD practice works best when the learner can repeatedly create Kubernetes objects, inspect them, break them, fix them, and clean up without guessing the infrastructure setup. This preparation lesson gives ready-to-use cloud lab materials before Stage 1 starts.'
    },
    {
      type: 'callout',
      tone: 'warning',
      title: 'Cost cleanup warning',
      content: 'Do not leave cloud Kubernetes labs running after practice. Stop or delete the lab immediately when finished. For AWS EC2 kubeadm labs, stopping instances reduces compute cost, but EBS volumes and public IP resources may still incur cost. Deleting the CloudFormation stack is the cleanest cleanup path.'
    },
    {
      type: 'table',
      title: 'Choose a provider path',
      columns: ['Path', 'Use when', 'Cleanup'],
      rows: [
        ['AWS EC2 + kubeadm using CloudFormation', 'Preferred Linux Foundation-style lab path for VM and kubectl fluency.', 'Use aws-delete-kubetasker-lab.sh when finished.'],
        ['DigitalOcean Kubernetes', 'Use when you want a fast managed cluster through doctl.', 'Use do-delete-kubetasker-lab.sh and confirm in the dashboard.'],
        ['Civo Kubernetes', 'Use when Civo is available and you want a lightweight managed cluster.', 'Use civo-delete-kubetasker-lab.sh and confirm in the dashboard.'],
        ['AWS EKS', 'Optional only. Useful later for AWS-managed Kubernetes experience and can cost more.', 'Use eks-delete-kubetasker-lab.sh and confirm cleanup in AWS.']
      ]
    },
    {
      type: 'checklist',
      title: 'Prerequisites',
      items: [
        'A cloud account for the selected provider.',
        'The provider CLI installed and authenticated: aws, doctl, civo, or eksctl.',
        'kubectl installed.',
        'The shorthand alias configured: alias k=kubectl.',
        'For persistent bash setup: echo "alias k=kubectl" >> ~/.bashrc && source ~/.bashrc.',
        'An SSH key pair for the AWS EC2 kubeadm path.',
        'Docker is optional only for image pre-checks; Stage 1 uses the public image msomi22/kubetasker-api:0.1.1.'
      ]
    },
    {
      type: 'table',
      title: 'Downloadable materials',
      columns: ['File', 'Purpose'],
      rows: [
        ['/downloads/ckad/kubetasker-ckad-aws-cloudformation.yaml', 'AWS CloudFormation template for the kubeadm EC2 lab.'],
        ['/downloads/ckad/aws-create-kubetasker-lab.sh', 'Create the AWS lab stack.'],
        ['/downloads/ckad/aws-status-kubetasker-lab.sh', 'Inspect stack status, recent events, outputs, and lab instances.'],
        ['/downloads/ckad/aws-list-kubetasker-lab.sh', 'List EC2 instances tagged for this lab.'],
        ['/downloads/ckad/aws-stop-kubetasker-lab.sh', 'Stop tagged AWS lab instances.'],
        ['/downloads/ckad/aws-start-kubetasker-lab.sh', 'Start stopped tagged AWS lab instances.'],
        ['/downloads/ckad/aws-delete-kubetasker-lab.sh', 'Delete the AWS lab stack.'],
        ['/downloads/ckad/do-create-kubetasker-lab.sh', 'Create a DigitalOcean Kubernetes cluster.'],
        ['/downloads/ckad/do-delete-kubetasker-lab.sh', 'Delete the DigitalOcean cluster.'],
        ['/downloads/ckad/civo-create-kubetasker-lab.sh', 'Create a Civo Kubernetes cluster.'],
        ['/downloads/ckad/civo-delete-kubetasker-lab.sh', 'Delete the Civo cluster.'],
        ['/downloads/ckad/eks-create-kubetasker-lab.sh', 'Optional EKS create script.'],
        ['/downloads/ckad/eks-delete-kubetasker-lab.sh', 'Optional EKS delete script.'],
        ['/downloads/ckad/k8s-stage-01-commands.sh', 'Common Stage 1 kubectl command reference.']
      ]
    },
    {
      type: 'code',
      title: 'AWS quick start',
      language: 'bash',
      code: 'chmod +x aws-*-kubetasker-lab.sh\n./aws-create-kubetasker-lab.sh --key-name YOUR_EC2_KEY_PAIR --ssh-location YOUR_PUBLIC_IP/32\n./aws-status-kubetasker-lab.sh\nssh ubuntu@PUBLIC_IP\nk get nodes -o wide\nk get pods -A'
    },
    {
      type: 'code',
      title: 'Stage 1 app namespace cleanup',
      language: 'bash',
      code: 'k delete pod kube-tasker-client -n kubetasker --ignore-not-found\nk delete svc kube-tasker-api -n kubetasker --ignore-not-found\nk delete deployment kube-tasker-api -n kubetasker --ignore-not-found\nk delete namespace kubetasker --ignore-not-found'
    },
    {
      type: 'section',
      title: 'Next step',
      content: 'After the cluster is reachable and k get nodes works, continue to Stage 1: Deploy KubeTasker API foundation. Kubernetes will pull the public Docker Hub image msomi22/kubetasker-api:0.1.1 automatically when the Pod is scheduled.'
    }
  ],
  explanation: 'A good CKAD preparation lab starts with a clean provider choice, authenticated CLI, kubectl, the k alias, clear create and verify commands, and a cleanup path. AWS EC2 with kubeadm is the preferred Linux Foundation-style path. DigitalOcean and Civo are faster managed alternatives. EKS is optional and can cost more. The learner should verify the cluster, use the Stage 1 command reference, clean up the application namespace, and destroy the full cloud environment when practice ends.',
  starterThought: 'First decide which provider path you will use, then verify that kubectl and the provider CLI are working before creating the lab.',
  hints: [
    'Use k as shorthand for kubectl throughout the lessons.',
    'Every provider path must have a cleanup command.',
    'Do not continue to Stage 1 until k get nodes works.'
  ],
  relatedConcepts: ['kubectl', 'kubeadm', 'CloudFormation', 'managed Kubernetes', 'cleanup', 'KubeTasker'],
  followUpQuestions: [
    'Which provider path is best for your current practice session?',
    'How will you confirm that the cluster is ready before deploying KubeTasker?',
    'Which command destroys the full cloud environment when you finish?'
  ],
  finalTakeaway: 'The preparation lab exists to make CKAD practice repeatable: create the cluster, verify it, practice with k, clean the namespace, and destroy the cloud environment when done.',
  metadata: {
    reviewStatus: 'approved',
    visibility: ['dev', 'prod'],
    source: 'original',
    estimatedTimeSeconds: 420
  }
});

export default problem;
