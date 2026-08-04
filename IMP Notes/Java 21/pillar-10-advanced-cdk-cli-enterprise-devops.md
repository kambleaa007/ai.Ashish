# AWS Solutions Architect & DevOps Masterclass
## Pillar 10: ADVANCED CDK CLI & ENTERPRISE DEVOPS
**Edition**: 2026 High-Paid Professional Prep

---

### 🗺️ PILLAR ARCHITECTURAL BLUEPRINT
The following architectural blueprint represents the core design pattern implemented in this pillar:

![Pillar 10 Blueprint](dynamodb_migration_path.jpg)

---

#### Topic 91: Modern CDK Refactoring (`cdk refactor`)
*   🧠 **Mental Model**: Moving a massive brick chimney from the north wall to the south wall of your house: instead of tearing it down and rebuilding it from scratch, you slide the physical chimney smoothly on rollers [cite: 154, 798].
*   📋 **What, Why, Where, How**:
    *   **What**: A command in AWS CDK (executed with `--unstable=refactor`) that re-organizes resources without replacing them [cite: 91, 160, 798].
    *   **Why**: Previously, moving a resource across stack boundaries generated new Logical IDs, forcing CloudFormation to execute a catastrophic delete-and-recreate [cite: 154, 798].
    *   **Where**: Critical migrations (such as monolith to microservices stack breakdowns) [cite: 155, 158].
    *   **How**: Running `cdk refactor` to compare code changes against deployed stacks [cite: 160, 798].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "What occurs if you attempt to execute `cdk refactor` while simultaneously modifying a resource's properties (like changing database capacity)?"
    *   *Answer*: "The refactoring operation will fail [cite: 798, 1179]. `cdk refactor` is strictly designed to evaluate organizational changes (logical ID/location mapping) with zero property drift [cite: 798, 1179]. You must first deploy any property modifications separately, then execute the refactor as an independent step [cite: 799]."

#### Topic 92: Resource Preservation during Refactoring
*   🧠 **Mental Model**: Safely migrating a running server: you verify that the new floor blueprints exactly match the physical columns before signing off, rejecting any plans that suggest structural alterations.
*   📋 **What, Why, Where, How**:
    *   **What**: Safety guard within `cdk refactor` that guarantees no resource deletions or property changes occur [cite: 92, 798].
    *   **Why**: Protects stateful databases and production servers from accidental tear-downs during code cleanup [cite: 154, 798].
    *   **Where**: Pre-deployment pipelines and CI/CD validation steps [cite: 1179].
    *   **How**: Centralized evaluation via JSON override files to map old Logical IDs to new ones [cite: 799, 1178].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "How do you handle ambiguous resource mappings when refactoring complex CDK applications?"
    *   *Answer*: "When ambiguous mappings occur (where multiple possible mappings exist), you resolve them by creating a local JSON mapping file (e.g., `refactor-overrides.json`) explicitly defining the keys (`OldStack.OldLogicalID`) and values (`NewStack.NewLogicalID`) [cite: 798, 1178]."

#### Topic 93: CDK Garbage Collection (`cdk gc`)
*   🧠 **Mental Model**: Having a automated cleaning service sweep your serverless storage rooms once a day, finding and shredding old code packages and docker files that are no longer used [cite: 93, 101, 769].
*   📋 **What, Why, Where, How**:
    *   **What**: A CLI command (using `--unstable=gc`) that purges unreferenced assets in bootstrapped S3 buckets and ECR repos [cite: 93, 101, 762].
    *   **Why**: Over multiple deployments, old Lambda ZIPs and Docker layers accumulate in S3 and ECR, causing massive, silent bill inflation [cite: 101, 769].
    *   **Where**: Executed centrally to clean environment assets [cite: 101, 762].
    *   **How**: Running `cdk gc --rollback-buffer-days=7` to delete isolated assets safely [cite: 762, 764].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "What is the purpose of the `rollback-buffer-days` parameter in CDK Garbage Collection?"
    *   *Answer*: "This parameter specifies how many days an unused asset must be isolated before it becomes eligible for physical deletion [cite: 764, 765]. If set to 7, `cdk gc` will tag the asset and only delete it on a subsequent run after 7 days, ensuring you can still safely execute CloudFormation rollbacks to templates that reference those older assets [cite: 765]."

