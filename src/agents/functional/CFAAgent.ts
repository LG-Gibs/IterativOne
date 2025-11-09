import { BaseAgent } from '../BaseAgent';
import type { AgentContext, AgentCapability } from '../../types/agent';

export class CFAAgent extends BaseAgent {
  id = 'cfa-001';
  role = 'cfa' as const;
  name = 'Carter';
  title = 'Agent-CFA';
  description = 'Investment analysis, portfolio management, and financial markets expert';
  avatar = '💹';
  
  capabilities: AgentCapability[] = [
    {
      id: 'investment-analysis',
      name: 'Investment Analysis',
      description: 'Deep dive into investment opportunities and risks',
      category: 'Investments'
    },
    {
      id: 'portfolio-management',
      name: 'Portfolio Management',
      description: 'Optimize and manage investment portfolios',
      category: 'Investments'
    },
    {
      id: 'risk-assessment',
      name: 'Risk Assessment',
      description: 'Evaluate and quantify investment risks',
      category: 'Risk'
    },
    {
      id: 'market-research',
      name: 'Market Research',
      description: 'Research securities, sectors, and market trends',
      category: 'Research'
    }
  ];

  protected async generateResponse(message: string, _context: AgentContext): Promise<string> {
    if (message.toLowerCase().includes('invest') || message.toLowerCase().includes('portfolio')) {
      return `I can analyze investment opportunities for you. What type of assets are you interested in - equities, fixed income, alternatives?`;
    }
    
    if (message.toLowerCase().includes('risk')) {
      return `Let me assess the risk profile. I'll examine volatility, correlation, and downside scenarios.`;
    }
    
    return `I specialize in investment analysis and portfolio management. What would you like to explore?`;
  }
}
