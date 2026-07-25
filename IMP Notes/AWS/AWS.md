### Core Infrastructure as Code (IaC) & AWS CDK Interview Q&A

#### 1. What is Infrastructure as Code (IaC), and why is a declarative model preferred over an imperative one?
*   **Answer:** **Infrastructure as Code (IaC) is the operational discipline of provisioning and managing cloud infrastructure using version-controlled, declarative configuration files**. It ensures that environments are repeatable, reviewable, auditable, and free from configuration drift.
*   **Declarative vs. Imperative:**
    *   **Declarative IaC** (such as CloudFormation or synthesized CDK JSON/YAML outputs) **defines the desired end-state of the system**. The underlying orchestration engine calculates the differences between the current real-world state and your target state, safely executing updates, creations, and deletions. 
    *   **Imperative IaC** relies on step-by-step commands (e.g., shell scripts or raw AWS CLI commands) to provision resources. Imperative scripts are fragile, highly prone to partial-failure states (which require manual rollback), and extremely difficult to safely run repeatedly without introducing duplicate resource errors.

---

#### 2. How does the AWS Cloud Development Kit (CDK) bridge the gap between imperative programming languages and declarative deployments?
*   **Answer:** **The AWS CDK allows developers to define cloud infrastructure using standard programming languages** (such as TypeScript, Node.js, or Java) while maintaining the safety of a declarative engine. 
*   **How it Works:**
    1.  Developers write object-oriented code to define infrastructure, using software engineering paradigms like loops, conditionals, inheritance, and packages.
    2.  During the **synthesis phase (`cdk synth`)**, the CDK engine compiles and translates the imperatively written code into **declarative AWS CloudFormation templates** (JSON or YAML).
    3.  This synthesized CloudFormation template is then deployed to AWS, ensuring that the actual provisioning remains **fully transactional and desired-state-controlled**.

---

#### 3. What are AWS CDK "Constructs", and how do they differ from "Stacks" and "Apps"?
*   **Answer:** The AWS CDK structures infrastructure logically as a tree hierarchy composed of three key entities:
    *   **Constructs:** The basic building blocks of CDK applications. They encapsulate one or more AWS resources and their configurations. Constructs range from low-level CloudFormation resources (L1 constructs, prefixed with `Cfn`), to standard AWS-curated wrappers with sensible defaults (L2 constructs), to highly opinionated, multi-service architectures (L3 constructs, like an Application Load Balanced Fargate Service).
    *   **Stacks:** The **basic unit of deployment**. All resources defined within a Stack class are synthesized into a single CloudFormation stack, which can be deployed to a target AWS account and region.
    *   **Apps:** The **root container of your entire CDK project**. An App can house multiple Stacks, allowing you to define, configure, and deploy multi-stack, multi-environment, or multi-region applications as a single cohesive unit.

---

#### 4. Why is it a production best practice to parameterize CDK templates rather than hardcoding environment-specific configurations?
*   **Answer:** To enforce continuous delivery and reliability, **you must use the exact same CDK infrastructure templates/classes across development, test, and production environments, varying only the parameters**.
*   **The Risk of Hardcoding:** Hardcoding configuration details (like domain names, instance sizes, or bucket names) in separate templates creates massive environmental divergence. Parameterizing these configurations (via parameters, context values, or external YAML configuration mappings) ensures that **the exact infrastructure configuration validated in test/staging is promoted to production**, completely eliminating deployment bugs caused by configuration differences.

---

#### 5. How do you automate and secure generative AI workloads (like Amazon Bedrock and data pipelines) using the AWS CDK?
*   **Answer:** According to the AWS Well-Architected Framework, automating generative AI lifecycles requires capturing every pipeline component—such as Amazon Bedrock, API Gateway, Lambda, and S3 data stores—within version-controlled CDK stacks.
*   **CDK Security Best Practices:**
    *   **Network Isolation:** Use CDK to provision **private VPC subnets** and configure **VPC Endpoints (AWS PrivateLink)** so that internal application layers, Lambdas, and databases (like RDS PostgreSQL with pgvector) interact with Amazon Bedrock and KMS securely without traversing the public internet.
    *   **Identity & Agency Control:** Use CDK to define **least-privilege IAM Execution Roles**, setting explicit **Permission Boundaries** at the role level to prevent accidental privilege escalation.
    *   **Safety Integration:** Use the CDK to declare **Amazon Bedrock Guardrails** and **Input/Output Filters** at the endpoint layer to prevent prompt injection and data poisoning.

---

