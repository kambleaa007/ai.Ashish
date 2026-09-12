# Lecture 24: Replication vs. Sharding Explained [1]

## Overview
Deep dive into database scaling strategies: duplicating data vs partitioning data [1].

## Concepts
- **Replication**: Copying the entire dataset across multiple read replicas (Primary-Replica topology) for high availability and read scaling [1].
- **Sharding**: Splitting the dataset into distinct horizontal chunks across nodes for write scaling [1].

## Summary & Key Takeaways
Production architectures combine both: sharded clusters where each shard is replicated for failover [1].
