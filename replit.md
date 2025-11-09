# IterativOne V2.0: Agentic-Native Business Computing Platform

## Overview
IterativOne has evolved from a modern browser landing page into a complete agentic-native business computing platform. V2.0 transforms the browser into a strategic command center featuring AI-powered agents, unified command interface, and intelligent workspace orchestration.

## Project Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand for centralized agent orchestration
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **Build Tool**: Vite 5.x
- **Backend Services**: Supabase (optional, gracefully degrades to placeholders)

## Technology Stack
- React 18 with hooks and context API
- TypeScript for type safety
- Zustand for global state management
- Tailwind CSS for styling
- Vite for fast development and optimized builds
- Lucide React for consistent iconography
- Supabase for optional backend persistence

## Project Structure
```
src/
├── agents/                 # AI Agent implementations
│   ├── BaseAgent.ts        # Abstract base class for all agents
│   ├── CoFounderAgent.ts   # Strategic Co-Founder™ agent
│   └── functional/         # Specialized functional agents
│       ├── MBAAgent.ts     # Business analysis agent
│       ├── CFAAgent.ts     # Financial analysis agent
│       ├── CRAAgent.ts     # Risk assessment agent
│       └── PBAAgent.ts     # Product & business analysis agent
├── modules/agentic/        # V2.0 Agentic UI modules
│   ├── PartnerHub.tsx      # Strategic command center
│   ├── AgentSidebar.tsx    # Contextual AI assistant sidebar
│   ├── Omnibox.tsx         # Unified command interface
│   └── Boardroom.tsx       # Research repository
├── store/                  # Zustand state management
│   └── agentStore.ts       # Centralized agent state store
├── context/                # React context providers
│   ├── AgentPlatformProvider.tsx  # Global agent orchestration
│   └── BrowserContext.tsx  # Browser demo state management
├── services/               # Backend integration services
│   ├── AgentBackendService.ts     # Supabase agent backend
│   ├── BrowserAgentBridge.ts      # Agent-browser bridge
│   ├── DemoDataSource.ts          # Demo mode data source
│   ├── LiveDataSource.ts          # Live browser data source
│   ├── AgentIntegratedDataSource.ts  # Agent-integrated browser
│   └── BrowserEventsGateway.ts    # WebSocket event handling
├── components/             # UI components
│   ├── Navigation.tsx      # Sticky navigation with V2.0 links
│   ├── Hero.tsx            # Hero section with parallax
│   ├── FeatureSection.tsx  # Feature showcase
│   ├── Footer.tsx          # Footer
│   └── BrowserMockup.tsx   # Interactive browser demo
├── pages/                  # Top-level pages
│   └── BrowserDemo.tsx     # Browser demonstration page
├── types/                  # TypeScript type definitions
│   ├── agent.ts            # Agent-related types
│   └── browser.ts          # Browser-related types
├── hooks/                  # Custom React hooks
│   └── useBrowserController.ts  # Browser state management hook
├── App.tsx                 # Main application with routing
├── index.css               # Global styles and Tailwind config
└── main.tsx                # Application entry point
```

## Features
- Responsive design optimized for all device sizes
- Smooth parallax scrolling effects
- Interactive navigation with mobile menu support
- Four distinct feature sections showcasing browser capabilities
- Modern gradient-based design system

## Development
The project runs on port 5000 with hot module reloading enabled. Vite is configured to work seamlessly in the Replit environment with proper host and HMR settings.

## Features
- **Demo Mode**: Interactive browser mockup with simulated controls
- **Live Mode**: Connect to actual Chromium instance via REST API + WebSocket
- **Real-time Updates**: WebSocket integration for live browser events
- **Tab Management**: Create, close, switch tabs with full state synchronization
- **Audio Control**: Mute/unmute tabs with audio playback
- **Connection Monitoring**: Real-time status indicators and auto-reconnect

## Chromium Integration Architecture
The application uses a service layer pattern to support both demo and live modes:

### Core Components
- **BrowserDataSource**: Interface for browser operations (demo & live implementations)
- **DemoDataSource**: In-memory simulation for testing and demonstration
- **LiveDataSource**: REST API client for real Chromium instances
- **BrowserEventsGateway**: WebSocket client with auto-reconnect and event parsing
- **useBrowserController**: React hook for unified state management

### API Contract
When connecting to a Chromium instance, the following endpoints are expected:

**REST API Endpoints:**
- `GET /tabs` - Fetch all tabs
- `POST /tabs` - Create a new tab
- `DELETE /tabs/:id` - Close a tab
- `POST /tabs/:id/activate` - Switch to a tab
- `POST /navigate` - Navigate to a URL
- `POST /tabs/:id/audio` - Toggle mute state
- `GET /health` - Health check endpoint

**WebSocket Events:**
- `tabCreated` / `tab:created` - New tab created
- `tabClosed` / `tab:closed` - Tab closed
- `tabSwitched` / `tab:switched` - Active tab changed
- `navigationChanged` / `navigation:changed` - URL navigation occurred
- `audioChanged` / `audio:changed` - Audio state changed
- `tabsUpdated` / `tabs:updated` - Full tab list update

## V2.0 Features: Agentic-Native Platform

