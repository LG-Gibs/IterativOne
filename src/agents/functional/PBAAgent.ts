import { BaseAgent } from '../BaseAgent';
import type { AgentContext, AgentCapability } from '../../types/agent';

export class PBAAgent extends BaseAgent {
  id = 'pba-001';
  role = 'pba' as const;
  name = 'Parker';
  title = 'Agent-PBA';
  description = 'Product and business analysis, requirements engineering specialist';
  avatar = '📋';
  
  capabilities: AgentCapability[] = [
    {
      id: 'requirements-engineering',
      name: 'Requirements Engineering',
      description: 'Gather, analyze, and document product requirements',
      category: 'Analysis'
    },
    {
      id: 'process-optimization',
      name: 'Process Optimization',
      description: 'Improve business processes and workflows',
      category: 'Operations'
    },
    {
      id: 'stakeholder-analysis',
      name: 'Stakeholder Analysis',
      description: 'Map and manage stakeholder relationships',
      category: 'Management'
    }
  ];

  protected async generateResponse(message: string, _context: AgentContext): Promise<string> {
    if (message.toLowerCase().includes('requirement') || message.toLowerCase().includes('feature')) {
      return `I'll help gather and document requirements. Let's start by identifying key stakeholders and their needs.`;
    }
    
    if (message.toLowerCase().includes('process')) {
      return `I can analyze your process. I'll map the current state, identify bottlenecks, and propose optimizations.`;
    }
    
    return `I specialize in requirements engineering and business analysis. What project are you working on?`;
  }
}
