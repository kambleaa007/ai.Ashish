# Senior AWS Cloud Developer & GenAI Engineer: Q&A & Coding Challenge

This document provides a highly comprehensive, technically rigorous set of mock interview questions and a production-grade coding challenge. It is designed to evaluate candidates at a staff or senior level, bridging modern cloud infrastructure with high-performance Java 21 backend design and state-of-the-art Generative AI orchestration on AWS.

---

## Part 1: The Senior AWS & GenAI Mock Interview (10 Architectural Q&As)

### Question 1: IAM Permission Boundaries vs. Service Control Policies (SCPs)
**How do you design a secure, multi-account AWS environment for federated AI development teams? Explain the precise operational intersection between Service Control Policies (SCPs) and IAM Permission Boundaries.**

#### Expert Spoken-Aloud Answer
"In a multi-account AWS structure managed via AWS Organizations and Control Tower, security governance relies on a layered defense-in-depth model [44]. 

**Service Control Policies (SCPs)** are organization-level guardrails that establish the absolute maximum permissions for member accounts [44, 158]. They are attached to Organizational Units (OUs) or accounts and act as a coarse-grained filter. Crucially, SCPs apply to all identities in the account (including the root user) but do not grant any permissions on their own. They simply restrict what can be granted downstream.

**IAM Permission Boundaries**, on the other hand, are applied directly to IAM roles or users within an account [150, 158]. They set the maximum permissions that an identity-based policy can ever grant to a specific principal [150, 158]. This is an indispensable tool for delegating IAM administration. For instance, we can safely allow Lead AI Engineers to create IAM roles for their SageMaker jobs or Lambda functions by enforcing a condition that any role they create *must* have a specific Permission Boundary attached [150, 158].

The operational intersection is mathematical: **an action is only allowed if it is permitted by the SCP, permitted by the Permission Boundary, and explicitly granted by the Identity-Based (or Resource-Based) Policy** [158]. If any layer omits or denies the permission, the evaluation immediately short-circuits to an implicit or explicit deny."

---

### Question 2: High-Performance JSON Parsing & Garbage Collection
**When processing large, highly structured AI-generated payloads (such as multi-megabyte JSON outputs from Claude or Nova models), what are the performance and GC implications of Java 21 vs. Python 3.12? How do you optimize the JVM to prevent memory leaks and minimize latency?**

#### Expert Spoken-Aloud Answer
"When parsing heavy, structured JSON payloads at scale, Java 21 demonstrates a massive throughput and memory advantage over Python 3.12 [220]. In our benchmarks, **Java's Jackson library parses JSON at ~2.1 GB/s, outperforming Python's native `orjson` (~0.4 GB/s) by roughly five times** [219, 220]. 

In Python, the Global Interpreter Lock (GIL) blocks true parallel thread execution during CPU-bound tasks like serialization and tokenization [224]. Even under asynchronous event loops (like `asyncio`), CPU-intensive JSON parsing causes thread blocking, which degrades concurrent performance [224, 233]. Java 21 bypasses this entirely using **Virtual Threads (Project Loom)**, which mount onto platform threads and allow non-blocking concurrent I/O with negligible memory overhead (~1 MB per idle thread versus ~8 MB per Python coroutine) [218, 220, 222].

To handle high-throughput, multi-gigabyte JSON response payloads without latency spikes or memory leaks, we configure the JVM with the **Z Garbage Collector (ZGC)** or G1 GC [222]. ZGC performs thread-safe compaction and reference coloring concurrently with application threads, keeping GC pauses under **1 millisecond** even for massive heap sizes [6, 44]. We also utilize JIT **Escape Analysis** to stack-allocate short-lived string representations and avoid heap fragmentation [6, 48]."

---

### Question 3: Serverless Cold Start Mitigation: SnapStart & Project Leyden
**AWS Lambda cold starts are notoriously problematic for latency-sensitive Java microservices. How do AWS Lambda SnapStart, Project Leyden, and GraalVM Native Image resolve this, and what are their respective architectural trade-offs?**

#### Expert Spoken-Aloud Answer
"Standard Java runtime startup on AWS Lambda can take 1.8 to 2 seconds due to JVM initialization, class loading, and JIT compilation [220, 226]. We can mitigate this using three distinct technologies:

