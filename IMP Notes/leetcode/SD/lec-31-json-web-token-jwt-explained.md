# Lecture 31: JSON Web Token (JWT) Explained [1]

## Overview
Deep dive into the internal structure and cryptographic verification of JSON Web Tokens [1].

## Token Structure
1. **Header**: Cryptographic algorithm (e.g., HS256, RS256) and token type [1].
2. **Payload**: User claims, expiration timestamp, and access scopes [1].
3. **Signature**: Cryptographic signature generated with secret key: `HMACSHA256(base64(Header) + "." + base64(Payload), secret)` [1].

## Summary & Key Takeaways
JWT signatures guarantee integrity and prevent client-side claim tampering [1].
