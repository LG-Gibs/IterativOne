import { create } from 'zustand';
import type { Agent, Goal, Project, Message, ResearchItem } from '../types/agent';
import { CoFounderAgent } from '../agents/CoFounderAgent';
import { MBAAgent } from '../agents/functional/MBAAgent';
import { CFAAgent } from '../agents/functional/CFAAgent';
import { CRAAgent } from '../agents/functional/CRAAgent';
import { PBAAgent } from '../agents/functional/PBAAgent';

const agentInstances = [
  new CoFounderAgent(),
  new MBAAgent(),
  new CFAAgent(),
  new CRAAgent(),
  new PBAAgent(),
];

interface AgentState {
  agents: Agent[];
  activeAgent: Agent | null;
  goals: Goal[];
  projects: Project[];
  researchItems: ResearchItem[];
  conversationHistory: Message[];
  vestedInterestScore: number;
  
  setActiveAgent: (agent: Agent) => void;
  addMessage: (message: Message) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addResearchItem: (item: ResearchItem) => void;
  incrementVestedInterest: (delta: number) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: agentInstances,
  activeAgent: agentInstances[0],
  goals: [
    {
      id: '1',
      title: 'Launch MVP for SaaS product',
      description: 'Build and deploy minimum viable product',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date('2025-11-01'),
      assignedAgent: 'pba',
    },
    {
      id: '2',
      title: 'Secure seed funding',
      description: 'Raise $500K seed round',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date('2025-11-02'),
      assignedAgent: 'mba',
    },
    {
      id: '3',
      title: 'Build landing page',
      description: 'Create marketing website',
      status: 'completed',
      priority: 'medium',
      createdAt: new Date('2025-10-28'),
    },
  ],
  projects: [
    {
      id: '1',
      name: 'SaaS Platform',
      description: 'B2B productivity software',
      status: 'active',
      createdAt: new Date('2025-10-15'),
      updatedAt: new Date(),
      assignedAgents: ['mba', 'pba'],
      progress: 65,
    },
    {
      id: '2',
      name: 'Market Research',
      description: 'TAM/SAM/SOM analysis',
      status: 'active',
      createdAt: new Date('2025-10-20'),
      updatedAt: new Date(),
      assignedAgents: ['mba', 'cfa'],
      progress: 80,
    },
  ],
  researchItems: [
    {
      id: '1',
      title: 'SaaS Pricing Models Analysis',
      url: 'https://example.com/pricing',
      content: 'Comprehensive pricing analysis...',
      summary: 'Freemium, tiered, and usage-based models compared',
      tags: ['pricing', 'saas', 'business-model'],
      createdAt: new Date('2025-11-05'),
      linkedProjects: ['1'],
    },
  ],
  conversationHistory: [],
  vestedInterestScore: 78,

  setActiveAgent: (agent) => set({ activeAgent: agent }),
  
  addMessage: (message) =>
    set((state) => ({
      conversationHistory: [...state.conversationHistory, message],
    })),
  
  addGoal: (goal) =>
    set((state) => ({
      goals: [...state.goals, goal],
    })),
  
  updateGoal: (id, updates) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })),
  
  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),
  
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  
  addResearchItem: (item) =>
    set((state) => ({
      researchItems: [...state.researchItems, item],
    })),
  
  incrementVestedInterest: (delta) =>
    set((state) => ({
      vestedInterestScore: Math.min(100, Math.max(0, state.vestedInterestScore + delta)),
    })),
}));