1.  **AWS Lambda SnapStart:** This feature is a game-changer for managed Java runtimes [29, 373]. During deployment, SnapStart initializes the runtime, runs compilation, and executes static initialization blocks [29, 374]. It then snapshots the entire VM memory state, encrypts it, and caches it [29, 374]. On subsequent triggers, Lambda restores the snapshot in **under 100 milliseconds**, completely bypassing the standard class-loading hot-path [29, 373].
2.  **Project Leyden:** Project Leyden introduces AOT (Ahead-of-Time) class-loading caches and metadata optimizations to the standard JVM [220]. In JDK 24, Leyden drops cold starts down to ~0.6 seconds, bringing the JVM into a comparable range with CPython (80–200ms) without sacrificing peak JIT performance [220].
3.  **GraalVM Native Image:** GraalVM compiles Java bytecode ahead-of-time into a native platform binary, bypassing the JVM entirely [100, 226]. This results in sub-50ms cold starts [232]. However, it comes at the cost of longer build times, a 10-20% drop in peak throughput (due to the lack of runtime profile-guided optimization), and limitations on reflection-heavy Spring Boot modules that require explicit native compilation hints [232]."

---

### Question 4: SAGA Pattern in Distributed Cloud-Native Architectures
**In an event-driven AI microservice ecosystem, how do you enforce consistency without two-phase commit (2PC) protocols? Compare Orchestration SAGA and Choreography SAGA, and explain how to design compensations.**

#### Expert Spoken-Aloud Answer
"In modern cloud-native architectures, we avoid two-phase commit (2PC) due to its high blocking overhead and lack of resilience over networks [13, 99]. Instead, we implement the **SAGA Pattern** to manage distributed transactions as a series of local database transactions, achieving **eventual consistency** [13, 99].

*   **Choreography SAGA:** In this decoupled model, there is no central orchestrator. Each service executes its local transaction and publishes a domain event [13, 14]. Other services listen to these events and trigger subsequent actions [13, 14]. While simple to implement for short flows, choreography becomes a nightmare to debug, test, and trace when business logic scales and cyclic dependencies emerge [13, 15].
*   **Orchestration SAGA:** This model introduces a centralized **Saga Coordinator** (often implemented using **AWS Step Functions** or custom Spring engines) that explicitly defines and directs the control flow [13, 14]. The coordinator makes synchronous or asynchronous calls to participating microservices and tracks the execution state [13].

**Compensations** are custom backward rollback actions designed to handle failures in a SAGA [13, 99]. If step 3 in an orchestration flow fails, the coordinator is responsible for executing steps 2 and 1 in reverse order to undo changes (e.g., releasing reserved inventory or reversing a charge) [13, 99]. All participants must be designed as fully **idempotent** to ensure that repeated compensating attempts due to network retries do not corrupt data state [13, 19]."

---

### Question 5: Transactional Outbox Pattern
**Explain the "Dual Write" problem in microservices. How does the Transactional Outbox pattern solve this, and how do you implement it in a Spring Boot application using Change Data Capture (CDC)?**

#### Expert Spoken-Aloud Answer
"The **Dual Write** problem occurs when a microservice needs to update its local database and notify other services via a message broker (like Kafka) [13, 16]. If the database transaction commits but the network call to Kafka fails, other services become inconsistent [13, 16]. If the Kafka message is sent first but the database transaction rolls back, downstream services process invalid phantom data [13, 16].

The **Transactional Outbox Pattern** solves this by ensuring database changes and event dispatching occur within a single atomic boundary [13, 16]. Inside the microservice, the local transaction updates the business entity *and* inserts a representation of the outbound event into an `Outbox` table in the same database [13, 16].

To relay these events, we configure a **Change Data Capture (CDC)** engine like **Debezium** [13, 16]. Debezium polls the database's transaction log (e.g., PostgreSQL's WAL) in a non-blocking, asynchronous manner, extracts the new outbox rows, and streams them with **at-least-once guarantees** to the corresponding Apache Kafka topic [13, 16]. This architecture prevents the dual-write failure mode, guarantees eventual consistency, and shifts the network overhead of event delivery completely away from the user's execution path."

