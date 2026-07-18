import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { systemPrompts, contextPrompts, generationPrompts } from '../prompts/documentation.prompt';

const client = new Anthropic();

interface AgentTask {
  type: 'documentation' | 'testing' | 'review' | 'analysis' | 'optimization';
  name: string;
  context: string;
  targetFile?: string;
}

class MCPAgentLoop {
  private model = 'claude-opus-4-1-20250805';
  private tasks: AgentTask[] = [];
  private results: Map<string, string> = new Map();

  async initialize() {
    console.log('🤖 MCP Agent Loop Initializing...\n');
    this.setupTasks();
  }

  private setupTasks() {
    this.tasks = [
      {
        type: 'documentation',
        name: 'Generate API Documentation',
        context: 'REST API endpoints for Inventory Management',
        targetFile: 'docs/API_GUIDE.md',
      },
      {
        type: 'testing',
        name: 'Generate Test Cases',
        context: 'Integration tests for critical API endpoints',
        targetFile: 'docs/TEST_CASES.md',
      },
      {
        type: 'review',
        name: 'Code Review Report',
        context: 'Review inventory service implementation',
      },
      {
        type: 'analysis',
        name: 'Architecture Analysis',
        context: 'Review REST, GraphQL, and gRPC architecture',
        targetFile: 'docs/ARCHITECTURE_ANALYSIS.md',
      },
      {
        type: 'optimization',
        name: 'Performance Optimization Suggestions',
        context: 'Analyze and suggest optimizations',
        targetFile: 'docs/OPTIMIZATION_GUIDE.md',
      },
    ];
  }

  async runAgentLoop() {
    console.log('📋 Starting Agent Loop with the following tasks:\n');

    for (const task of this.tasks) {
      console.log(`\n▶️  Task: ${task.name}`);
      console.log(`   Type: ${task.type}`);
      console.log(`   Context: ${task.context}`);

      try {
        const result = await this.executeTask(task);
        this.results.set(task.name, result);

        if (task.targetFile) {
          const outputPath = path.join(__dirname, '../../', task.targetFile);
          const outputDir = path.dirname(outputPath);

          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          fs.writeFileSync(outputPath, result);
          console.log(`✅ Generated: ${task.targetFile}`);
        } else {
          console.log(`✅ Completed successfully`);
        }
      } catch (error) {
        console.error(`❌ Error in task ${task.name}:`, error);
      }
    }

    await this.generateSummary();
  }

  private async executeTask(task: AgentTask): Promise<string> {
    const systemPrompt = this.getSystemPrompt(task.type);
    const userPrompt = this.generateUserPrompt(task);

    const message = await client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text;
    }

    throw new Error('Unexpected response type from API');
  }

  private getSystemPrompt(taskType: string): string {
    switch (taskType) {
      case 'documentation':
        return systemPrompts.apiDocumentation;
      case 'testing':
        return systemPrompts.apiTesting;
      case 'review':
        return systemPrompts.codeReview;
      case 'analysis':
        return systemPrompts.architectureAnalysis;
      case 'optimization':
        return systemPrompts.performanceOptimization;
      default:
        return 'You are a helpful AI assistant.';
    }
  }

  private generateUserPrompt(task: AgentTask): string {
    switch (task.type) {
      case 'documentation':
        return generationPrompts.generateReadme('Inventory Management API', [
          'REST, GraphQL, and gRPC APIs',
          'Multi-protocol support',
          'JWT authentication',
          'Role-based access control',
          'Comprehensive inventory tracking',
          'Stock movement history',
        ]);

      case 'testing':
        return contextPrompts.generateTestCases('/api/v1/inventory', {
          create: 'POST with inventory data',
          read: 'GET by ID',
          transfer: 'POST to transfer between warehouses',
        });

      case 'review':
        return `Review the following service implementation for code quality, security, and best practices:

File: src/services/inventory.service.ts

Focus areas:
1. Error handling
2. Business logic correctness
3. Security vulnerabilities
4. Performance considerations
5. Code maintainability`;

      case 'analysis':
        return contextPrompts.analyzeArchitecture([
          'REST API (Express)',
          'GraphQL API (Apollo Server)',
          'gRPC Services',
          'In-memory Repositories',
          'Service Layer',
          'Authentication Middleware',
        ]);

      case 'optimization':
        return `Analyze the Inventory Management API for performance optimization opportunities.

Current architecture:
- Express.js REST API
- Apollo Server GraphQL
- gRPC services
- In-memory data storage

Suggest optimizations for:
1. Database query performance
2. Caching strategies
3. API response times
4. Memory usage
5. Concurrent request handling`;

      default:
        return `Please help with the following task: ${task.context}`;
    }
  }

  private async generateSummary() {
    console.log('\n\n📊 Agent Loop Summary\n');
    console.log('='.repeat(50));

    const summaryPrompt = `
Generate a brief executive summary of the following AI-generated documentation tasks:

${Array.from(this.results.entries())
  .map(([name]) => `- ${name}`)
  .join('\n')}

Highlight:
1. Key findings
2. Critical recommendations
3. Next steps
4. Overall system health assessment`;

    try {
      const summary = await client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: 'You are an executive summarizer. Provide concise, actionable summaries.',
        messages: [
          {
            role: 'user',
            content: summaryPrompt,
          },
        ],
      });

      const content = summary.content[0];
      if (content.type === 'text') {
        console.log(content.text);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✨ Agent Loop Completed!\n');
  }
}

// Main execution
async function main() {
  const agent = new MCPAgentLoop();
  await agent.initialize();
  await agent.runAgentLoop();
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export default MCPAgentLoop;
