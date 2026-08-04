# Module 3: 2026 AI Fluency & Code Comprehension (Java)
## Navigating Multi-File Codebases, Bug Audits, and AI Collaboration

In 2026, tech companies (led by Google and Meta) have heavily transitioned from standard whiteboard syntax-writing to **Code Comprehension** and **AI-Collaborative Engineering** formats [6, 8, 47]. This module trains you to navigate existing, multi-file repos, audit and debug AI code, trace bugs, and prompt LLMs efficiently [6, 8].

---

### Topic 16: Multi-File Codebase Navigation & Static Auditing
#### W3H Pattern Matrix
| Dimension | Detail |
| :--- | :--- |
| **What** | Reading, mapping, and diagnosing runtime defects in multi-file systems [6, 47]. |
| **Why** | Tests practical software maintenance skills, reflecting modern enterprise development [230, 808]. |
| **Where** | Standard Google "Code Comprehension" round [6, 47]. |
| **How** | Analyze classes, trace dependencies, inspect configs, and pinpoint logic leaks [230, 809]. |

#### 🧠 Mental Model
Imagine entering a large warehouse with several rooms. Instead of building a wall from scratch, your job is to find the single water pipe leak in a complex, multi-room piping system by following the water pressure gauges.

#### 🚶 Step-by-Step Logic
1. Map out the call graph across files: starting from the endpoint controller or main entry, trace which class interacts with which interface.
2. Formulate hypotheses: look at data transformations and verify whether null safety, boundary sizes, or parameter overrides are respected [230, 662].
3. Identify silent logical flaws (e.g., resource leaks, thread safety violations) [149].

```java
// File: ConnectionPool.java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.Queue;

public class ConnectionPool {
    private final String url;
    private final Queue<Connection> pool;
    private final int maxConnections;

    public ConnectionPool(String url, int maxConnections) {
        this.url = url;
        this.maxConnections = maxConnections;
        this.pool = new LinkedList<>();
    }

    // SILENT BUG: This pool is not thread-safe. Concurrent requests will corrupt the queue.
    // FIX: Add 'synchronized' keyword to getConnection() and releaseConnection().
    public synchronized Connection getConnection() throws SQLException {
        if (!pool.isEmpty()) {
            return pool.poll();
        }
        return DriverManager.getConnection(url);
    }

    public synchronized void releaseConnection(Connection connection) {
        if (connection != null && pool.size() < maxConnections) {
            pool.offer(connection);
        }
    }
}
```

---

### Topic 17: Prompts as Code & Verification
In AI-assisted interview environments, you must demonstrate **precise prompting** and avoid blindly accepting model outputs [8, 230]. 

#### Step-by-Step AI Collaboration Loop:
1. **Explain intent first**: Explicitly state to the AI: *"I want to design a thread-safe, lock-free counter. Let's start with a design sketch using AtomicInteger."*
2. **Review output constraints**: Read the model's output line-by-line. Look for memory overheads, deadlocks, or standard Java concurrency issues [149].
3. **Execute verification tests**: Run edge cases (e.g., negative integers, empty structures) to prove the correctness of the generated suggestions [205, 230].

```java
// File: LockFreeCounter.java
import java.util.concurrent.atomic.AtomicInteger;

public class LockFreeCounter {
    private final AtomicInteger val = new AtomicInteger(0);

    public void increment() {
        val.incrementAndGet();
    }

    public int getValue() {
        return val.get();
    }
}
```

---

### Topic 18: Auditing AI Code for Memory Leaks and Resource Safety
AI tools often produce syntactically correct code that suffers from resource exhaustion under load [21, 149]. You must audit and fix these code patterns during live assessments [230].

#### Common Silent Fault: Failure to close JDBC connections or stream resources, causing memory leaks [149].

```java
// File: UserRepository.java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserRepository {
    private final ConnectionPool pool;

    public UserRepository(ConnectionPool pool) {
        this.pool = pool;
    }

    // AUDIT TARGET: Old resource leak pattern
    public String getUserName(int userId) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = pool.getConnection();
            stmt = conn.prepareStatement("SELECT name FROM users WHERE id = ?");
            stmt.setInt(1, userId);
            rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getString("name");
            }
        } finally {
            // Leak prevention: Always release resources back to the pool
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) pool.releaseConnection(conn);
        }
        return null;
    }
}
```
