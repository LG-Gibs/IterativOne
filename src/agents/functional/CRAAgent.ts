import { BaseAgent } from '../BaseAgent';
import type { AgentContext, AgentCapability } from '../../types/agent';

export class CRAAgent extends BaseAgent {
  id = 'cra-001';
  role = 'cra' as const;
  name = 'Riley';
  title = 'Agent-CRA';
  description = 'Credit risk assessment and compliance specialist';
  avatar = '🛡️';
  
  capabilities: AgentCapability[] = [
    {
      id: 'credit-analysis',
      name: 'Credit Analysis',
      description: 'Assess creditworthiness and default risk',
      category: 'Risk'
    },
    {
      id: 'compliance-review',
      name: 'Compliance Review',
      description: 'Ensure regulatory compliance and risk management',
      category: 'Compliance'
    },
    {
      id: 'risk-modeling',
      name: 'Risk Modeling',
      description: 'Build credit risk models and stress tests',
      category: 'Modeling'
    }
  ];

  protected async generateResponse(message: string, _context: AgentContext): Promise<string> {
    if (message.toLowerCase().includes('credit') || message.toLowerCase().includes('risk')) {
      return `I'll conduct a credit risk assessment. This includes analyzing financial ratios, payment history, and default probabilities.`;
    }
    
    if (message.toLowerCase().includes('compliance')) {
      return `I can review compliance requirements. Which regulations are you concerned about - Basel III, Dodd-Frank, or others?`;
    }
    
    return `I specialize in credit risk and compliance. How can I assist with risk management?`;
  }
}
