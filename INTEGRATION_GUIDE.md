# IterativOne Browser - Integration Layer Guide

## Overview

The integration layer connects the IterativOne Browser UI to an agent-powered backend system. It provides persistent session management, command recording, task delegation, and multi-agent orchestration capabilities.

## Architecture

### Core Components

1. **Supabase Database** - Persistent storage for sessions, contexts, agents, and events
2. **Edge Functions** - Serverless handlers for agent queries and commands
3. **Browser Services** - Frontend integrations for data fetching and event handling
4. **Context Providers** - React context for browser state management
5. **Bridges** - High-level interfaces between UI and backend

## Database Schema

### Tables

#### `sessions`
User browser sessions with agent context. Tracks connection status and API endpoints.

```sql
- id: uuid (primary key)
- user_id: uuid (references auth.users)
- browser_type: text (default: 'chromium')
- connection_status: text ('connected', 'connecting', 'disconnected')
- api_url: text (REST endpoint for Chromium API)
- ws_url: text (WebSocket endpoint for real-time events)
- created_at: timestamptz
- updated_at: timestamptz
```

#### `browser_contexts`
Individual browser window/tab contexts for multi-window support.

```sql
- id: uuid (primary key)
- session_id: uuid (references sessions)
- context_type: text ('window', 'tab', etc)
- title: text
- url: text
- created_at: timestamptz
- updated_at: timestamptz
```

#### `agent_sessions`
Agent instances within a user session with VestedInterest™ tracking.

```sql
- id: uuid (primary key)
- session_id: uuid (references sessions)
- agent_name: text
- agent_type: text ('cofounder', 'mba', 'cfa', 'cra', 'pba')
- vested_interest_score: decimal
- context_data: jsonb (agent-specific context)
- memory_data: jsonb (agent long-term memory)
- created_at: timestamptz
- updated_at: timestamptz
```

#### `browser_events`
Complete event log for debugging and replay.

```sql
- id: uuid (primary key)
- session_id: uuid (references sessions)
- context_id: uuid (references browser_contexts, nullable)
- event_type: text
- event_data: jsonb
- created_at: timestamptz
```

#### `agent_delegations`
Task assignments and tracking for agent coordination.

```sql
- id: uuid (primary key)
- agent_session_id: uuid (references agent_sessions)
- task_name: text
- task_description: text
- status: text ('pending', 'in_progress', 'completed', 'failed')
- result: jsonb
- created_at: timestamptz
- completed_at: timestamptz
```

## Services

### AgentBackendService
High-level service for backend operations.

```typescript
import { agentBackendService } from '@/services/AgentBackendService';

// Initialize session
await agentBackendService.initializeSession(apiUrl, wsUrl);

// Initialize agent
const agent = await agentBackendService.initializeAgent('co-founder', 'cofounder');

// Record events
await agentBackendService.recordBrowserEvent('tab:created', { tabId, title });
await agentBackendService.recordBrowserCommand({ type: 'navigate', url });

// Query agent
const response = await agentBackendService.queryAgent({
  sessionId,
  agentName: 'co-founder',
  query: 'What should I research next?',
  context: { currentPage: 'tech news' }
});

// Delegate tasks
const delegation = await agentBackendService.delegateTask(
  'mba-agent',
  'analyze-market',
  'Analyze market opportunities for SaaS tools'
);

// Get session data
const data = await agentBackendService.getSessionData();
```

### AgentIntegratedDataSource
Data source that records all browser operations to the backend.

```typescript
import { AgentIntegratedDataSource } from '@/services/AgentIntegratedDataSource';

const dataSource = new AgentIntegratedDataSource('http://localhost:9222');

// All operations automatically record to backend
await dataSource.fetchTabs();
await dataSource.createTab({ url: 'https://example.com' });
await dataSource.navigate({ url: 'https://news.ycombinator.com' });
await dataSource.toggleMute({ tabId: '123', muted: true });
```

### BrowserAgentBridge
High-level bridge for browser-agent communication.

```typescript
import { browserAgentBridge } from '@/services/BrowserAgentBridge';

// Initialize
await browserAgentBridge.initialize(apiUrl, wsUrl);

// Execute commands
await browserAgentBridge.executeCommand({
  type: 'navigate',
  url: 'https://example.com'
});

// Delegate tasks
const delegation = await browserAgentBridge.delegateTask(
  'mba',
  'market-analysis',
  'Analyze the market for our new product'
);

// Query agents
const response = await browserAgentBridge.queryAgent(
  'co-founder',
  'Should we pivot to AI?',
  { currentRevenue: 100000 }
);

// Get metrics
const metrics = await browserAgentBridge.getSessionMetrics();

// Cleanup
await browserAgentBridge.cleanup();
```

## Edge Functions

### `agent-query`
Process agent queries and return responses.

**Endpoint:** `POST /functions/v1/agent-query`

**Request:**
```json
{
  "sessionId": "uuid",
  "agentName": "co-founder",
  "query": "What should I research next?",
  "context": {}
}
```

**Response:**
```json
{
  "result": "Agent response text",
  "data": {},
  "vestedInterestDelta": 1
}
```

