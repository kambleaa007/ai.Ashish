# Lecture 12: CAP Theorem in System Design [1]

## Overview
Analyzes Eric Brewer's CAP Theorem and its fundamental constraints on distributed data stores [1].

## The Three Pillars
- **Consistency (C)**: Every read receives the most recent write or an error [1].
- **Availability (A)**: Every non-failing node returns a non-error response [1].
- **Partition Tolerance (P)**: System continues operating despite network message drops or delays [1].

## Theorem Trade-off
In distributed networks where partitions (P) are inevitable, systems must choose between CP (Consistency over Availability) or AP (Availability over Consistency) [1].

## Summary & Key Takeaways
Understanding CAP is crucial when selecting distributed databases like Cassandra (AP) vs HBase/RDBMS (CP) [1].