---

### Question 6: VPC Network Isolation & Database Connectivity
**How do you configure an AWS Lambda function to access private VPC resources (such as an RDS instance) while maintaining outbound internet access to call external model APIs? How do you size and manage the connection pool?**

#### Expert Spoken-Aloud Answer
"To securely connect AWS Lambda to a private database and the internet:

1.  **VPC Mapping:** Map the Lambda function to **private subnets** in your VPC [15, 418]. AWS creates a managed **Hyperplane ENI** (Elastic Network Interface) within those subnets [383, 384]. Lambda can now reach private resources like RDS [383].
2.  **Outbound Internet:** Since private subnets do not have direct internet access, we route the subnets' outbound route table (`0.0.0.0/0`) to a **NAT Gateway** running in a public subnet [15, 418]. This enables Lambda to reach external APIs like Amazon Bedrock or Anthropic [15].
3.  **Connection Sizing:** Relational databases like Postgres are process-per-connection and cannot handle the sudden, massive connection spikes generated by Lambda's auto-scaling concurrency [15, 382]. To prevent connection exhaustion, we place an **Amazon RDS Proxy** between Lambda and the database [15, 382]. RDS Proxy pools connections, multiplexes queries across active database sessions, and protects the database from CPU starvation [15, 429]. The pool is sized based on the maximum concurrent Lambda execution limit multiplied by the average query execution time over transaction duration."

---

### Question 7: Amazon Bedrock Prompt Caching
**How does Amazon Bedrock Prompt Caching optimize latency and cost? Explain the technical differences between `AFTER_SYSTEM`, `AFTER_USER_MESSAGE`, and `AFTER_TOOLS` caching placement.**

#### Expert Spoken-Aloud Answer
"Amazon Bedrock supports prompt caching to optimize both execution latency and API token costs [58]. In enterprise AI platforms, system prompts, tool schemas, and multi-turn session histories are often long and static [63]. **Prompt caching can reduce latency by up to 85% and costs by up to 90%** for cached content [58]. The cache has a **5-minute Time-To-Live (TTL)** that resets on each cache hit [58].

Using the LangChain4j or Spring AI configurations, we place cache points dynamically [59]:

*   **`AFTER_SYSTEM`:** Places the cache point immediately after the system message [60]. This is ideal when you have a long, static system instruction set (such as strict compliance rules or complex formatting guides) that is shared across thousands of independent sessions [60].
*   **`AFTER_TOOLS`:** Places the cache point after the tool definitions [60]. This is highly optimized for tool-calling agents where a robust, static catalog of functions is exposed to the model [60, 63].
*   **`AFTER_USER_MESSAGE`:** Places the cache point after a specific user message [60]. This is beneficial when injecting a massive, stable document or context database directly into the conversation payload, allowing subsequent follow-up queries to parse the cache instantly [60]."

---

### Question 8: Claude Reasoning Budgets (Thinking API)
**What is the Claude Reasoning Budget (Thinking API)? How is it configured programmatically in Java, and how do you balance the trade-offs between "thinking" quality, latency, and token consumption?**

#### Expert Spoken-Aloud Answer
"The **Claude Reasoning Budget** (introduced in Claude 3.7 Sonnet) allows the model to perform internal, multi-step logical planning before returning its final output [56, 89]. Instead of instantly outputting tokens, the model writes its step-by-step reasoning process into a separate metadata block [56, 57].

In Java, we configure this programmatically using `BedrockChatRequestParameters` [56]:

```java
BedrockChatRequestParameters parameters = BedrockChatRequestParameters.builder()
        .enableReasoning(1024) // Assigns a 1024 token thinking budget
        .build();
```

The primary architectural trade-offs are:

*   **Quality vs. Latency:** Allowing the model to think significantly improves performance on complex reasoning tasks (like code reviews, math, or multi-step logic) [56, 62]. However, the thinking phase consumes time, increasing the overall time-to-first-token latency [56].
*   **Token Consumption and Cost:** The reasoning tokens are billed as standard input tokens [56]. If we allocate a large budget (e.g., 2048 tokens), we pay for those thinking cycles even if the model resolves the problem in fewer steps.
*   **API Control:** We configure `returnThinking(true)` to receive the reasoning steps in our application for auditability, and set `sendThinking(true)` in follow-up calls so the model does not lose its reasoning context in multi-turn agent chats [56, 57]."

