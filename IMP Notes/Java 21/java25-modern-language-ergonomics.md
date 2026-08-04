# Deep-Dive Topic 5: Modern Language Ergonomics in Java 25

## 1. What, Why, Where, and How (3W1H)

*   **What**: A collection of language updates finalized or previewed in Java 25: **Flexible Constructor Bodies (JEP 513)** [41], **Compact Source Files and Instance Main Methods (JEP 512)** [38], **Module Import Declarations (JEP 511)** [40], and **Stable Values/Lazy Constants (JEP 502/526)** [74, 588].
*   **Why**: These features improve developer ergonomics by reducing boilerplate and increasing programmatic flexibility [38, 41, 193, 194]. Prior to Java 25, calling `super()` had to be the absolute first statement in a constructor, forcing developers to write awkward static helper methods to validate or transform constructor arguments [41, 317, 318]. 
*   **Where**: Used across all Java applications, from scripting and prototyping (where compact single-method source files excel) to highly optimized class design and immutable constant management [38, 74, 393].
*   **How**: Use standard syntax as finalized. E.g., execute code directly before calling `super()` in constructors [317], use `import module java.base;` to clean up import blocks [40, 383, 384], or use `StableValue` to safely cache lazy variables [186].

---

## 2. Flexible Constructor Bodies: The Prologue and Epilogue Lifecycle (JEP 513)

JEP 513 formally divides a subclass constructor body into two distinct, structured phases [41, 325]:

```
      [ Subclass Constructor Entered ]
                     │
                     ▼
  ┌─────────────────────────────────────┐
  │         1. THE PROLOGUE             │
  │  - Can execute statements           │  [41, 325]
  │  - Can validate/transform args      │  [324, 327]
  │  - CANNOT read/write instance state │  [41, 328]
  └─────────────────────────────────────┘
                     │
                     ▼
             super(...) / this(...)        [41, 321] (Constructor chaining)
                     │
                     ▼
  ┌─────────────────────────────────────┐
  │         2. THE EPILOGUE             │
  │  - Can fully read/write state       │  [41, 321]
  │  - Can call instance methods        │  [321, 322]
  └─────────────────────────────────────┘
                     │
                     ▼
      [ Subclass Constructor Completed ]
```

### Safety Guarantees
To prevent the subclass constructor from accessing uninitialized fields of its parent or itself, the Java compiler enforces strict safety boundaries [323, 328]:
1.  **Prologue**: No instance fields of the subclass can be read or modified [320, 328]. No instance methods can be invoked, and `this` cannot be referenced as a target [328, 334].
2.  **Epilogue**: Starts immediately after the constructor chaining call (`super()` or `this()`) executes [321, 325]. Once parent fields are fully constructed, the subclass gets full access to instance members [321, 322].

---

## 3. Compact Source Files and Instance Main Methods (JEP 512)

JEP 512 enables writing simple, script-like Java programs by omitting the traditional public class wrapping, access modifiers, static initialization, and String arguments array [38, 194, 285, 286].

```java
// Hello.java (In Java 25, this is a fully valid, launchable program!)
void main() {
    IO.println("Hello, World!");
}
```

### Key Compilation Rules
1.  **Implicit Class**: The compiler automatically translates a compact source file into an implicitly declared class residing in the unnamed package [39, 57].
2.  **Class Shape**: The implicit class is marked as `final top-level` extending `java.lang.Object`, implements no interfaces, and provides a default no-argument constructor [39, 57, 296].
3.  **Automatic Imports**: Standard packages from `java.base` are imported automatically (reducing import ceremony) [39, 60, 300].
4.  **Simplified Console**: The `java.lang.IO` class is auto-imported, exposing simplified console utilities like `IO.println` and `IO.readln` [39, 395, 397].

---

## 4. Module Import Declarations & Name Shadowing Rules (JEP 511)

JEP 511 allows importing all exported packages of a given module with a single statement: `import module java.base;` [40, 193, 383, 384].

### Name Clashes & Ambiguity Resolution
Importing entire modules on demand (such as `java.desktop` and `java.base` concurrently) introduces potential namespace collisions [40, 663]. For example, `java.awt.List` and `java.util.List` share the same simple name [662]. 

To resolve such conflicts, Java applies **strict shadowing rules** [40, 664]:
*   **Shadowing**: An explicit, single-type import (e.g. `import java.util.List;`) shadows on-demand module imports [40, 664]. 
*   **Shadowing by Type-on-Demand**: A package wildcard import (e.g. `import java.awt.*;`) also shadows module imports [665].

```java
import module java.desktop; // Exports java.awt.List [663]
import module java.base;    // Exports java.util.List [663]

// Compile error: List is ambiguous! [663]
// List list = new ArrayList();

// RESOLUTION: Shadow the module import explicitly [40, 664]
import java.util.List;

void main() {
    List<String> fruits = List.of("apple", "citrus"); // Resolves correctly to java.util.List [934]
}
```

---

## 5. Stable Values / Lazy Constants API (JEP 502/526)

First introduced as **Stable Values (JEP 502)** in JDK 25 and subsequently polished as **Lazy Constants (JEP 526)** in JDK 26, this API provides JVM-level trust for deferred, thread-safe lazy-initialization [74, 588, 947].

Historically, lazy-initializing variables required complex double-checked locking idioms [947]. Under JEP 502/526, `StableValue` enforces that a variable can be initialized *exactly once* [74, 947]. Once set, the JVM treats it as immutable, enabling aggressive constant-folding JIT optimizations [74, 590, 772].

```java
import java.util.List;

public class ConfigurationPool {
    // 1. Declare Stable Values for deferred initialization
    static final StableValue<Logger> LOGGER = StableValue.of();
    
    // 2. Declare a stable list of fixed pool size
    static final int POOL_SIZE = 10;
    static final List<Processor> POOL = StableValue.list(POOL_SIZE, idx -> new Processor(idx));

    public static Logger logger() {
        // First get will initialize the supplier, future gets return cached value immediately
        return LOGGER.orElseSet(() -> Logger.create());
    }

    public static Processor getProcessor(int id) {
        // Accessing indices in stable lists lazily computes on first access
        return POOL.get(id);
    }
}
```

---

## 6. Technical Grounding & Citation Map
*   **Flexible Constructor Bodies (JEP 513) prologue/epilogue semantics**: [41, 317, 321, 325, 406]
*   **Safety constraints during prologue initialization**: [323, 328, 334]
*   **Compact Source Files (JEP 512) syntax and compiler transformation**: [38, 39, 51, 57, 194, 296, 928]
*   **Automatic imports, java.lang.IO console utilities**: [39, 60, 300, 395]
*   **Module Import Declarations (JEP 511)**: [40, 193, 383, 384]
*   **Name clash resolution & shadowing compilation priority rules**: [40, 662, 663, 664, 665]
*   **Stable Values / Lazy Constants JEP 502/526 structure & thread safety**: [74, 186, 187, 188, 588, 772, 947]
