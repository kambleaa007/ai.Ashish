# 3: AWS Security, Governance, & Access Control


### 8. Identity & Access Management (Users, Groups, Roles, & Policies)
*   **What**: The fundamental cloud-native access control engine that authenticates (verifies identity) and authorizes (verifies permissions) all interactions within an AWS environment.
*   **Why**: Operating on a public cloud requires a strict zero-trust boundary. Every single API action—from spinning up an virtual instance to fetching an image—must be verified against security policies to prevent security breaches and billing leaks.
*   **Where**: Pre-installed as the global default control plane covering every single AWS resource and service.
*   **How**: Security administrators define IAM Policies (JSON documents expressing permissions), assign them to permanent human Identities (Users/Groups), or attach them to Roles that can be assumed dynamically by humans or AWS services (like EC2).
*   **Advantages**:
    *   **Fine-Grained Auditing**: Enforces least privilege down to individual API operations and specific resource IDs.
    *   **Dynamic Security**: IAM Roles issue temporary, auto-rotating API keys via the AWS Security Token Service (STS), eliminating hardcoded, high-risk permanent security keys.
*   **Disadvantages**:
    *   **Administrative Friction**: Managing complex nested JSON permissions across multiple teams can easily cause operational roadblocks if developers are accidentally blocked from resources.
*   **Mental Model**: A high-security research laboratory. Users are individual employees. Groups are departments (engineering, accounting). Roles are physical badges kept in locked key boxes that can be temporarily checked out by authorized staff or robotic equipment for specific tasks. Policies are the written rules programmed into the keycards defining exactly which doors they unlock.
*   **Example**: Creating an IAM Role with an attached JSON policy permitting S3 read-only access and assigning that role as an Instance Profile to an EC2 web server, allowing it to download website media from S3 without storing hardcoded API credentials.
*   **Big Picture Resources**: [AWS IAM User Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/)

---

### 9. Secrets Manager vs. SSM Parameter Store
*   **What**: Two distinct configuration storage services: AWS Secrets Manager is designed specifically for encrypted sensitive credentials with built-in rotation scripts, while Systems Manager (SSM) Parameter Store is a general-purpose hierarchical configuration and simple metadata store.
*   **Why**: Storing passwords, database connection strings, or API tokens in plain-text environment variables or committing them to git repositories leads to immediate credential exposure and corporate security breaches.
*   **Where**: Used to dynamically load database passwords, stripe keys, and configuration states at application runtime.
*   **How**: Credentials are saved as encrypted strings, and application code fetches them dynamically during boot using the AWS SDK (e.g., Python `boto3`). Secrets Manager can integrate directly with RDS to automatically rotate database passwords without downtime.
*   **Advantages**:
    *   **Secrets Manager**: Built-in automatic credential rotation, cross-account sharing, and tight integration with AWS database services.
    *   **SSM Parameter Store**: Completely free for standard parameters, simple hierarchical design, and supports simple KMS encryption.
*   **Disadvantages**:
    *   **Secrets Manager**: Costs $0.40 per secret/month plus API retrieval costs, which can quickly inflate billing for microservices.
    *   **SSM Parameter Store**: Lacks native automatic rotation scripts and has a smaller maximum payload size limit.
*   **Mental Model**: A safe vs. a filing cabinet. Secrets Manager is a high-security combination safe with guards who change the lock combination every 30 days. SSM Parameter Store is a clean office filing cabinet with separate folders—mostly storing public office maps, with a few small locked files.
*   **Example**: Storing database credentials in Secrets Manager so that an AWS Lambda function queries Secrets Manager on boot to retrieve the encrypted connection string and open a Postgres database connection.
*   **Big Picture Resources**: [AWS Secrets Management Best Practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html)

---
---

## 🛠️ Enterprise AWS IAM Policy Templates & Trust Models
To enforce the principle of least privilege, services (like ECS tasks or EKS pods) must assume roles dynamically using AWS STS. Below is the dual-policy model required to establish this trust interface.

### 1. IAM Role Trust Policy (Who can assume this role?)
This trust policy permits the ECS Task Execution engine to assume this role:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### 2. IAM Role Permission Policy (What can this role do?)
This policy restricts permissions exclusively to fetching configurations from SSM Parameter Store and Secrets Manager:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameters",
        "ssm:GetParameter"
      ],
      "Resource": "arn:aws:ssm:us-east-1:123456789012:parameter/production/app/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:123456789012:secret:production/db-creds-*"
    }
  ]
}
```

### 🔍 Secret Rotation Architectural Flow
```
 ┌─────────────┐       Schedules       ┌──────────────┐      Rotates Secret      ┌─────────────────┐
 │ AWS Secrets │ ────────────────────► │  AWS Lambda  │ ───────────────────────► │ Database Engine │
 │   Manager   │ ◄──────────────────── │  Rotator     │ ◄─────────────────────── │ (RDS Postgres)  │
 └─────────────┘     Saves New Secret  └──────────────┘   Verifies Connection    └─────────────────┘
```

### 🔍 Security CLI & Troubleshooting Command Set
```
# Determine current IAM Identity and active permissions
aws sts get-caller-identity

# Manually test assuming a specific IAM role via CLI
aws sts assume-role --role-arn "arn:aws:iam::123456789012:role/ProductionReadOnly" --role-session-name "CLI-Session"

# Decrypt a permission denial payload
aws sts decode-authorization-message --encoded-message <BASE64_MESSAGE>
```