---

### Question 9: Advanced Retrieval-Augmented Generation (RAG) Chunking
**Explain the architectural difference between Fixed-Size Chunking, Semantic Chunking, and Hierarchical Chunking. When should you choose each for an enterprise knowledge retrieval system?**

#### Expert Spoken-Aloud Answer
"The efficacy of any semantic RAG pipeline depends entirely on how raw data is ingested into the vector store [113].

*   **Fixed-Size Chunking:** Splits documents into uniform token blocks (e.g., 1000 tokens with a 200-token overlap) [114]. It is highly efficient, has predictable processing costs, and provides consistent vector store performance [114]. It is best suited for simple FAQ databases or homogeneous documents where conceptual boundaries do not span across arbitrary limits [114].
*   **Semantic Chunking:** Detects natural conceptual boundaries like paragraph breaks, headers, or topic transitions to break content [114]. It excels at preserving logical context in well-structured files like corporate policy sheets and user guides [114]. However, boundary detection increases ingestion CPU costs by 30-50%, and variable chunk sizes can degrade retrieval consistency [114].
*   **Hierarchical Chunking:** Generates parent-child relationships, caching high-level summaries as parent chunks and embedding granular paragraphs as child chunks [114]. The search query targets the child chunk, but the system passes the entire parent context to the model [114]. This supports both executive summaries and fine-grained queries, but increases vector storage overhead by 200-400% [114]."

---

### Question 10: Model Safety and Performance Optimization
**How do you protect Generative AI platforms from prompt injection and excessive agency? Explain the setup of Amazon Bedrock Guardrails and how to optimize content filtering using Input Tagging.**

#### Expert Spoken-Aloud Answer
"In production platforms, safety cannot be left to prompt engineering alone, which can be bypassed [103]. Instead, we implement **Amazon Bedrock Guardrails** [154]. 

We configure Guardrails to evaluate inputs and outputs in real-time [154]. They enforce:
1.  **Content Filters:** Catching prompt injection, jailbreaks, and hate speech [154].
2.  **Denied Topics:** Explicitly blocking disallowed domains (like company financials in a customer-support bot) [152, 154].
3.  **Sensitive Information Filters:** Automatically detecting and redacting PII using pre-built classifiers or custom regular expressions [154].

However, evaluating every token across long conversations introduces significant processing latency and cost [190]. To optimize this, we implement **Input Tagging** [190]. We wrap dynamic, untrusted user inputs with custom tags in the prompt [190]:

`<amazon-bedrock-guardrails-guardContent_xyz>[User input here]</amazon-bedrails-guardContent_xyz>`

We configure our API call with the corresponding tag suffix `"xyz"` [190]. Amazon Bedrock Guardrails will only evaluate the content inside the tags, bypassing our safe, trusted system instructions [190]. This slashes the token count evaluated by safety layers, minimizing latency while maintaining robust security boundaries [190]."

---

## Part 2: The Production-Grade Coding Challenge

This coding challenge consists of three tasks designed to evaluate your hands-on coding proficiency in enterprise Java 21, Spring Boot 3.x, and AWS SDKs.

---

### Task A: LangChain4j ChatModel with Caching & Reasoning Budgets

#### Scenario
Configure a `BedrockChatModel` using the LangChain4j Amazon Bedrock Integration. The model must:
1.  Target Claude 3.7 Sonnet (`us.anthropic.claude-sonnet-4-20250514-v1:0`) [56].
2.  Enable Claude's reasoning process with a budget of 1024 tokens [56].
3.  Instruct the model to return and send its thinking steps [56, 57].
4.  Activate Prompt Caching with a point placement set to cache after the system prompt [59].

