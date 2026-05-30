import { defineLearningProblem } from '../../../../problems/problemAuthoring.js';

const prompt = 'Before starting the KubeTasker CKAD stages, how should a learner create, verify, use, and destroy a safe cloud Kubernetes practice lab?';

const awsCloudFormationTemplate = `AWSTemplateFormatVersion: '2010-09-09'
Description: KubeTasker CKAD single-node kubeadm lab using Cilium networking.

Parameters:
  KeyName:
    Type: AWS::EC2::KeyPair::KeyName
    Description: Existing EC2 key pair used for SSH access.
  SSHLocation:
    Type: String
    Description: CIDR allowed to reach SSH, Kubernetes API, and NodePort practice. Prefer your public IP with /32.
  InstanceType:
    Type: String
    Default: t3.medium
    Description: EC2 instance type for the single-node CKAD lab.
  LabName:
    Type: String
    Default: kubetasker-ckad
    Description: Lab tag value and naming prefix.
  AmiId:
    Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>
    Default: /aws/service/canonical/ubuntu/server/22.04/stable/current/amd64/hvm/ebs-gp2/ami-id
    Description: Ubuntu 22.04 LTS AMI from Canonical SSM public parameters.

Resources:
  KubeTaskerVpc:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.42.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: !Sub \${LabName}-vpc
        - Key: Lab
          Value: !Ref LabName

  KubeTaskerSubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref KubeTaskerVpc
      CidrBlock: 10.42.1.0/24
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub \${LabName}-public-subnet
        - Key: Lab
          Value: !Ref LabName

  KubeTaskerInternetGateway:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: !Sub \${LabName}-igw
        - Key: Lab
          Value: !Ref LabName

  KubeTaskerGatewayAttachment:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref KubeTaskerVpc
      InternetGatewayId: !Ref KubeTaskerInternetGateway

  KubeTaskerRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref KubeTaskerVpc
      Tags:
        - Key: Name
          Value: !Sub \${LabName}-route-table
        - Key: Lab
          Value: !Ref LabName

  KubeTaskerDefaultRoute:
    Type: AWS::EC2::Route
    DependsOn: KubeTaskerGatewayAttachment
    Properties:
      RouteTableId: !Ref KubeTaskerRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref KubeTaskerInternetGateway

  KubeTaskerSubnetRouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref KubeTaskerSubnet
      RouteTableId: !Ref KubeTaskerRouteTable

  KubeTaskerSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: KubeTasker CKAD lab access
      VpcId: !Ref KubeTaskerVpc
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: !Ref SSHLocation
        - IpProtocol: tcp
          FromPort: 6443
          ToPort: 6443
          CidrIp: !Ref SSHLocation
        - IpProtocol: tcp
          FromPort: 30000
          ToPort: 32767
          CidrIp: !Ref SSHLocation
      SecurityGroupEgress:
        - IpProtocol: -1
          CidrIp: 0.0.0.0/0
      Tags:
        - Key: Name
          Value: !Sub \${LabName}-security-group
        - Key: Lab
          Value: !Ref LabName

  KubeTaskerInternalIngress:
    Type: AWS::EC2::SecurityGroupIngress
    Properties:
      GroupId: !Ref KubeTaskerSecurityGroup
      IpProtocol: -1
      SourceSecurityGroupId: !Ref KubeTaskerSecurityGroup

  ControlPlane:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: !Ref AmiId
      InstanceType: !Ref InstanceType
      KeyName: !Ref KeyName
      SubnetId: !Ref KubeTaskerSubnet
      SecurityGroupIds:
        - !Ref KubeTaskerSecurityGroup
      Tags:
        - Key: Name
          Value: !Sub \${LabName}-control-plane
        - Key: Lab
          Value: !Ref LabName
        - Key: Role
          Value: control-plane
      UserData:
        Fn::Base64: !Sub |
          #!/usr/bin/env bash
          set -euxo pipefail
          apt-get update
          apt-get install -y ca-certificates curl gnupg lsb-release apt-transport-https bash-completion jq
          swapoff -a
          sed -i '/ swap / s/^/#/' /etc/fstab
          modprobe overlay
          modprobe br_netfilter
          cat >/etc/modules-load.d/k8s.conf <<'MODULES'
          overlay
          br_netfilter
          MODULES
          cat >/etc/sysctl.d/k8s.conf <<'SYSCTL'
          net.bridge.bridge-nf-call-iptables = 1
          net.bridge.bridge-nf-call-ip6tables = 1
          net.ipv4.ip_forward = 1
          SYSCTL
          sysctl --system
          install -m 0755 -d /etc/apt/keyrings
          curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
          echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' >/etc/apt/sources.list.d/kubernetes.list
          curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
          echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" >/etc/apt/sources.list.d/docker.list
          apt-get update
          apt-get install -y containerd.io kubelet kubeadm kubectl
          apt-mark hold kubelet kubeadm kubectl
          mkdir -p /etc/containerd
          containerd config default >/etc/containerd/config.toml
          sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
          systemctl restart containerd
          systemctl enable containerd kubelet
          kubeadm init --pod-network-cidr=10.244.0.0/16 --node-name \${LabName}-control-plane
          mkdir -p /home/ubuntu/.kube
          cp /etc/kubernetes/admin.conf /home/ubuntu/.kube/config
          chown -R ubuntu:ubuntu /home/ubuntu/.kube
          echo 'alias k=kubectl' >>/home/ubuntu/.bashrc
          echo 'source <(kubectl completion bash)' >>/home/ubuntu/.bashrc
          echo 'complete -o default -F __start_kubectl k' >>/home/ubuntu/.bashrc
          CILIUM_CLI_VERSION=$(curl -fsSL https://raw.githubusercontent.com/cilium/cilium-cli/main/stable.txt)
          CLI_ARCH=amd64
          if [ "$(uname -m)" = "aarch64" ]; then CLI_ARCH=arm64; fi
          curl -fsSLO "https://github.com/cilium/cilium-cli/releases/download/\${!CILIUM_CLI_VERSION}/cilium-linux-\${!CLI_ARCH}.tar.gz"
          tar xzvf "cilium-linux-\${!CLI_ARCH}.tar.gz" -C /usr/local/bin cilium
          rm "cilium-linux-\${!CLI_ARCH}.tar.gz"
          su - ubuntu -c 'cilium install --version 1.16.6 --wait'
          su - ubuntu -c 'cilium status --wait'
          su - ubuntu -c 'kubectl taint nodes --all node-role.kubernetes.io/control-plane- || true'

Outputs:
  ControlPlanePublicIp:
    Description: SSH target for the control-plane instance.
    Value: !GetAtt ControlPlane.PublicIp
  ControlPlaneSshCommand:
    Description: SSH command template.
    Value: !Sub ssh ubuntu@\${ControlPlane.PublicIp}
  KubeConfigPath:
    Description: Kubeconfig location on the control-plane instance.
    Value: /home/ubuntu/.kube/config
  Cni:
    Description: Cluster networking implementation.
    Value: Cilium
`;

