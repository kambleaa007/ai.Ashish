# Lecture 28: Instagram System Design Explained [1]

## Overview
Real-world architectural case study of Instagram's photo/video sharing platform [1].

## Architecture Highlights
- **Media Storage**: Object stores (S3) backed by edge CDNs [1].
- **Feed Generation**: Hybrid push-pull model for celebrity vs regular user feeds [1].
- **Database Sharding**: Sharding database instances using custom auto-incrementing IDs [1].

## Summary & Key Takeaways
Designing Instagram requires balancing massive read workloads, low latency feed delivery, and high availability [1].