#### Solution Implementation
```java
package com.enterprise.ai.config;

import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.bedrock.BedrockChatModel;
import dev.langchain4j.model.bedrock.BedrockChatRequestParameters;
import dev.langchain4j.model.bedrock.BedrockCachePointPlacement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;

import java.time.Duration;

@Configuration
public class BedrockModelConfiguration {

    @Bean
    public ChatModel advancedReasoningModel(BedrockRuntimeClient bedrockRuntimeClient) {
        // Step 1: Configure inference and advanced features inside request parameters
        BedrockChatRequestParameters defaultParameters = BedrockChatRequestParameters.builder()
                .temperature(0.3)
                .maxOutputTokens(4000)
                // Enable prompt caching immediately after the system message
                .promptCaching(BedrockCachePointPlacement.AFTER_SYSTEM)
                // Enable reasoning (Thinking API) with a 1024 token budget
                .enableReasoning(1024)
                .build();

        // Step 2: Build the ChatModel with LangChain4j Amazon Bedrock builder
        return BedrockChatModel.builder()
                .client(bedrockRuntimeClient)
                .region(Region.US_EAST_1)
                // Target the Claude 3.7 Sonnet foundation model
                .modelId("us.anthropic.claude-sonnet-4-20250514-v1:0")
                .timeout(Duration.ofSeconds(60))
                .maxRetries(3)
                .logRequests(true)
                .logResponses(true)
                // Retain and manage Claude's internal reasoning/thinking payload
                .returnThinking(true)
                .sendThinking(true)
                .defaultRequestParameters(defaultParameters)
                .build();
    }
}
```

---

### Task B: Spring AI ChatClient with Prompt Memory & SSE MCP

#### Scenario
Implement a Spring Boot RestController called `IncidentAssistantController` representing an AI agent. It must:
1.  Use Spring AI's `ChatClient` with a Converse API backend [69].
2.  Enable chat persistence using a thread-safe `PromptChatMemoryAdvisor` [72, 73].
3.  Configure a dynamic remote Model Context Protocol (MCP) Sync Client using a Server-Sent Events (SSE) transport pointing to an external tool runner on `http://localhost:8081/mcp` [87, 88].
4.  Expose an `/inquire/{user}` GET endpoint that accepts a query and returns the model's response while remembering session memory [72].

#### Solution Implementation
```java
package com.enterprise.ai.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.PromptChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.ai.mcp.client.McpSyncClient;
import org.springframework.ai.mcp.client.McpClient;
import org.springframework.ai.mcp.client.transport.SseClientTransport;
import org.springframework.ai.mcp.client.provider.SyncMcpToolCallbackProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/assistant")
public class IncidentAssistantController {

    private final ChatClient chatClient;
    private final McpSyncClient mcpSyncClient;
    
    // Concurrent map to hold a dedicated prompt memory advisor per user session
    private final Map<String, PromptChatMemoryAdvisor> memoryAdvisors = new ConcurrentHashMap<>();

    public IncidentAssistantController(ChatClient.Builder chatClientBuilder, McpSyncClient mcpSyncClient) {
        this.mcpSyncClient = mcpSyncClient;
        
        // Build the base ChatClient with remote tool callbacks registered via the MCP client
        this.chatClient = chatClientBuilder
                .defaultSystem("You are a senior site reliability AI engineering assistant. " +
                        "Use the registered MCP tools to query log systems and schedule post-mortems.")
                // Bind tools dynamically from the central MCP Server
                .defaultTools(new SyncMcpToolCallbackProvider(mcpSyncClient))
                .build();
    }

    @GetMapping("/inquire/{user}")
    public String inquire(@PathVariable String user, @RequestParam String query) {
        // Step 1: Thread-safely compute or retrieve the memory advisor for the specific user session
        PromptChatMemoryAdvisor userMemoryAdvisor = memoryAdvisors.computeIfAbsent(user, sessionKey -> 
                new PromptChatMemoryAdvisor(new InMemoryChatMemory())
        );

        // Step 2: Invoke the ChatClient with conversation history and tool-calling execution
        return this.chatClient.prompt()
                .user(query)
                // Pass the user's specific memory state
                .advisors(userMemoryAdvisor)
                .call()
                .content();
    }
}

@Configuration
class McpConfiguration {

    @Value("${mcp.server.url:http://localhost:8081/mcp}")
    private String mcpServerUrl;

    @Bean(destroyMethod = "close")
    public McpSyncClient mcpSyncClient() {
        // Configure Server-Sent Events (SSE) Transport to bind to remote corporate toolkits
        SseClientTransport transport = new SseClientTransport(mcpServerUrl);
        
        McpSyncClient client = McpClient.sync(transport);
        // Establish network handshakes
        client.initialize();
        return client;
    }
}
```

