Here is a comprehensive extraction of every topic, component, pattern, and keyword from the provided document, formatted with a clear one-liner description for each.

---

## 1. Core Architecture & Fundamentals

* **Agent Loop Engineering**: The practice of designing autonomous AI agents that operate through a continuous, repeating execution cycle rather than a single prompt-response interaction.


* **LLM as the Brain**: The concept where the Large Language Model acts as the reasoning engine for decision-making.


* **Backend Engineering as the Nervous System**: The backend infrastructure providing guardrails, memory, orchestration, validation, resilience, and oversight around an LLM.


* **Perception Phase**: The initial loop stage where the agent ingests inputs, gathers context, and extracts useful signals to understand current state.


* **Planning / Reasoning Phase**: The loop stage where the agent evaluates goals and context to determine the next action or tool invocation.


* **Action Phase**: The execution stage where the agent calls APIs, invokes tools, runs workflows, or updates state.


* **Evaluation / Reflection Phase**: The stage where the agent validates action outputs, checks task completion, and decides if another iteration is required.


* **State Maintenance Across Steps**: Retaining updated conditions, variables, and remaining constraints across multiple loop iterations.



---

## 2. Perception & Context Window Engineering

* **Large Document Processing**: Structured techniques used to analyze extensive texts without causing memory overload or context limit breaches.


* **Sliding Window**: Feeding an LLM document content sequentially in small, fixed-size chunks.


* **Summarisation Chains**: Generating section-by-section summaries and combining them hierarchically for global context.


* **Retrieval-Augmented Generation (RAG)**: Dynamically fetching only the specific clauses or text segments relevant to the prompt.


* **Async Local Storage**: Request-scoped storage in Node.js used to isolate user sessions and prevent cross-tenant data leakage.


* **Stream Processing**: Ingesting files line-by-line or chunk-by-chunk using readable streams to prevent server out-of-memory crashes.


* **State Serialisation**: Continuously saving intermediate state to stores like Redis or PostgreSQL so systems can resume after crashes.


* **Signal Filtering and Preprocessing**: Cleaning text pipelines before LLM submission to remove formatting noise, structural headers, and margins.


* **Personally Identifiable Information (PII) Redaction**: Identifying and removing sensitive personal details (e.g., names, bank accounts) prior to model processing.



---

## 3. Orchestration & Reasoning

* **Prompt Engineering as Code**: Version-controlling, parameterizing, and testing prompts in Git like software logic.


* **Structured Output**: Forcing LLM responses into predictable, machine-readable formats (e.g., JSON) instead of free-form text.


* **Zod Schema Validation**: Enforcing strict schema validation on raw LLM outputs to guarantee field existence and correct typing.


* **Streaming JSON Parsing**: Reading and parsing partial JSON payloads character-by-character as tokens stream in real time.


* **Tool Selection Logic**: Backend logic that translates LLM intent into internal microservice API calls without giving the model direct execution access.



---

## 4. Execution Reliability & Safety

* **Sandboxing**: Executing generated code inside an isolated, quarantined environment to block unauthorized server file and network access.


* **Idempotency Keys**: Attaching unique transaction keys to requests so retries do not execute duplicate operations.


* **Concurrency Control with Queues**: Throttling simultaneous outbound API calls using message queues to prevent rate-limit breaches.


* **Saga Pattern**: Managing multi-step distributed workflows by pairing forward steps with compensating rollback actions upon failure.


* **Compensating Actions**: Operations executed during a Saga rollback to undo previously successful steps (e.g., refunding a charged card).



---

## 5. Reflection, Governance & Memory

* **Critic Models**: Secondary validation models or scripts that review primary agent outputs to catch harmful errors or hallucinated suggestions.


* **Event Sourcing**: Logging every agent action as an immutable event in a stream rather than overwriting state.


* **Temporal Debugging**: Replaying event logs step-by-step to inspect, debug, and rewind agent state at specific timestamps.


* **Graceful Degradation**: Falling back smoothly to alternative execution paths or human support when automated actions fail.


* **Human-in-the-Loop (HITL)**: Requiring explicit human approval before allowing an agent to execute high-impact or destructive operations.


* **Short-Term Memory**: Temporary in-memory state tracking active live conversational context.


* **Long-Term Memory Consolidation**: Persisting essential cross-session knowledge into vector databases while clearing temporary chat logs.



---

## 6. Security, Resilience & Cost Guardrails

* **Prompt Injection Defence**: Preprocessing middleware that scans inputs to redact hidden commands and prevent prompt hijacking.


* **Circuit Breakers (Opossum)**: Detecting LLM provider outages to trip connections, shed load, and display service-degradation messages.


* **Token Bucket Algorithm**: A rate-limiting technique used to monitor usage and cap maximum token consumption per user or team.


* **Cost Rate Limiting**: Halting agent loop execution automatically once hourly or daily financial budget thresholds are reached.


* **Grounding Constraints**: Cross-checking generated outputs against authoritative databases to reject invalid or hallucinated entries.


* **Timeouts and Retry Strategies**: Enforcing execution time limits and retrying failed calls using exponential backoff with random jitter.


* **Fallback Models**: Rerouting active state to a secondary LLM provider when the primary provider encounters errors or downtime.


* **Dead Letter Queues (DLQ)**: Isolating permanently failed tasks in a dedicated queue after maximum retries for human inspection.



---

## 7. Software Design & Engineering Patterns

* **State Machines (XState)**: Defining explicit valid execution states and transition rules to constrain agent workflows.


* **Worker Threads**: Offloading CPU-heavy parsing and analysis tasks to separate threads to keep the Node.js event loop unblocked.


* **Dependency Injection**: Decoupling business logic from AI services to easily swap live LLMs with mock implementations during testing.


* **Type-Safe Tool Definitions**: Automatically generating JSON schemas from TypeScript code signatures to ensure type alignment.



---

## 8. Observability & Telemetry Metrics

* **OpenTelemetry**: A vendor-neutral framework for generating standardized telemetry across microservices.


* **Distributed Tracing**: Assigning unique request IDs to track a transaction's latency and path across multiple distributed services.


* **Time to First Token (TTFT)**: The latency metric measuring the duration between prompt submission and the first response token.


* **Token Streaming Speed**: The rate metric measuring how many tokens an LLM generates per second.


* **Cache Hit Rate**: The percentage of prompts or queries served directly from cache versus requiring full LLM generation.


* **Prompt Reuse Efficiency**: The metric evaluating how effectively identical prompt components are reused across calls.


* **Semantic Logging**: Outputting structured JSON logs containing machine-readable metadata, prompts, errors, and tool arguments.


* **Execution Replay**: Re-running recorded event streams in observability tools (e.g., Helicone, Braintrust) to debug historical agent responses.



---

## 9. Hands-On Implementation Modules & Symbolic AI

* **Rule-Based Symbolic AI**: Deterministic AI architecture using keyword matching and explicit rules instead of neural models.


* **`loadCsv.ts`**: The Perception module responsible for reading and parsing CSV data into memory.


* **`mockLlm.ts`**: The Reasoning module executing deterministic rule-based decision logic.


* **`tools.ts`**: The Action module containing functions for data aggregation, grouping, and ASCII chart generation.


* **`reflect.ts`**: The Reflection module reviewing tool outputs to detect invalid values like `NaN`.


* **`guards.ts`**: The Safety module validating execution parameters, blocking unsafe operations, and enforcing path restrictions.


* **`agent.ts`**: The Loop Controller orchestrating the full perceive-plan-act-reflect cycle.


* **History Array**: The internal memory buffer storing historical execution steps and observation results.