# Lecture 30: Session vs. JWT Authentication [1]

## Overview
Compares stateful session-based user authentication with stateless JWT authentication [1].

## Trade-offs
- **Stateful Session**: Server retains session IDs in DB/Redis. Easy revocation, but requires centralized session lookup on every request [1].
- **Stateless JWT**: Client stores signed token. Any microservice instance validates key statelessly without DB lookup. Revocation requires token blacklist strategies [1].

## Summary & Key Takeaways
Stateless JWTs scale naturally across microservices, while stateful sessions offer instant server-side revocation control [1].
