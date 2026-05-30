# CKAD Preparation: Create and destroy your cloud lab

This preparation section gives learners a practical Kubernetes lab before they begin the KubeTasker CKAD stages.

The goal is not to promise a guaranteed CKAD result. The goal is to remove infrastructure guesswork so learners can spend their practice time on Kubernetes commands, verification, debugging, and repetition.

## What the learner must already have

Before using these materials, the learner is expected to have:

- a cloud account for the provider they choose;
- credentials configured locally for that provider CLI;
- `kubectl` installed;
- the shorthand alias `k` available or the habit of replacing `k` with `kubectl`;
- enough budget awareness to delete the lab when they finish practicing.

## Recommended provider paths

| Path | Best for | Notes |
|---|---|---|
| AWS EC2 + kubeadm | Linux Foundation-style VM practice | Preferred path for command fluency. Creates a small single-node Kubernetes lab on EC2. |
| DigitalOcean Kubernetes | Fast managed-cluster setup | Easier to create/delete, but hides some node bootstrap details. |
| Civo Kubernetes | Lightweight managed-cluster setup | Good for quick practice when available in the learner's region. |
| AWS EKS | Optional only | Useful later, but not the main CKAD prep path because it adds more AWS-specific machinery. |

## Downloadable files

All downloadable files are served from `/downloads/ckad/`.

| File | Purpose |
|---|---|
| [`kubetasker-ckad-aws-cloudformation.yaml`](/downloads/ckad/kubetasker-ckad-aws-cloudformation.yaml) | AWS CloudFormation template for the kubeadm EC2 lab. |
| [`aws-create-kubetasker-lab.sh`](/downloads/ckad/aws-create-kubetasker-lab.sh) | Creates the AWS stack. |
| [`aws-status-kubetasker-lab.sh`](/downloads/ckad/aws-status-kubetasker-lab.sh) | Shows stack status, outputs, and tagged EC2 instances. |
| [`aws-stop-kubetasker-lab.sh`](/downloads/ckad/aws-stop-kubetasker-lab.sh) | Stops the EC2 lab instance to pause compute cost. |
| [`aws-start-kubetasker-lab.sh`](/downloads/ckad/aws-start-kubetasker-lab.sh) | Starts the EC2 lab instance again. |
| [`aws-delete-kubetasker-lab.sh`](/downloads/ckad/aws-delete-kubetasker-lab.sh) | Deletes the AWS stack. |
| [`do-create-kubetasker-lab.sh`](/downloads/ckad/do-create-kubetasker-lab.sh) | Creates a small DigitalOcean Kubernetes cluster. |
| [`do-delete-kubetasker-lab.sh`](/downloads/ckad/do-delete-kubetasker-lab.sh) | Deletes the DigitalOcean cluster. |
| [`civo-create-kubetasker-lab.sh`](/downloads/ckad/civo-create-kubetasker-lab.sh) | Creates a small Civo Kubernetes cluster. |
| [`civo-delete-kubetasker-lab.sh`](/downloads/ckad/civo-delete-kubetasker-lab.sh) | Deletes the Civo cluster. |
| [`k8s-stage-01-commands.sh`](/downloads/ckad/k8s-stage-01-commands.sh) | Copy/paste command reference for the first KubeTasker foundation deployment. |

## Fastest AWS path

Download the AWS template and scripts into one directory, then run:

```bash
chmod +x aws-*-kubetasker-lab.sh

./aws-create-kubetasker-lab.sh \
  --key-name YOUR_EC2_KEY_PAIR \
  --ssh-location YOUR_PUBLIC_IP/32
```

Check status:

```bash
./aws-status-kubetasker-lab.sh
```

SSH to the public IP shown by the status script:

```bash
ssh ubuntu@PUBLIC_IP
```

Verify Kubernetes on the instance:

```bash
k get nodes
k get pods -A
```

When finished, delete the lab:

```bash
./aws-delete-kubetasker-lab.sh
```

## How to choose

Use AWS EC2 + kubeadm when the learner wants VM-based practice close to a hands-on Linux/Kubernetes environment.

Use DigitalOcean or Civo when the learner wants to start faster and focus mainly on `kubectl` practice.

Use EKS only after the learner already understands basic Kubernetes objects and wants provider-managed AWS experience.

## Safety reminder

Cloud labs can cost money while running. Stop or delete the environment whenever the practice session ends. Prefer delete when the learner does not need to keep cluster state.