---

### Task C: Amazon SageMaker Pipeline Orchestration

#### Scenario
Using the AWS SDK for Java 2.x, write a service class called `SageMakerPipelineService` that:
1.  Initializes an asynchronous or synchronous `SageMakerClient` [535].
2.  Creates a new SageMaker Pipeline from a raw JSON definition file on the filesystem [537].
3.  Executes the newly created pipeline, passing in parameter configurations [543].

#### Solution Implementation
```java
package com.enterprise.ai.service;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sagemaker.SageMakerClient;
import software.amazon.awssdk.services.sagemaker.model.CreatePipelineRequest;
import software.amazon.awssdk.services.sagemaker.model.CreatePipelineResponse;
import software.amazon.awssdk.services.sagemaker.model.StartPipelineExecutionRequest;
import software.amazon.awssdk.services.sagemaker.model.StartPipelineExecutionResponse;
import software.amazon.awssdk.services.sagemaker.model.Parameter;
import software.amazon.awssdk.services.sagemaker.model.SageMakerException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class SageMakerPipelineService {

    private final SageMakerClient sagemakerClient;

    public SageMakerPipelineService(Region region) {
        // Initialize the standard synchronous SageMaker Service Client
        this.sagemakerClient = SageMakerClient.builder()
                .region(region)
                .build();
    }

    /**
     * Registers a new machine learning workflow pipeline inside Amazon SageMaker AI.
     */
    public String createPipeline(String pipelineName, String rawJsonDefinitionPath, String executionRoleArn) {
        try {
            // Read raw JSON pipeline definition from the local cluster context filesystem
            String pipelineDefinition = new String(Files.readAllBytes(Paths.get(rawJsonDefinitionPath)));

            CreatePipelineRequest request = CreatePipelineRequest.builder()
                    .pipelineName(pipelineName)
                    .pipelineDescription("Enterprise ML Ingestion and In-Batch Evaluation Pipeline.")
                    .pipelineDefinition(pipelineDefinition)
                    .roleArn(executionRoleArn)
                    .build();

            CreatePipelineResponse response = sagemakerClient.createPipeline(request);
            System.out.println("Successfully created pipeline with ARN: " + response.pipelineArn());
            return response.pipelineArn();

        } catch (IOException e) {
            throw new RuntimeException("Failed to read pipeline definition file at " + rawJsonDefinitionPath, e);
        } catch (SageMakerException e) {
            System.err.println("SageMaker service registration error: " + e.awsErrorDetails().errorMessage());
            throw e;
        }
    }

    /**
     * Executes the targeted machine learning pipeline.
     */
    public String executePipeline(String pipelineName, String inputDataS3Uri, String executionRoleArn) {
        try {
            // Define parameter configurations to override pipeline default inputs
            List<Parameter> parameters = new ArrayList<>();
            parameters.add(Parameter.builder()
                    .name("InputDataLocation")
                    .value(inputDataS3Uri)
                    .build());
            parameters.add(Parameter.builder()
                    .name("parameter_execution_role")
                    .value(executionRoleArn)
                    .build());

            StartPipelineExecutionRequest request = StartPipelineExecutionRequest.builder()
                    .pipelineName(pipelineName)
                    .pipelineExecutionDisplayName(pipelineName + "-execution-" + System.currentTimeMillis())
                    .pipelineExecutionDescription("Invoked programmatically via AWS SDK for Java 2.x.")
                    .pipelineParameters(parameters)
                    .build();

            StartPipelineExecutionResponse response = sagemakerClient.startPipelineExecution(request);
            System.out.println("Pipeline execution started. Execution ARN: " + response.pipelineExecutionArn());
            return response.pipelineExecutionArn();

        } catch (SageMakerException e) {
            System.err.println("SageMaker execution error: " + e.awsErrorDetails().errorMessage());
            throw e;
        }
    }
}
```
