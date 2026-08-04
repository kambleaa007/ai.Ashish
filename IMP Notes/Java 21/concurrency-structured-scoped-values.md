# Deep-Dive Topic 2: Structured Concurrency & Scoped Values

## 1. What, Why, Where, and How (3W1H)

*   **What**: **Structured Concurrency (JEP 505)** treats groups of related concurrent subtasks as a single, cohesive unit of work [191, 844]. **Scoped Values (JEP 506)** enable safe, immutable context sharing within and across threads in a highly optimized manner [192, 268].
*   **Why**: Unstructured concurrency (such as using `CompletableFuture` or raw `ExecutorService`) treats tasks as completely independent [205]. If a child task fails or times out, the parent is not notified, leading to thread leaks, unnecessary resource waste, and silent failures [208]. Scoped Values replace `ThreadLocal`, which suffers from heavy memory overhead when inheriting values across millions of virtual threads, and has severe security risks because its values are mutable [126, 643, 743].
*   **Where**: Used to build robust, distributed microservices where a single request forks into multiple parallel calls (e.g., calling three APIs simultaneously and combining results) and must share request metadata (such as authentication tokens or transaction IDs) across those threads [212, 747, 748].
*   **How**: Open a `StructuredTaskScope` in a try-with-resources statement, fork subtasks, and use `join()` to aggregate results [212, 846]. Share context using `ScopedValue.where(KEY, value).run(Runnable)` [643, 744, 750].

---

## 2. Intuitive Mental Models

### Structured Concurrency: The Orchestrator
Imagine a **restaurant waiter** serving a multi-course meal [204, 206]. In **unstructured concurrency**, the waiter delegates the starter, main, and dessert to three independent kitchen runners [206]. If the starter runner drops the plate and fails (throws an exception), the dessert runner keeps preparing chocolate soufflé, and the waiter stands there waiting indefinitely [207, 208].

In **Structured Concurrency**, the waiter uses an **orchestrated checklist** [211, 212]. The kitchen tasks are bound strictly to a single scope [211]. If the starter runner fails, the orchestrator immediately triggers a cancellation alarm to all other runners to stop their work, and returns a clean, fast failure to the customer [212, 213].

```
                 [StructuredTaskScope] (Try-with-resources block)
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
     [Subtask 1]      [Subtask 2]      [Subtask 3]
    (Virtual Thread) (Virtual Thread) (Virtual Thread)
         │                │                │
         └────────────────┼────────────────┘
                          ▼
                     scope.join() -> waits for ALL to complete or any fail [844]
```

### Scoped Values: The Read-Only Locked Briefcase
`ThreadLocal` is like giving every child thread a **copy of a notebook** [743]. If you spawn 100,000 threads, you must duplicate the notebook 100,000 times, causing huge memory footprint [743]. Furthermore, anyone down the line can scribble on the notebook and mutate it, posing a security risk [643, 644].

`ScopedValue` is like a **locked read-only briefcase** [744]. The parent thread sets the briefcase content once [643, 744]. When virtual threads are forked, they do not copy the briefcase; they are simply given a read-only view of the exact same briefcase [745]. They can quickly read from it, but nobody can mutate its content, and it vanishes automatically when the scope completes [643, 744, 750].

---

## 3. ThreadLocal to ScopedValue Step-by-Step Migration Guide

To protect against memory leaks, ThreadLocals require strict `try-finally` cleanup [643, 742]. ScopedValues eliminate this entirely by bounding values strictly to a execution block [643, 744].

### Step 1: Replace the Declaration
```java
// BEFORE: ThreadLocal is mutable and expensive to inherit
public static final ThreadLocal<String> AUTHENTICATED_USER = new ThreadLocal<>();

// AFTER: ScopedValue is immutable and extremely lightweight
public static final ScopedValue<String> AUTHENTICATED_USER = ScopedValue.newInstance();
```

### Step 2: Refactor Context Binding & Writers
Instead of mutating the thread with a `.set()`, wrap the logic in a scoped execution scope [750].
```java
// BEFORE: ThreadLocal requiring manual finally cleanup
public void handleRequest(Request request) {
    AUTHENTICATED_USER.set(request.getUserEmail());
    try {
        processOrder(request);
    } finally {
        AUTHENTICATED_USER.remove(); // CRITICAL: easy to forget, causing memory leaks [742]
    }
}

// AFTER: ScopedValue structured binding
public void handleRequest(Request request) {
    ScopedValue.where(AUTHENTICATED_USER, request.getUserEmail())
               .run(() -> processOrder(request)); // Value auto-destructs when scope exits [643, 750]
}
```

### Step 3: Refactor Readers & Hand-Off to Subtasks
Under ScopedValues, children forked inside `StructuredTaskScope` automatically inherit the context without any copying overhead [745].
```java
// Read context anywhere downstream
public void processOrder(Request request) {
    String email = AUTHENTICATED_USER.get(); // Reads bound ScopedValue [744]
    
    try (var scope = StructuredTaskScope.open()) {
        // Child threads inherit AUTHENTICATED_USER automatically! [745]
        var inventoryTask = scope.fork(() -> checkInventory(request)); 
        scope.join();
    }
}
```

---

## 4. Technical Grounding & Citation Map
*   **Structured Concurrency definition**: [191, 844]
*   **Unstructured concurrency bottlenecks (thread leaks, lack of propagation)**: [208]
*   **Structured Concurrency layout, scopes, hierarchy**: [211, 212, 853]
*   **StructuredTaskScope static factory open changes**: [191, 847]
*   **Scoped Values advantages over ThreadLocal**: [126, 268, 643, 744, 745]
*   **ThreadLocal memory issues & mutation security risks**: [643, 644, 743]
*   **ScopedValue binding API & Structured Concurrency integration**: [643, 745, 748, 750]
