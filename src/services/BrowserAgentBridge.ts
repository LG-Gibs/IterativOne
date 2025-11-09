import { agentBackendService } from './AgentBackendService';

export interface BrowserCommand {
  type: 'navigate' | 'createTab' | 'closeTab' | 'switchTab' | 'toggleMute';
  tabId?: string;
  url?: string;
  muted?: boolean;
}

export class BrowserAgentBridge {
  private sessionId: string | null = null;

  async initialize(apiUrl?: string, wsUrl?: string) {
    try {
      const session = await agentBackendService.initializeSession(apiUrl, wsUrl);
      this.sessionId = session.id;
      return session;
    } catch (error) {
      console.error('Failed to initialize BrowserAgentBridge:', error);
      throw error;
    }
  }

  async executeCommand(command: BrowserCommand) {
    if (!this.sessionId) {
      throw new Error('Bridge not initialized');
    }

    try {
      const payload = {
        ...command,
        sessionId: this.sessionId,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-api/command`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Command execution failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to execute browser command:', error);
      throw error;
    }
  }

  async delegateTask(
    agentName: string,
    taskName: string,
    taskDescription?: string
  ) {
    if (!this.sessionId) {
      throw new Error('Bridge not initialized');
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-api/delegate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: this.sessionId,
            agentName,
            taskName,
            taskDescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Task delegation failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to delegate task:', error);
      throw error;
    }
  }

  async queryAgent(agentName: string, query: string, context?: Record<string, any>) {
    if (!this.sessionId) {
      throw new Error('Bridge not initialized');
    }

    try {
      return await agentBackendService.queryAgent({
        sessionId: this.sessionId,
        agentName,
        query,
        context,
      });
    } catch (error) {
      console.error('Failed to query agent:', error);
      throw error;
    }
  }

  async getSessionMetrics() {
    try {
      return await agentBackendService.getSessionData();
    } catch (error) {
      console.error('Failed to get session metrics:', error);
      throw error;
    }
  }

  getSessionId() {
    return this.sessionId;
  }

  async cleanup() {
    await agentBackendService.cleanupSession();
    this.sessionId = null;
  }
}

export const browserAgentBridge = new BrowserAgentBridge();