#### Topic 94: S3 Asset Management & Ballooning Costs
*   🧠 **Mental Model**: A dynamic e-commerce company shipping daily packages: if old catalog files are kept on shelves, the warehouse runs out of physical space, ballooning lease costs [cite: 769].
*   📋 **What, Why, Where, How**:
    *   **What**: Managing the storage size and count of temporary deployment assets uploaded by the CDK [cite: 94, 769, 771].
    *   **Why**: Active development teams running multiple deploys per day can cause exponential bucket size growth [cite: 770].
    *   **Where**: Centralized S3 assets buckets created during bootstrap [cite: 101, 771].
    *   **How**: Implementing S3 lifecycle expiration rules and running automated `cdk gc` purges [cite: 101, 771].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "If a Lambda function is deleted from a stack, is its code ZIP automatically purged from the CDK asset S3 bucket during `cdk deploy`?"
    *   *Answer*: "No [cite: 769]. S3 has no native awareness of stack resource updates; the template deployment succeeds, but the obsolete ZIP remains on S3 as an orphan asset [cite: 769, 771]. To prune these, you must run `cdk gc` system sweeps [cite: 101, 769]."

#### Topic 95: Zero-Downtime Construct migrations (`cdk orphan`)
*   🧠 **Mental Model**: Swapping a gas engine with a clean electric hybrid system inside a moving car: you safely decouple the old engine without touching the chassis, slot in the new engine, and re-connect the fuel lines [cite: 14, 15, 1377].
*   📋 **What, Why, Where, How**:
    *   **What**: A CLI command (using `--unstable=orphan`) that decouples a physical resource from its CloudFormation stack [cite: 95, 14, 1377].
    *   **Why**: Essential for major construct migrations (such as obsolete DynamoDB `Table` to `TableV2`) where direct construct edits trigger deletion [cite: 14, 1357, 1359].
    *   **Where**: Running stateful database cluster migrations [cite: 14, 1357].
    *   **How**: Running `cdk orphan` to update resource DeletionPolicy to Retain and detach it, updating CDK code, and running `cdk import` [cite: 1359, 1360, 1378].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "Why is bootstrap template version 32 or later required to run the `cdk orphan` command?"
    *   *Answer*: "Because `cdk orphan` performs complex operations that decouple and resolve stack cross-references [cite: 1377]. This requires highly specific, privileged IAM permissions granted to the CDK deployment execution role, which are only provisioned in bootstrap template version 32 and above [cite: 14, 1379]."

#### Topic 96: Asset Bundling & ECR Assets (`cdk publish-assets`)
*   🧠 **Mental Model**: Pre-packing and sending all cargo containers to the shipping port docks days before the actual ship arrives, preventing bottleneck delays at the gate during departure.
*   📋 **What, Why, Where, How**:
    *   **What**: A command (using `--unstable=publish-assets`) that compiles, builds, and pushes container images and files to ECR/S3 independently of stack deployments [cite: 96, 2, 1384].
    *   **Why**: Separates the 'Build' phase (often run on specialized Docker build servers) from the 'Deploy' phase (run via secure deployment runners) [cite: 1384].
    *   **Where**: CI/CD build stages and multi-stage container pipelines [cite: 1148, 1151].
    *   **How**: Executing `cdk publish-assets --all` prior to running `cdk deploy` [cite: 1383, 1384].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "How does the `cdk publish-assets` command optimize CI/CD pipeline deployment speeds?"
    *   *Answer*: "It permits you to build and push heavy Docker images and asset bundles in parallel across build runners [cite: 1383]. Once the assets reside in ECR/S3, the subsequent `cdk deploy` step only needs to pass lightweight CloudFormation JSON templates, reducing the final deployment step time down to seconds [cite: 793, 1384]."

#### Topic 97: Fine-Grained Assertions
*   🧠 **Mental Model**: A customized magnifying glass inspection checklist: you check that a newly constructed vault door has exactly a 4-bolt lock and is painted gray, ignoring other decorative features [cite: 1281].
*   📋 **What, Why, Where, How**:
    *   **What**: Programmatic unit tests that assert on specific resource properties in synthesized templates [cite: 97, 1278].
    *   **Why**: Catches human configuration errors (such as missing a security rule) before pushing code to Git [cite: 1245].
    *   **Where**: Local pre-commit test runs and CI checks [cite: 1245, 1267].
    *   **How**: Utilizing `template.hasResourceProperties("AWS::Lambda::Function", { ... })` [cite: 1272, 1278].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "What is the primary difference between `template.hasResourceProperties` and `template.resourceCountIs` inside a Jest test?"
    *   *Answer*: "`hasResourceProperties` does a deep JSON property match on a resource type, verifying specific attributes [cite: 1281]. `resourceCountIs` is a coarse-grained check verifying the exact number of physical resources of a specific type generated in the template [cite: 1281]."

