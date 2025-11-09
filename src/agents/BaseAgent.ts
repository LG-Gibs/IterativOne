import type { Agent, AgentRole, AgentContext } from '../types/agent';

export abstract class BaseAgent implements Agent {
  abstract id: string;
  abstract role: AgentRole;
  abstract name: string;
  abstract title: string;
  abstract description: string;
  abstract avatar: string;
  abstract capabilities: any[];
  
  isActive: boolean = false;

  async processMessage(message: string, context: AgentContext): Promise<string> {
    return this.generateResponse(message, context);
  }

  protected abstract generateResponse(message: string, context: AgentContext): Promise<string>;

  protected async analyzeContext(_context: AgentContext): Promise<{insights: string[]; suggestions: string[]}> {
    return {
      insights: [],
      suggestions: []
    };
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }
}
