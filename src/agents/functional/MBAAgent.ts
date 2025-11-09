import { BaseAgent } from '../BaseAgent';
import type { AgentContext, AgentCapability } from '../../types/agent';

export class MBAAgent extends BaseAgent {
  id = 'mba-001';
  role = 'mba' as const;
  name = 'Morgan';
  title = 'Agent-MBA';
  description = 'Financial modeling, business planning, and market analysis specialist';
  avatar = '📊';
  
  capabilities: AgentCapability[] = [
    {
      id: 'financial-modeling',
      name: 'Financial Modeling',
      description: 'Build comprehensive financial models and projections',
      category: 'Finance'
    },
    {
      id: 'business-planning',
      name: 'Business Planning',
      description: 'Develop strategic business plans and roadmaps',
      category: 'Strategy'
    },
    {
      id: 'market-analysis',
      name: 'Market Analysis',
      description: 'Analyze market trends and competitive landscapes',
      category: 'Research'
    },
    {
      id: 'valuation',
      name: 'Business Valuation',
      description: 'Company and asset valuation analysis',
      category: 'Finance'
    }
  ];

  protected async generateResponse(message: string, _context: AgentContext): Promise<string> {
    if (message.toLowerCase().includes('financial') || message.toLowerCase().includes('revenue')) {
      return `I can help with financial analysis. Let me build a model for ${this.extractKeyTopic(message)}. Would you like a 3-year or 5-year projection?`;
    }
    
    if (message.toLowerCase().includes('market') || message.toLowerCase().includes('competition')) {
      return `I'll conduct a market analysis for ${this.extractKeyTopic(message)}. I'll examine market size, growth trends, and competitive positioning.`;
    }
    
    return `I specialize in financial modeling and business planning. How can I help you with your business strategy?`;
  }

  private extractKeyTopic(message: string): string {
    const words = message.split(' ').filter(w => w.length > 4);
    return words[0] || 'this area';
  }
}
