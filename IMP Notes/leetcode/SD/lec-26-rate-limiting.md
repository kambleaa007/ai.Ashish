# Lecture 26: Rate Limiting in System Design [1]

## Overview
Covers rate-limiting strategies, algorithms, and implementations for protecting backend services [1].

## Algorithms
- **Token Bucket**: Refilling tokens at a constant rate; allows controlled bursts [1].
- **Leaky Bucket**: FIFO queue draining at a constant leak rate [1].
- **Fixed Window Counter**: Counter resets per time interval; risk of edge bursts [1].
- **Sliding Window Log / Counter**: Smooth calculation over rolling time windows [1].

## Summary & Key Takeaways
Rate limiters prevent DoS attacks, API abuse, and resource starvation [1].