### `agent-api`
Unified API for commands and task delegation.

**Endpoints:**
- `POST /functions/v1/agent-api/command` - Execute browser command
- `POST /functions/v1/agent-api/delegate` - Delegate task to agent
- `GET /functions/v1/agent-api/health` - Health check

**Command Request:**
```json
{
  "type": "navigate",
  "sessionId": "uuid",
  "url": "https://example.com",
  "tabId": "123"
}
```

**Delegation Request:**
```json
{
  "sessionId": "uuid",
  "agentName": "mba",
  "taskName": "market-analysis",
  "taskDescription": "Analyze market opportunities"
}
```

## React Integration

### BrowserProvider
Context provider for browser state management.

```typescript
import { BrowserProvider, useBrowser } from '@/context/BrowserContext';

function MyApp() {
  return (
    <BrowserProvider
      mode="agent-integrated"
      apiUrl="http://localhost:9222"
      wsUrl="ws://localhost:9223"
      enableAgentBackend={true}
    >
      <MyComponent />
    </BrowserProvider>
  );
}

function MyComponent() {
  const browser = useBrowser();

  return (
    <div>
      <p>Connection: {browser.connectionStatus}</p>
      <button onClick={() => browser.navigate('https://example.com')}>
        Navigate
      </button>
    </div>
  );
}
```

## Usage Modes

### Demo Mode
Pure frontend demo with simulated data.

```typescript
<BrowserProvider mode="demo">
  <BrowserDemo />
</BrowserProvider>
```

### Live Mode
Connected to actual Chromium instance.

```typescript
<BrowserProvider
  mode="live"
  apiUrl="http://localhost:9222"
  wsUrl="ws://localhost:9223"
  enableAgentBackend={false}
>
  <BrowserDemo />
</BrowserProvider>
```

### Agent-Integrated Mode
Full integration with agent backend and Supabase.

```typescript
<BrowserProvider
  mode="agent-integrated"
  apiUrl="http://localhost:9222"
  wsUrl="ws://localhost:9223"
  enableAgentBackend={true}
>
  <BrowserDemo />
</BrowserProvider>
```

## Event Flow

### Browser Command Flow
```
Browser UI Action
  → useBrowserController
    → AgentIntegratedDataSource (if enabled)
      → recordBrowserCommand()
        → Supabase browser_events table
      → Chromium API call
      → BrowserEventsGateway (WebSocket updates)
```

### Agent Query Flow
```
User Query
  → BrowserAgentBridge.queryAgent()
    → Edge Function: agent-query
      → AgentBackendService
        → Response (with VestedInterestDelta)
```

### Task Delegation Flow
```
Delegate Task
  → BrowserAgentBridge.delegateTask()
    → Edge Function: agent-api/delegate
      → agent_delegations table (status: pending)
      → Agent processes task
      → Status updates to completed/failed
```

## Security

### Row-Level Security (RLS)
All tables have RLS enabled with policies that ensure:
- Users can only access their own sessions
- Agents can only access sessions they're assigned to
- Cross-session data access is prevented

### Authentication
- All Edge Functions verify JWT tokens
- Service role key only used server-side
- Anonymous key restricted by RLS policies

## Monitoring

### Session Metrics
```typescript
const metrics = await browserAgentBridge.getSessionMetrics();
// Returns:
// {
//   session: { id, user_id, connection_status, created_at },
//   agents: [{ agent_name, vested_interest_score, ... }],
//   events: [{ event_type, event_data, created_at, ... }]
// }
```

### Event Replay
Events in `browser_events` table can be replayed for:
- Debugging browser behavior
- User activity analysis
- Agent decision tracing
- Performance profiling

## Development

### Local Testing

1. Ensure Supabase is running
2. Start Chromium with CDP on port 9222
3. Run the frontend:
   ```bash
   npm run dev
   ```
4. Navigate to `/?demo=true` for demo mode
5. Use "Agent Mode" button for full integration

### Debugging

Enable console logging:
```typescript
localStorage.setItem('DEBUG_AGENT_BACKEND', 'true');
```

Monitor Edge Function logs in Supabase dashboard.

## API Reference

### Browser Commands
```typescript
type BrowserCommand =
  | { type: 'navigate'; url: string; tabId?: string }
  | { type: 'createTab'; url?: string }
  | { type: 'closeTab'; tabId: string }
  | { type: 'switchTab'; tabId: string }
  | { type: 'toggleMute'; tabId: string; muted: boolean };
```

### Agent Types
```typescript
type AgentType = 'cofounder' | 'mba' | 'cfa' | 'cra' | 'pba';
```

### Connection Status
```typescript
type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';
```

## Next Steps

1. **Implement Agent Logic** - Add specialized agent implementations
2. **Memory System** - Enhance agent memory_data with vector embeddings
3. **Multi-Agent Collaboration** - Implement inter-agent communication
4. **VestedInterest™ Tracking** - Fine-tune scoring algorithm
5. **Real-time Updates** - Enhance WebSocket handling for live metrics
6. **Analytics Dashboard** - Visualize session metrics and agent performance
