# 8: Infrastructure as Code (IaC) Synthesis Paradigms


### 22. Declarative IaC (CloudFormation/Terraform) vs. Imperative IaC (AWS CDK)
*   **What**: The choice between two deployment philosophies: Declarative IaC utilizes static templates (YAML/JSON in CloudFormation or HCL in Terraform) to declare the target state of the infrastructure; Imperative IaC uses standard programming languages (Python, TypeScript, Go) to programmatically synthesize those static templates.
*   **Why**: Declarative models lack native loops, conditional logic, and abstraction mechanisms, resulting in verbose, copy-pasted files for complex environments. The AWS CDK addresses this by allowing engineers to use software engineering design patterns for infrastructure.
*   **Where**: Used to provision multi-region VPC networking, database clusters, and container deployments safely and repeatedly.
*   **How**: Engineers write TypeScript or Python code defining resources as CDK constructs. Running `cdk synth` compiles the code into standard CloudFormation JSON/YAML. Running `cdk deploy` pushes the compiled template to AWS.
*   **Construct Layers (CDK)**:
    *   **Layer 1 (L1) Constructs**: Raw representation of resources, mapping one-to-one with CloudFormation types (no sensible defaults).
    *   **Layer 2 (L2) Constructs**: Opinionated classes curated by AWS incorporating sensible defaults, automatic security rules, and boilerplate configurations.
    *   **Layer 3 (L3) Constructs**: High-level solutions patterns that bundle multiple complex resources (e.g., `ApplicationLoadBalancedFargateService`).
*   **Advantages**:
    *   **CDK (Imperative)**: Full power of programming languages (loops, conditions, variables), object-oriented design, easily unit-tested.
    *   **Terraform/CloudFormation (Declarative)**: Simpler learning curve, predictable dry-runs, and clear static template readability.
*   **Disadvantages**:
    *   **CDK (Imperative)**: High risk of programmers writing bad loops that provision unintended resources, and requires a compilation and environment bootstrapping step.
    *   **Declarative**: High code duplication and difficult to split into dynamic modules.
*   **Mental Model**: Architecting a neighborhood. Declarative IaC is drawing a complete, massive blueprint manually illustrating every single brick, screw, and pipe for all 100 houses. Imperative CDK is writing a computer program that automatically generates the blueprint based on a parameter (e.g., `for (i=0; i<100; i++) { buildHouse() }`).
*   **Example**: Writing 15 lines of TypeScript CDK code using the L3 `ApplicationLoadBalancedFargateService` construct, which synthesizes into 700 lines of highly complex raw CloudFormation YAML.
*   **Big Picture Resources**: [AWS Cloud Development Kit (CDK) Developer Guide](https://docs.aws.amazon.com/cdk/v2/guide/home.html)

---
---

## 🛠️ Infrastructure as Code (IaC) Enterprise Architectures
Deploying resources by hand violates continuous delivery methodologies. The templates below establish automated state persistence and secure drift remediation.

### 1. Standard Production Terraform State Backend (S3 + DynamoDB)
Configure your Terraform environment to persist its state file inside S3 with absolute file locking enabled via DynamoDB to prevent concurrent execution conflicts:

```hcl
terraform {
  required_version = ">= 1.5.0"
  
  backend "s3" {
    bucket         = "production-tfstate-123456789012"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "production-tflocks"
    encrypt        = true
  }
}
```

### 2. High-Level AWS CDK Constructs (TypeScript Pattern)
AWS CDK compiles object-oriented code into native CloudFormation templates. Below is a secure L2 bucket construct containing dynamic lifecycle routines:

```typescript
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class SecureStorageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'SecureDataBucket', {
      bucketName: 'enterprise-secure-vault-production-123',
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      lifecycleRules: [
        {
          id: 'ArchiveOldObjects',
          enabled: true,
          expiration: cdk.Duration.days(365),
          transitions: [
            {
              storageClass: s3.StorageClass.GLACIER,
              transitionAfter: cdk.Duration.days(90),
            }
          ]
        }
      ]
    });
  }
}
```