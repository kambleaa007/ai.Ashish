export const systemPrompts = {
  apiDocumentation: `You are an expert API documentation writer. Your task is to generate comprehensive, clear, and accurate API documentation.

Guidelines:
- Provide detailed descriptions of API endpoints, parameters, and responses
- Include example request/response payloads
- Document error codes and status codes
- Explain authentication requirements
- Add usage notes and best practices
- Format output in Markdown for easy integration`,

  apiTesting: `You are an expert API testing specialist. Your task is to create comprehensive test cases and validation scripts.

Guidelines:
- Generate realistic test scenarios covering happy path and edge cases
- Include authentication and authorization tests
- Test data validation and error handling
- Create performance testing scenarios
- Document expected outcomes and assertions
- Format as executable test code or detailed test plans`,

  codeReview: `You are an expert code reviewer with focus on best practices, security, and maintainability.

Guidelines:
- Review code for security vulnerabilities
- Check adherence to coding standards and best practices
- Identify performance bottlenecks
- Suggest improvements for maintainability and readability
- Flag potential bugs or logical errors
- Provide specific, actionable feedback
- Prioritize findings by severity`,

  architectureAnalysis: `You are an expert in software architecture and system design.

Guidelines:
- Analyze the overall system architecture
- Identify scalability concerns
- Review design patterns and their proper implementation
- Suggest architectural improvements
- Document system components and their interactions
- Identify potential technical debt
- Provide recommendations for future enhancements`,

  performanceOptimization: `You are an expert in performance optimization and system tuning.

Guidelines:
- Analyze code for performance bottlenecks
- Review database queries and caching strategies
- Suggest optimization techniques
- Identify resource leaks or inefficiencies
- Provide benchmarking recommendations
- Document optimization impact and trade-offs
- Prioritize optimizations by impact`,
};

export const contextPrompts = {
  generateApiDocs: (apiEndpoint: string, method: string, schema: any) => `
Generate comprehensive API documentation for the following endpoint:

Endpoint: ${method.toUpperCase()} ${apiEndpoint}
Schema: ${JSON.stringify(schema, null, 2)}

Include:
1. Clear endpoint description
2. Request parameters and body schema
3. Response schema with examples
4. Possible error responses
5. Authentication requirements
6. Usage examples in cURL and popular languages
7. Rate limiting information if applicable
8. Best practices for using this endpoint`,

  generateTestCases: (endpoint: string, schema: any) => `
Generate comprehensive test cases for the following API endpoint:

Endpoint: ${endpoint}
Schema: ${JSON.stringify(schema, null, 2)}

Create test cases covering:
1. Happy path scenarios
2. Input validation failures
3. Authentication/Authorization tests
4. Edge cases and boundary conditions
5. Error handling scenarios
6. Performance tests if applicable
7. Concurrent request handling

Format each test with:
- Test name
- Setup/Preconditions
- Request details
- Expected response
- Assertions`,

  reviewCode: (code: string, context: string) => `
Please review the following code:

Context: ${context}

Code:
\`\`\`typescript
${code}
\`\`\`

Provide a comprehensive review including:
1. Security vulnerabilities or concerns
2. Performance issues
3. Code quality and maintainability
4. Best practices adherence
5. Error handling adequacy
6. Testing coverage suggestions
7. Refactoring recommendations

Format your response with severity levels (Critical, High, Medium, Low).`,

  analyzeArchitecture: (components: string[]) => `
Analyze the system architecture with the following components:

Components: ${components.join(', ')}

Provide analysis on:
1. Component responsibilities and dependencies
2. Data flow between components
3. Scalability considerations
4. Potential bottlenecks
5. Architectural patterns identified
6. Compliance with SOLID principles
7. Recommendations for improvement`,

  optimizePerformance: (metrics: any) => `
Analyze and optimize performance based on these metrics:

Metrics: ${JSON.stringify(metrics, null, 2)}

Provide:
1. Performance bottleneck analysis
2. Root cause identification
3. Optimization strategies with estimated improvements
4. Implementation recommendations
5. Monitoring and benchmarking approach
6. Trade-offs and considerations
7. Priority ranking of optimizations`,
};

export const generationPrompts = {
  generateReadme: (projectName: string, features: string[]) => `
Generate a comprehensive README.md for the ${projectName} project.

Key features:
${features.map(f => `- ${f}`).join('\n')}

Include sections:
1. Project Overview
2. Features
3. Architecture
4. Installation & Setup
5. Running the Application
6. API Endpoints Overview
7. Testing
8. Project Structure
9. Contributing Guidelines
10. License

Make it professional and easy to follow.`,

  generateArchitectureDiagram: (components: string[]) => `
Create a comprehensive ASCII or Mermaid diagram for the system architecture.

Components to include:
${components.map(c => `- ${c}`).join('\n')}

Show:
1. Component relationships
2. Data flow directions
3. External integrations
4. Database connections
5. API layers
6. Authentication flow

Use Mermaid diagram syntax for clarity.`,

  generateDeploymentGuide: (platforms: string[]) => `
Generate deployment guides for the following platforms:
${platforms.map(p => `- ${p}`).join('\n')}

For each platform, include:
1. Prerequisites
2. Environment setup
3. Configuration
4. Deployment steps
5. Verification
6. Troubleshooting
7. Scaling considerations
8. Monitoring setup`,
};
