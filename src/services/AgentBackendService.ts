import { supabase } from './supabaseClient';
import type { Tab } from '../types/browser';

export interface AgentContext {
  sessionId: string;
  agentName: string;
  agentType: 'cofounder' | 'mba' | 'cfa' | 'cra' | 'pba';
  vestedInterestScore: number;
  contextData: Record<string, any>;
  memoryData: Record<string, any>;
}

export interface BrowserCommand {
  type: 'navigate' | 'createTab' | 'closeTab' | 'switchTab' | 'toggleMute';
  tabId?: string;
  url?: string;
  muted?: boolean;
}

export interface AgentQuery {
  sessionId: string;
  agentName: string;
  query: string;
  context?: Record<string, any>;
}

export interface AgentResponse {
  result: string;
  data?: any;
  vestedInterestDelta?: number;
}

export class AgentBackendService {
  private sessionId: string | null = null;
  private agentSessions: Map<string, AgentContext> = new Map();

  async initializeSession(apiUrl?: string, wsUrl?: string) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const { data: session, error } = await supabase
        .from('sessions')
        .insert({
          user_id: userData.user.id,
          api_url: apiUrl,
          ws_url: wsUrl,
          connection_status: 'disconnected',
        })
        .select()
        .single();

      if (error) throw error;

      this.sessionId = session.id;
      return session;
    } catch (error) {
      console.error('Failed to initialize session:', error);
      throw error;
    }
  }

  async initializeAgent(
    agentName: string,
    agentType: AgentContext['agentType']
  ): Promise<AgentContext> {
    if (!this.sessionId) {
      throw new Error('Session not initialized');
    }

    try {
      const { data: agentSession, error } = await supabase
        .from('agent_sessions')
        .insert({
          session_id: this.sessionId,
          agent_name: agentName,
          agent_type: agentType,
          vested_interest_score: 0,
          context_data: {},
          memory_data: {},
        })
        .select()
        .single();

      if (error) throw error;

      const context: AgentContext = {
        sessionId: this.sessionId,
        agentName,
        agentType,
        vestedInterestScore: agentSession.vested_interest_score,
        contextData: agentSession.context_data,
        memoryData: agentSession.memory_data,
      };

      this.agentSessions.set(agentName, context);
      return context;
    } catch (error) {
      console.error('Failed to initialize agent:', error);
      throw error;
    }
  }

  async recordBrowserEvent(
    eventType: string,
    eventData: Record<string, any>,
    contextId?: string
  ) {
    if (!this.sessionId) return;

    try {
      await supabase.from('browser_events').insert({
        session_id: this.sessionId,
        context_id: contextId,
        event_type: eventType,
        event_data: eventData,
      });
    } catch (error) {
      console.error('Failed to record browser event:', error);
    }
  }

  async recordBrowserCommand(command: BrowserCommand) {
    await this.recordBrowserEvent('command', command);
  }

  async recordTabsUpdate(tabs: Tab[]) {
    await this.recordBrowserEvent('tabs:updated', { tabs });
  }

  async queryAgent(query: AgentQuery): Promise<AgentResponse> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(query),
        }
      );

      if (!response.ok) {
        throw new Error(`Agent query failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to query agent:', error);
      throw error;
    }
  }

  async delegateTask(
    agentName: string,
    taskName: string,
    taskDescription?: string
  ) {
    const agentSession = this.agentSessions.get(agentName);
    if (!agentSession) {
      throw new Error(`Agent ${agentName} not initialized`);
    }

    try {
      const { data: delegation, error } = await supabase
        .from('agent_delegations')
        .insert({
          agent_session_id: agentSession.sessionId,
          task_name: taskName,
          task_description: taskDescription,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      return delegation;
    } catch (error) {
      console.error('Failed to delegate task:', error);
      throw error;
    }
  }

  async updateSessionStatus(status: 'connected' | 'connecting' | 'disconnected') {
    if (!this.sessionId) return;

    try {
      await supabase
        .from('sessions')
        .update({ connection_status: status })
        .eq('id', this.sessionId);
    } catch (error) {
      console.error('Failed to update session status:', error);
    }
  }

  async getSessionData() {
    if (!this.sessionId) {
      throw new Error('Session not initialized');
    }

    try {
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', this.sessionId)
        .single();

      if (sessionError) throw sessionError;

      const { data: agents, error: agentsError } = await supabase
        .from('agent_sessions')
        .select('*')
        .eq('session_id', this.sessionId);

      if (agentsError) throw agentsError;

      const { data: events, error: eventsError } = await supabase
        .from('browser_events')
        .select('*')
        .eq('session_id', this.sessionId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (eventsError) throw eventsError;

      return {
        session,
        agents,
        events,
      };
    } catch (error) {
      console.error('Failed to get session data:', error);
      throw error;
    }
  }

  async cleanupSession() {
    if (!this.sessionId) return;

    try {
      await supabase
        .from('sessions')
        .delete()
        .eq('id', this.sessionId);

      this.sessionId = null;
      this.agentSessions.clear();
    } catch (error) {
      console.error('Failed to cleanup session:', error);
    }
  }

  getSessionId() {
    return this.sessionId;
  }
}

export const agentBackendService = new AgentBackendService();
