# ai.Ashish
AI-Enabled Enterprise Backend Engineering

## Setup

```bash
npm install express body-parser typescript @types/express @types/node ts-node
npm run build
npm run start
```

## OpenAPI Integration

Generate TypeScript types from OpenAPI spec:

```bash
npx openapi-typescript openapi/openapi.yaml --output src/types/api.ts
npm install swagger-ui-express yamljs
```

## TypeScript Refactoring Exercise

### Current Issues

- Inconsistent coding standards
- Incorrect type inference

### Topics Covered

- Generics
- Utility Types
- Decorators
- Async Patterns

### Sample Code (Before Refactoring)

```typescript
type User = { id: number; name: string; email: string };
 
async function fetchUsers() {
    const res = await fetch('https://api.example.com/users');
    const data: any = await res.json();
    // lots of casts
    return data as User[];
}
 
async function fetchWithRetry(url: string, retries = 2) {
    for (let i = 0; i <= retries; i++) {
        try {
            const r = await fetch(url);
            return r.json();
        } catch (e) {
            if (i === retries) throw e;
        }
    }
}
 
async function bulkFetch(urls: string[]) {
    const results: any[] = [];
    for (const u of urls) {
        results.push(await fetchWithRetry(u));
    }
    return results;
}
```

### Refactoring Goals

- Modify code by using no `any`
- Strong typing using generics
- Proper error handling
- HTTP status validation
- JSDoc documentation
- Readable code
- Strict TypeScript compatible

### Tasks

1. Identify all code smells.
2. Explain the business impact of every issue.
3. Explain the technical impact.
4. Refactor the code.
5. Replace `any` with generics.
6. Create a reusable API client.
7. Centralize retry logic.
8. Add timeout support.
9. Add exponential backoff.
10. Handle HTTP errors correctly.
11. Throw custom error classes.
12. Remove duplicate logic.
13. Improve performance.
14. Follow SOLID, DRY, KISS, and Clean Code principles.
15. Make the code easily testable.
16. Add JSDoc comments.
17. Explain every change.

Generate production-quality TypeScript.
