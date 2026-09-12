# Lecture 16: Write-Through vs. Write-Back Caching [1]

## Overview
Detailed comparison of memory-to-database write patterns [1].

## Patterns
- **Write-Through**: Data is written synchronously to cache and database simultaneously. High consistency, higher write latency [1].
- **Write-Back (Write-Behind)**: Data is written immediately to cache; database sync occurs asynchronously in batches. Extremely low write latency, but risks data loss on cache crash [1].

## Summary & Key Takeaways
Choose Write-Through for financial/critical consistency; Write-Back for high-speed logging or analytics [1].
