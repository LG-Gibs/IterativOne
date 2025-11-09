import { BaseAgent } from './BaseAgent';
import type { AgentContext, AgentCapability } from '../types/agent';

export class CoFounderAgent extends BaseAgent {
  id = 'cofounder-001';
  role = 'cofounder' as const;
  name = 'Alex';
  title = 'Co-Founder™';
  description = 'Your strategic business partner with persistent memory and long-term vision';
  avatar = '🤝';
  
  capabilities: AgentCapability[] = [
    {
      id: 'strategic-planning',
      name: 'Strategic Planning',
      description: 'Long-term business strategy and goal setting',
      category: 'Strategy'
    },
    {
      id: 'goal-management',
      name: 'Goal Management',
      description: 'Track and manage business objectives',
      category: 'Management'
    },
    {
      id: 'team-coordination',
      name: 'Team Coordination',
      description: 'Delegate tasks to specialized agents',
      category: 'Coordination'
    },
    {
      id: 'insight-synthesis',
      name: 'Insight Synthesis',
      description: 'Combine insights from multiple sources',
      category: 'Analysis'
    }
  ];

  protected async generateResponse(message: string, _context: AgentContext): Promise<string> {
    const responses = [
      `I understand you're interested in ${this.extractIntent(message)}. Let me help you think through this strategically.`,
      `Based on our ongoing work together, here's my perspective on ${this.extractIntent(message)}...`,
      `That's an interesting direction. Let's break this down and see how it aligns with your broader goals.`,
      `I can help with that. Would you like me to delegate this to one of our specialized agents, or shall we think through it together first?`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private extractIntent(message: string): string {
    const words = message.toLowerCase().split(' ');
    const keywords = words.filter(w => w.length > 4);
    return keywords.slice(0, 3).join(' ') || 'your question';
  }

  async delegateToAgent(task: string, agentRole: string): Promise<string> {
    return `Delegating task to Agent-${agentRole.toUpperCase()}: ${task}`;
  }

  async updateVestedInterest(interaction: string): Promise<void> {
    console.log(`Updating VestedInterest™ score based on: ${interaction}`);
  }
}
