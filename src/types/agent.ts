export type AgentRole = 
  | 'cofounder'
  | 'mba'
  | 'cfa'
  | 'cra'
  | 'pba';

export type MessageRole = 'user' | 'agent' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  agentRole?: AgentRole;
}

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Agent {
  id: string;
  role: AgentRole;
  name: string;
  title: string;
  description: string;
  avatar: string;
  capabilities: AgentCapability[];
  isActive: boolean;
  processMessage(message: string, context: AgentContext): Promise<string>;
  activate(): void;
  deactivate(): void;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'review' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  assignedAgents: AgentRole[];
  progress: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  createdAt: Date;
  assignedAgent?: AgentRole;
}

export interface ResearchItem {
  id: string;
  title: string;
  url: string;
  content: string;
  summary?: string;
  tags: string[];
  createdAt: Date;
  linkedProjects: string[];
}

export interface VestedInterest {
  score: number;
  interactions: number;
  lastInteraction: Date;
  milestones: string[];
}

export interface AgentContext {
  currentUrl?: string;
  pageContent?: string;
  userIntent?: string;
  activeProjects: Project[];
  recentGoals: Goal[];
  conversationHistory: Message[];
}