### 1. Partner Hub - Strategic Command Center
- **VestedInterest™ Scoring**: Dynamic metric tracking partnership depth and agent engagement (0-100)
- **Goal Management**: Track pending, in-progress, and completed goals with priorities and progress bars
- **Project Dashboard**: Monitor active projects with assigned agents and completion percentages
- **Agent Integration**: Direct access to Co-Founder™ agent for strategic conversations

### 2. Agent Sidebar - Contextual AI Assistant
- **Multi-Agent Support**: Access all 5 agents (Co-Founder™, MBA, CFA, CRA, PBA) from unified sidebar
- **Conversation History**: Shared conversation state across all agents via Zustand store
- **Agent Switching**: Click to switch between agents mid-conversation
- **Minimizable UI**: Collapsible sidebar for focused work
- **Real-time Messaging**: Async agent responses with VestedInterest™ score updates

### 3. Omnibox - Unified Command Interface
- **Keyboard Shortcut**: Ctrl+K (or Cmd+K) to activate from anywhere
- **Command Types**:
  - `?agent-name query` - Query specific agent (e.g., `?mba analyze market size`)
  - `/route` - Navigate to routes (e.g., `/partner-hub`, `/boardroom`, `/browser`)
  - Default text - Web search via Google
- **Intelligent Suggestions**: Contextual autocomplete based on command type
- **Agent Routing**: Automatically sets active agent and opens sidebar for agent queries

### 4. The Boardroom - Research Repository
- **Research Items**: Centralized knowledge base with titles, URLs, summaries, and full content
- **Tagging System**: Filterable tags for organizing research by topic
- **Project Linking**: Associate research with specific projects
- **Search & Filter**: Full-text search + tag-based filtering
- **Time Tracking**: Timestamps for all research items

### 5. AI Agent System
**Co-Founder™ Agent** (Strategic Partner)
- Strategic planning and business development
- High-level decision making and vision alignment
- Partnership coordination

**MBA Agent** (Business Analyst)
- Market research and competitive analysis
- Business model evaluation
- Financial projections and TAM/SAM/SOM

**CFA Agent** (Financial Analyst)
- Investment analysis and due diligence
- Financial modeling and valuation
- Portfolio optimization

**CRA Agent** (Risk Analyst)
- Risk assessment and mitigation strategies
- Compliance and regulatory analysis
- Security auditing

**PBA Agent** (Product & Business Analyst)
- Product requirements and specifications
- User research and stakeholder analysis
- Feature prioritization and roadmapping

## State Management Architecture

### Zustand Store (src/store/agentStore.ts)
Centralized state management for:
- **Agents**: All agent instances with roles, capabilities, and active status
- **Goals**: User goals with status, priority, and progress tracking
- **Projects**: Active projects with assigned agents and completion metrics
- **Research Items**: Knowledge repository with tags and project links
- **Conversation History**: All messages across all agents
- **VestedInterest™ Score**: Dynamic partnership metric (0-100)

### AgentPlatformProvider (src/context/AgentPlatformProvider.tsx)
Global orchestration context providing:
- **Command Execution**: Unified command parser and router
- **Agent Querying**: Intelligent agent selection and message processing
- **UI State**: Sidebar and Omnibox visibility management
- **Keyboard Shortcuts**: Global Ctrl+K handler for Omnibox

## Routing System
- **Landing Page**: `/` - Original browser landing page with feature sections
- **Partner Hub**: `/#partner-hub` - Strategic command center
- **The Boardroom**: `/#boardroom` - Research repository
- **Browser Demo**: `/?demo=true` - Interactive browser demonstration

Routing uses hash-based navigation for V2.0 features while preserving query params for browser demo.

## Recent Changes
- **2025-11-09**: Initial Replit setup
  - Configured Vite for Replit environment (port 5000, host 0.0.0.0)
  - Set up development workflow
  - Added .gitignore for Node.js projects
  - Installed all dependencies
- **2025-11-09**: Chromium Integration Implementation
  - Created service layer architecture for browser operations
  - Implemented demo and live data sources
  - Added WebSocket gateway for real-time updates
  - Built useBrowserController hook for state management
  - Enhanced BrowserMockup component with API integration
  - Added mode switcher and configuration UI to BrowserDemo page

- **2025-11-09**: V2.0 Agentic Platform Launch
  - **Core Infrastructure**:
    - Created Zustand store for centralized state management
    - Built AgentPlatformProvider for global orchestration
    - Extended Agent interface with processMessage contract
    - Implemented graceful Supabase degradation to placeholders
  
  - **V2.0 UI Modules**:
    - Partner Hub: Strategic command center with VestedInterest™ scoring
    - Agent Sidebar: Multi-agent conversation interface
    - Omnibox: Unified command interface with Ctrl+K shortcut
    - The Boardroom: Research repository with tagging and search
  
  - **Agent System**:
    - Co-Founder™ Agent for strategic partnership
    - MBA Agent for business analysis
    - CFA Agent for financial analysis
    - CRA Agent for risk assessment
    - PBA Agent for product/business analysis
  
  - **Integration & Routing**:
    - Wrapped App.tsx with AgentPlatformProvider
    - Implemented hash-based routing for V2.0 features
    - Added global floating buttons for Sidebar and Omnibox
    - Updated Navigation with V2.0 feature links
    - Fixed agent routing in Omnibox commands (critical bug fix)
  
  - **Quality & Testing**:
    - All components integrated with Zustand store
    - Agent routing verified (?mba, ?cfa, etc. correctly route)
    - Zero errors in production build
    - Architect-reviewed and approved
