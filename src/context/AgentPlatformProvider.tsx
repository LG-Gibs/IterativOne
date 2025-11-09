import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAgentStore } from '../store/agentStore';
import type { Message } from '../types/agent';

interface AgentPlatformContextType {
  isAgentSidebarOpen: boolean;
  isOmniboxOpen: boolean;
  openAgentSidebar: () => void;
  closeAgentSidebar: () => void;
  toggleAgentSidebar: () => void;
  openOmnibox: () => void;
  closeOmnibox: () => void;
  executeCommand: (command: string) => Promise<void>;
  queryAgent: (agentName: string, query: string) => Promise<string>;
}

const AgentPlatformContext = createContext<AgentPlatformContextType | undefined>(undefined);

export function AgentPlatformProvider({ children }: { children: ReactNode }) {
  const [isAgentSidebarOpen, setIsAgentSidebarOpen] = useState(false);
  const [isOmniboxOpen, setIsOmniboxOpen] = useState(false);
  const { activeAgent, addMessage, incrementVestedInterest } = useAgentStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOmniboxOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const executeCommand = async (command: string) => {
    if (command.startsWith('?')) {
      const parts = command.slice(1).trim().split(' ');
      const query = parts.slice(1).join(' ') || 'Hello';
      
      if (query) {
        await queryAgent(parts[0], query);
        setIsAgentSidebarOpen(true);
      }
    } else if (command.startsWith('/')) {
      const route = command.slice(1).trim();
      if (route === 'browser' || route === 'browser-demo') {
        window.location.href = '?demo=true';
      } else {
        window.location.hash = route;
      }
    } else {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(command)}`;
    }
  };

  const queryAgent = async (agentName: string, query: string): Promise<string> => {
    const { agents, setActiveAgent: setAgent } = useAgentStore.getState();
    
    const targetAgent = agents.find(
      a => a.name.toLowerCase() === agentName.toLowerCase() || 
           a.role.toLowerCase() === agentName.toLowerCase()
    );
    
    if (!targetAgent) {
      console.warn(`Agent "${agentName}" not found, using active agent`);
      if (!activeAgent) return 'No active agent available';
    } else {
      setAgent(targetAgent);
    }
    
    const agent = targetAgent || activeAgent!;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    try {
      const response = await agent.processMessage(query, {
        currentUrl: window.location.href,
        activeProjects: useAgentStore.getState().projects.filter(p => p.status === 'active'),
        recentGoals: useAgentStore.getState().goals.slice(0, 5),
        conversationHistory: useAgentStore.getState().conversationHistory,
      });

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: response,
        timestamp: new Date(),
        agentRole: agent.role,
      };
      addMessage(agentMessage);
      incrementVestedInterest(1);

      return response;
    } catch (error) {
      console.error('Failed to query agent:', error);
      return 'Sorry, I encountered an error processing your request.';
    }
  };

  const value: AgentPlatformContextType = {
    isAgentSidebarOpen,
    isOmniboxOpen,
    openAgentSidebar: () => setIsAgentSidebarOpen(true),
    closeAgentSidebar: () => setIsAgentSidebarOpen(false),
    toggleAgentSidebar: () => setIsAgentSidebarOpen((prev) => !prev),
    openOmnibox: () => setIsOmniboxOpen(true),
    closeOmnibox: () => setIsOmniboxOpen(false),
    executeCommand,
    queryAgent,
  };

  return (
    <AgentPlatformContext.Provider value={value}>
      {children}
    </AgentPlatformContext.Provider>
  );
}

export function useAgentPlatform() {
  const context = useContext(AgentPlatformContext);
  if (!context) {
    throw new Error('useAgentPlatform must be used within AgentPlatformProvider');
  }
  return context;
}
