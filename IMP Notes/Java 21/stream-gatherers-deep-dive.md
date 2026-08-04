# Deep-Dive Topic 3: Stream Gatherers — Custom Intermediate Operations

## 1. What, Why, Where, and How (3W1H)

*   **What**: **Stream Gatherers (JEP 485)** is an intermediate extension API that allows developers to define custom intermediate operations in Java Stream pipelines [66, 823].
*   **Why**: Previously, Java Stream intermediate operations were fixed (e.g., `filter`, `map`, `distinct`) [818]. If developers needed advanced stream logic—such as sliding windows, fixed batching, or stateful filters—they were forced to write verbose custom Collectors (which is a terminal operation, meaning the stream ends) or fall back to messy imperative loops, destroying the declarative style [818, 823]. Gatherers bring *infinite flexibility* to intermediate stream stages [818].
*   **Where**: Used in processing infinite streams, chunking and batching elements (such as splitting records into batches of 100 for bulk database updates), time-series analysis, and event pattern matching [781, 800, 801, 823].
*   **How**: Use `.gather(Gatherer)` to run a gatherer [823]. Predefined operations reside in `Gatherers` (e.g., `Gatherers.windowFixed(size)`) [238, 787].

---

## 2. Intuitive Mental Model

Think of a traditional Java stream as an **industrial manufacturing conveyer belt**. 
*   `filter` is a **sorting sensor** that pushes bad items off the belt.
*   `map` is a **painting tool** that transforms every passing item.

However, if you want a machine that takes passing items and **groups them into boxes of three** (windowing) or calculates a running average, the standard conveyer belt has no built-in tools.

**Stream Gatherers** are custom **robotic arms** you can install *anywhere* in the middle of the conveyor belt [42, 823]. 
This robotic arm has:
1.  **A small workbench (State)** to store items temporarily [805, 828].
2.  **A gripping action (Integrator)** that grabs incoming items, processes them, and can push new boxes or values down the conveyor belt [805, 828].
3.  **A cleanup sweep (Finisher)** that packs any remaining leftovers when the stream runs out of items [805, 828].

---

## 3. The Four Core Pillars of a Custom Gatherer

A custom gatherer is constructed by configuring up to four distinct functional building blocks [42, 805]:

```
                     [ incoming elements ]
                              │
                              ▼
 1. Initializer  ──► [ Creates private state ] (Supplier) [42, 805]
                              │
                              ▼
 2. Integrator   ──► [ Processes elements & pushes ] (Integrator) [42, 805]
                              │
                              ├───────────────┐ (Parallel evaluations)
                              ▼               ▼
 3. Combiner     ──► [ Merges parallel states ] (BinaryOperator) [42, 805]
                              │
                              ▼
 4. Finisher     ──► [ Flushes out leftovers ] (BiConsumer) [42, 805]
                              │
                              ▼
                     [ downstream flow ]
```

1.  **Initializer**: Creates a mutable state object used to track intermediate data [42, 828].
2.  **Integrator**: Consumes input elements, mutates the state, and pushes transformed elements downstream [42, 828]. Returns `boolean` to support short-circuiting [42, 828].
3.  **Combiner**: Merges two state objects during parallel stream execution [42, 828]. If omitted, the gatherer evaluates sequentially [42, 805].
4.  **Finisher**: Executes final operations when the stream is exhausted, flushing out any remaining buffered state [42, 828].

---

## 4. Built-in Gatherers vs. Custom Implementation

Java 24 provides five highly powerful built-in gatherers in the `java.util.stream.Gatherers` class [238, 787]:

| Built-In Gatherer | Type | Purpose |
| :--- | :--- | :--- |
| `windowFixed(size)` | Many-to-Many | Groups elements into non-overlapping batches of a fixed size [238, 790, 800]. |
| `windowSliding(size)` | Many-to-Many | Groups elements into overlapping sliding windows (moving 1 element forward) [238, 791, 801]. |
| `scan(initial, scanner)` | One-to-One | Performs a prefix scan (incremental running accumulation) [238, 789, 824]. |
| `fold(initial, folder)` | Many-to-One | Accumulates all elements and emits a single result at the end of the stream [238, 802, 825]. |
| `mapConcurrent(max, mapper)`| One-to-One | Processes elements concurrently up to `max` threads using Virtual Threads [238, 789, 803]. |

### Code Example: Building a Custom Stateful Gatherer (`distinctBy`)
Suppose we want to filter out elements based on a custom key extractor (e.g., distinctness by length) [819]:

```java
import java.util.HashSet;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Gatherer;

public class CustomGatherers {

    public static <T, K> Gatherer<T, ?, T> distinctBy(Function<T, K> keyExtractor) {
        // We use Gatherer.ofSequential since maintaining distinctness state relies on sequential ordering
        return Gatherer.ofSequential(
            // 1. Initializer: Create the seen set
            () -> new HashSet<K>(),
            
            // 2. Integrator: Process each element, checking if we've seen its key
            Gatherer.Integrator.ofGreedy((seenSet, element, downstream) -> {
                K key = keyExtractor.apply(element);
                if (seenSet.add(key)) {
                    // Pushes element downstream if it is unique
                    return downstream.push(element); 
                }
                return true; // Continue processing subsequent elements
            })
        );
    }
}
```

---

## 5. Technical Grounding & Citation Map
*   **JEP 485 introduction & motivation**: [66, 818, 823]
*   **The four core pillars of Gatherer configuration**: [42, 805, 828]
*   **Predefined built-in gatherers mapping & details**: [238, 787, 800, 801, 802, 803, 804]
*   **Short-circuiting, order preservation, and concurrent mapping**: [804, 828]
*   **Custom sequential and parallel gatherers implementation code**: [806, 808, 811, 829, 830]