const deployKubeTaskerCommands = `k create namespace kubetasker --dry-run=client -o yaml | k apply -f -
k create deployment kube-tasker-api --image=msomi22/kubetasker-api:0.1.1 -n kubetasker
k expose deployment kube-tasker-api --name=kube-tasker-api --port=80 --target-port=8080 -n kubetasker
k -n kubetasker run kube-tasker-client --image=busybox:1.36 --restart=Never --command -- sleep 3600
k -n kubetasker wait --for=condition=Ready pod/kube-tasker-client --timeout=90s
k -n kubetasker exec kube-tasker-client -- wget -qO- http://kube-tasker-api/health`;

const problem = defineLearningProblem({
  id: 'ckad-preparation-cloud-lab-setup-001',
  category: 'kubernetes-ckad',
  topicId: 'ckad-preparation',
  title: 'CKAD Preparation: Create and Destroy Your Cloud Lab',
  difficulty: 'Easy',
  estimatedTimeSeconds: 420,
  tags: ['kubernetes-ckad', 'ckad-preparation', 'cloud-lab', 'kubectl', 'cilium', 'kube-tasker'],
  rendering: { variant: 'deep-dive', density: 'comfortable', accent: 'green' },
  prompt,
  question: prompt,
  body: [
    { type: 'section', title: 'Why this lab exists', content: 'CKAD practice works best when the learner can repeatedly create Kubernetes objects, inspect them, break them, fix them, and clean up without guessing the infrastructure setup. Pick one provider tab below and follow only that setup path.' },
    { type: 'callout', tone: 'warning', title: 'Cost cleanup warning', content: 'Do not leave cloud Kubernetes labs running after practice. Stop or delete the lab immediately when finished. Deleting the cloud lab is the cleanest cleanup path because stopped instances, disks, public IPs, load balancers, and managed control planes may still cost money.' },
    {
      type: 'tabs',
      title: 'Choose your cloud lab path',
      description: 'Use one tab at a time. Each provider tab breaks the setup into separately copyable commands so each block does one job.',
      tabs: [
        {
          id: 'aws-ec2-kubeadm',
          label: 'AWS EC2 + kubeadm + Cilium',
          body: [
            { type: 'section', title: 'When to use this path', content: 'Use this as the preferred CKAD practice path when you want VM-based Kubernetes practice with kubeadm and direct node access. The lab uses Cilium only as the Kubernetes networking layer.' },
            { type: 'checklist', title: 'Account and prerequisites', items: ['AWS account with billing enabled.', 'AWS CloudShell access, or AWS CLI installed locally and authenticated with aws configure.', 'Permission to create CloudFormation, EC2, VPC, subnet, route table, internet gateway, security group, and EBS resources.', 'An existing EC2 key pair in the target AWS region.', 'Your public IP address in CIDR format, for example 203.0.113.10/32.', 'For this AWS EC2 path, run kubectl/k after SSH into the EC2 instance. kubectl is installed automatically on that instance; local kubectl is only needed if you choose to copy kubeconfig and manage the cluster from your own machine.'] },
            { type: 'callout', tone: 'info', title: 'Estimated monthly cost', content: 'Approximate cost: USD 35-45/month for one t3.medium style single-node lab. Cost can increase with EBS storage, public IPv4 addresses, Elastic IPs, NAT, and data transfer. Delete the stack when finished.' },
            { type: 'code', title: 'Set AWS variables', language: 'bash', code: `export AWS_REGION=us-west-2
export STACK_NAME=kubetasker-ckad
export KEY_NAME=YOUR_EXISTING_EC2_KEY_PAIR
export ACCESS_CIDR=$(curl -fsSL https://checkip.amazonaws.com)/32` },
            { type: 'code', title: 'Create the CloudFormation template file', language: 'bash', code: `mkdir -p ~/kubetasker-ckad-lab
cd ~/kubetasker-ckad-lab

cat > kubetasker-ckad-aws-cloudformation.yaml <<'CFN_YAML'
${awsCloudFormationTemplate}CFN_YAML` },
            { type: 'code', title: 'Create the CloudFormation stack', language: 'bash', code: `aws cloudformation create-stack \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --template-body file://kubetasker-ckad-aws-cloudformation.yaml \
  --parameters \
    "ParameterKey=KeyName,ParameterValue=$KEY_NAME" \
    "ParameterKey=SSHLocation,ParameterValue=$ACCESS_CIDR" \
    "ParameterKey=InstanceType,ParameterValue=t3.medium" \
    "ParameterKey=LabName,ParameterValue=$STACK_NAME"` },
            { type: 'code', title: 'Check stack status', language: 'bash', code: `aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query "Stacks[0].StackStatus" \
  --output text` },
            { type: 'code', title: 'Get the SSH command', language: 'bash', code: `PUBLIC_IP=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='ControlPlanePublicIp'].OutputValue" \
  --output text)

echo "ssh ubuntu@$PUBLIC_IP"` },
            { type: 'code', title: 'SSH into the lab', language: 'bash', code: 'ssh ubuntu@PUBLIC_IP' },
            { type: 'code', title: 'Verify Kubernetes + Cilium after SSH', language: 'bash', code: 'k get nodes -o wide
k get pods -A
cilium status --wait
k -n kube-system get pods -l k8s-app=cilium' },
            { type: 'code', title: 'Deploy and verify KubeTasker API', language: 'bash', code: deployKubeTaskerCommands },
            { type: 'code', title: 'Clean up application resources', language: 'bash', code: 'k delete namespace kubetasker --ignore-not-found' },
            { type: 'code', title: 'Delete the AWS lab after practice', language: 'bash', code: `aws cloudformation delete-stack \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION"` },
            { type: 'code', title: 'Check delete status', language: 'bash', code: `aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query "Stacks[0].StackStatus" \
  --output text` }
          ]
        },
        {
          id: 'digitalocean', label: 'DigitalOcean', body: [
            { type: 'section', title: 'When to use this path', content: 'Use this path when you want a fast managed Kubernetes cluster and want to focus mainly on kubectl practice rather than node bootstrap details.' },
            { type: 'checklist', title: 'Account and prerequisites', items: ['DigitalOcean account with billing enabled.', 'Personal access token created from the DigitalOcean dashboard.', 'doctl installed and authenticated with the personal access token.', 'kubectl installed locally.', 'bash available in your terminal or cloud shell.'] },
            { type: 'callout', tone: 'info', title: 'Estimated monthly cost', content: 'Approximate cost: USD 24/month for one s-2vcpu-4gb node. Storage and load balancers cost extra. Delete the cluster when finished.' },
            { type: 'code', title: 'Set DigitalOcean variables', language: 'bash', code: `export DO_CLUSTER_NAME=kubetasker-ckad
export DO_REGION=nyc1
export DO_NODE_SIZE=s-2vcpu-4gb
export DO_NODE_COUNT=1` },
            { type: 'code', title: 'Create the DigitalOcean Kubernetes lab', language: 'bash', code: `doctl kubernetes cluster create "$DO_CLUSTER_NAME" \
  --region "$DO_REGION" \
  --size "$DO_NODE_SIZE" \
  --count "$DO_NODE_COUNT" \
  --wait` },
            { type: 'code', title: 'Verify DigitalOcean nodes', language: 'bash', code: 'k get nodes -o wide' },
            { type: 'code', title: 'Deploy and verify KubeTasker API', language: 'bash', code: deployKubeTaskerCommands },
            { type: 'code', title: 'Clean up application resources', language: 'bash', code: 'k delete namespace kubetasker --ignore-not-found' },
            { type: 'code', title: 'Delete the DigitalOcean lab after practice', language: 'bash', code: 'doctl kubernetes cluster delete "$DO_CLUSTER_NAME" --force' }
          ]
        },
        {
          id: 'civo', label: 'Civo', body: [
            { type: 'section', title: 'When to use this path', content: 'Use this path when Civo is available in your region and you want a lightweight managed Kubernetes setup for quick practice.' },
            { type: 'checklist', title: 'Account and prerequisites', items: ['Civo account with billing enabled.', 'Civo API key created from the Civo dashboard.', 'civo CLI installed and authenticated with the API key.', 'A supported Civo region and node size selected.', 'kubectl installed locally.', 'bash available in your terminal or cloud shell.'] },
            { type: 'callout', tone: 'info', title: 'Estimated monthly cost', content: 'Approximate cost: USD 20-30/month for one small or medium node. Exact cost depends on region and node size. Delete the cluster when finished.' },
            { type: 'code', title: 'Set Civo variables', language: 'bash', code: `export CIVO_CLUSTER_NAME=kubetasker-ckad
export CIVO_REGION=LON1
export CIVO_NODE_SIZE=g4s.kube.medium
export CIVO_NODE_COUNT=1` },
            { type: 'code', title: 'Create the Civo Kubernetes lab', language: 'bash', code: `civo kubernetes create "$CIVO_CLUSTER_NAME" \
  --region "$CIVO_REGION" \
  --nodes "$CIVO_NODE_COUNT" \
  --size "$CIVO_NODE_SIZE" \
  --wait` },
            { type: 'code', title: 'Save Civo kubeconfig', language: 'bash', code: 'civo kubernetes config "$CIVO_CLUSTER_NAME" --region "$CIVO_REGION" --save' },
            { type: 'code', title: 'Verify Civo nodes', language: 'bash', code: 'k get nodes -o wide' },
            { type: 'code', title: 'Deploy and verify KubeTasker API', language: 'bash', code: deployKubeTaskerCommands },
            { type: 'code', title: 'Clean up application resources', language: 'bash', code: 'k delete namespace kubetasker --ignore-not-found' },
            { type: 'code', title: 'Delete the Civo lab after practice', language: 'bash', code: 'civo kubernetes remove "$CIVO_CLUSTER_NAME" --region "$CIVO_REGION" --yes' }
          ]
        },
        {
          id: 'aws-eks', label: 'AWS EKS optional', body: [
            { type: 'section', title: 'When to use this path', content: 'Use EKS only when you specifically want AWS-managed Kubernetes experience. It is useful later, but it is not the main CKAD preparation path because it adds more AWS-specific machinery and normally costs more.' },
            { type: 'checklist', title: 'Account and prerequisites', items: ['AWS account with billing enabled.', 'AWS CLI installed and authenticated, or AWS CloudShell access.', 'eksctl installed.', 'kubectl installed locally.', 'Permission to create EKS clusters, IAM roles, EC2 nodes, VPC resources, and security groups.'] },
            { type: 'callout', tone: 'warning', title: 'Estimated monthly cost', content: 'Approximate cost: USD 110-160/month or more because EKS includes a managed control plane plus worker nodes, storage, public IPv4 addresses, possible Elastic IPs, and network charges. Delete the cluster when finished.' },
            { type: 'code', title: 'Set EKS variables', language: 'bash', code: `export EKS_CLUSTER_NAME=kubetasker-ckad
export AWS_REGION=us-west-2` },
            { type: 'code', title: 'Create the optional EKS lab', language: 'bash', code: `eksctl create cluster \
  --name "$EKS_CLUSTER_NAME" \
  --region "$AWS_REGION" \
  --nodes 1 \
  --node-type t3.small \
  --managed` },
            { type: 'code', title: 'Verify EKS nodes', language: 'bash', code: 'k get nodes -o wide' },
            { type: 'code', title: 'Deploy and verify KubeTasker API', language: 'bash', code: deployKubeTaskerCommands },
            { type: 'code', title: 'Clean up application resources', language: 'bash', code: 'k delete namespace kubetasker --ignore-not-found' },
            { type: 'code', title: 'Delete the EKS lab after practice', language: 'bash', code: 'eksctl delete cluster --name "$EKS_CLUSTER_NAME" --region "$AWS_REGION"' }
          ]
        }
      ]
    }
  ],
  explanation: 'A good CKAD preparation lab starts with one clear provider choice, a ready cloud account, authenticated CLI, kubectl access, copyable setup content, verification, KubeTasker API practice, and cleanup. AWS EC2 with kubeadm and Cilium is the preferred VM-based path. DigitalOcean and Civo are faster managed alternatives. EKS is optional and can cost more.',
  starterThought: 'First choose one provider tab, prepare that account and CLI, create the lab, verify the cluster, deploy KubeTasker API, then clean up.',
  hints: ['Use k as shorthand for kubectl throughout the lessons.', 'Every provider path must have a cleanup command.', 'For the AWS kubeadm path, verify Cilium with cilium status --wait before continuing.', 'Do not deploy KubeTasker until k get nodes works.'],
  relatedConcepts: ['kubectl', 'kubeadm', 'Cilium', 'CloudFormation', 'managed Kubernetes', 'cleanup', 'KubeTasker'],
  followUpQuestions: ['Which provider path is best for your current practice session?', 'How will you confirm that the cluster is ready before deploying KubeTasker?', 'Which command destroys the full cloud environment when you finish?'],
  finalTakeaway: 'Choose one provider path, copy each block one at a time, create the lab, verify the cluster, deploy KubeTasker API with k, then clean up the application and delete the cloud environment when done.',
  metadata: { reviewStatus: 'approved', visibility: ['dev', 'prod'], source: 'original', estimatedTimeSeconds: 420 }
});

export default problem;
