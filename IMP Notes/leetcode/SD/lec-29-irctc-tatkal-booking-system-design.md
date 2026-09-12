# Lecture 29: IRCTC Tatkal Ticket Booking System Design [1]

## Overview
Case study analyzing massive concurrency and instant burst traffic handling during railway booking windows [1].

## Architectural Challenges
- **Concurrency**: Millions of simultaneous requests attempting to book limited seat inventories [1].
- **Database Locking**: Optimistic vs pessimistic locking to prevent double booking [1].
- **Queueing & Rate Limiting**: Holding requests in queue buffers while enforcing payment timeout flows [1].

## Summary & Key Takeaways
Tatkal systems demand extreme write isolation, message queue buffering, and rapid inventory rollback capabilities [1].