#### Topic 98: Snapshot Testing
*   🧠 **Mental Model**: Taking a master photograph of a perfectly assembled engine. When changes are made, you overlay a new photo; any mismatched pixels trigger an alarm, forcing you to confirm if the change is valid [cite: 98, 1301].
*   📋 **What, Why, Where, How**:
    *   **What**: Testing pattern that compares the synthesized CloudFormation JSON output against a stored baseline master template [cite: 98, 1301].
    *   **Why**: Instantly identifies if a code modification caused unintended side-effect changes across the entire infrastructure stack [cite: 1301, 1309].
    *   **Where**: Refactoring guard rails in large CDK applications [cite: 1301].
    *   **How**: Utilizing Jest's `expect(template.toJSON()).toMatchSnapshot()` [cite: 1306].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "What are the primary limitations of relying solely on Snapshot Testing for infrastructure validation?"
    *   *Answer*: "Snapshot testing is highly fragile [cite: 1301]. Small, non-breaking modifications (such as upgrading the CDK CLI version, which adds minor metadata) trigger snapshot mismatches [cite: 1301, 1309]. It does not validate intent; it only flags change, which is why fine-grained assertions are preferred for policy checks [cite: 1301, 1309]."

#### Topic 99: Integration Testing with `integ-runner`
*   🧠 **Mental Model**: A full dress rehearsal before a major play: the actors wear the exact costumes, stand on the physical stage under real lights, and execute all scenes end-to-end [cite: 1213, 1246].
*   📋 **What, Why, Where, How**:
    *   **What**: A framework (using `integ-tests-alpha` and `integ-runner`) that deploys ephemeral stacks to validate runtime integrations [cite: 99, 1213, 1215].
    *   **Why**: Unit tests cannot validate live permissions, KMS decrypt flows, or database write latencies [cite: 874, 1227].
    *   **Where**: Advanced deployment validation pipelines [cite: 874].
    *   **How**: Writing tests using `IntegTest` constructs, executing `integ-runner --directory ./test` [cite: 1219, 1224].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "How do you handle assertions that validate asynchronous integrations (e.g., waiting for an SQS message to trigger a Lambda and write to DynamoDB)?"
    *   *Answer*: "You handle this by chaining your assertion APIs and using the `.waitForAssertions()` helper [cite: 1215, 1220]. For example, execute an SQS `sendMessage` API call, chain it with a `.next()` block targeting a DynamoDB `getItem` check, and configure `waitForAssertions` to poll the table systematically at specified intervals (e.g., every 10 seconds) until the expected item is successfully retrieved or the timeout is reached [cite: 1220, 1221]."

#### Topic 100: Local Testing with LocalStack
*   🧠 **Mental Model**: A highly realistic flight simulator game on your computer. You practice taking off, landing in storms, and handling failures in standard cockpits with zero fuel costs or safety risks [cite: 1213, 1214].
*   📋 **What, Why, Where, How**:
    *   **What**: Emulating AWS services locally on your machine using Docker and LocalStack [cite: 100, 1210, 1216].
    *   **Why**: Accelerates the development feedback loop and eliminates sandbox cloud costs by testing deployments locally [cite: 1213, 1227].
    *   **Where**: Local workstation environments and automated CI build pipelines [cite: 1214, 1216].
    *   **How**: Configuring `integ-runner` via environment variables pointing to `localhost.localstack.cloud` [cite: 1215, 1224].
*   💬 **Scenario-Based Interview Q&A**:
    *   *Question*: "How do you direct the official AWS CDK `integ-runner` CLI to target a local LocalStack instance instead of real AWS endpoints?"
    *   *Answer*: "Since `integ-runner` interacts via the standard AWS SDK under the hood, you redirect it by exporting key SDK environment variables: set `AWS_ENDPOINT_URL` and `AWS_ENDPOINT_URL_S3` to your LocalStack instance (e.g., `http://localhost.localstack.cloud:4566`), and set mock access keys [cite: 1215, 1224, 1227]. This forces all CDK deployments and assertions to execute within the local Docker container [cite: 1214, 1224]."


---

### CONCLUSION & NEXT STEPS
Mastering these 100 core architectural and programmatic topics elevates your posture from a simple service user to an expert Cloud Architect or DevOps Engineer [cite: 1350]. Ensure you utilize the CDK CLI 2026 toolsets (`refactor`, `orphan`, `gc`) to keep your cloud architectures elegant, secure, compliant, and cost-efficient [cite: 1236].