# Chromium Integration Guide

This document describes how to connect the IterativOne frontend to a Chromium fork instance.

## Overview

The IterativOne browser interface can operate in two modes:

1. **Demo Mode** - Interactive simulation with in-memory state (default)
2. **Live Mode** - Real-time connection to a Chromium instance via REST API + WebSocket

## Architecture

### Service Layer Pattern

The application uses a clean separation of concerns:

```
BrowserMockup (UI Component)
    ↓
useBrowserController (Hook)
    ↓
BrowserDataSource (Interface)
    ↓
DemoDataSource | LiveDataSource (Implementations)
    +
BrowserEventsGateway (WebSocket)
```

### Core Components

- **BrowserDataSource**: Interface defining browser operations
- **DemoDataSource**: In-memory simulation for demo mode
- **LiveDataSource**: REST API client for real Chromium instances
- **BrowserEventsGateway**: WebSocket client with auto-reconnect
- **useBrowserController**: React hook for state management

## API Requirements

To connect your Chromium instance, implement the following API contract:

### REST Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/tabs` | Get all open tabs | - | `{ tabs: Tab[] }` |
| POST | `/tabs` | Create a new tab | `{ url: string }` | `{ tab: Tab }` |
| DELETE | `/tabs/:id` | Close a tab | - | - |
| POST | `/tabs/:id/activate` | Switch to a tab | - | - |
| POST | `/navigate` | Navigate to URL | `{ url: string, tabId?: string }` | - |
| POST | `/tabs/:id/audio` | Toggle mute | `{ muted: boolean }` | - |
| GET | `/health` | Health check | - | `{ status: string }` |

### Tab Object Structure

```typescript
{
  id: string;
  title: string;
  url: string;
  icon: string;  // Emoji or favicon URL
  isActive: boolean;
  hasAudio?: boolean;
  isMuted?: boolean;
}
```

### WebSocket Events

The WebSocket should send events in the following format:

```typescript
{
  type: 'tabCreated' | 'tab:created',
  payload: Tab
}

{
  type: 'tabClosed' | 'tab:closed',
  payload: { tabId: string }
}

{
  type: 'tabSwitched' | 'tab:switched',
  payload: { tabId: string }
}

{
  type: 'navigationChanged' | 'navigation:changed',
  payload: { tabId: string, url: string, title?: string }
}

{
  type: 'audioChanged' | 'audio:changed',
  payload: { tabId: string, muted: boolean }
}

{
  type: 'tabsUpdated' | 'tabs:updated',
  payload: { tabs: Tab[] }
}
```

## Configuration

### Using Demo Mode

Navigate to the browser demo page and ensure "Demo Mode" is selected. This requires no configuration and works out of the box.

### Using Live Mode

1. Navigate to the browser demo page
2. Switch to "Live Mode"
3. Click the settings icon to configure:
   - **API URL**: Your Chromium REST endpoint (e.g., `http://localhost:9222`)
   - **WebSocket URL**: Your Chromium WebSocket endpoint (e.g., `ws://localhost:9223`)
4. The interface will automatically attempt to connect

### Connection Status

When in Live Mode, you'll see a connection status indicator:
- 🟢 **Connected** - Successfully connected to Chromium
- 🟡 **Connecting** - Attempting to establish connection
- 🔴 **Disconnected** - No connection (click Reconnect to retry)

## Features

### Tab Management
- Create new tabs
- Switch between tabs
- Close tabs
- Visual tab indicators

### Navigation
- Address bar input
- Navigate to URLs
- Refresh current page
- Loading indicators

### Audio Control
- Visual indicator for tabs with audio
- Mute/unmute individual tabs
- Audio state synchronization

### Real-time Updates
- Automatic WebSocket reconnection
- Live tab updates from Chromium
- Optimistic UI updates with fallback

## Implementation Example

### Basic Chromium API Server (Node.js + Express)

```javascript
const express = require('express');
const WebSocket = require('ws');
const { chromium } = require('playwright'); // or puppeteer

const app = express();
const wss = new WebSocket.Server({ port: 9223 });

let browser;
let tabs = [];

// Initialize browser
async function init() {
  browser = await chromium.launch({ headless: false });
}

// REST API
app.get('/tabs', (req, res) => {
  res.json({ tabs });
});

app.post('/tabs', async (req, res) => {
  const { url } = req.body;
  const page = await browser.newPage();
  await page.goto(url || 'about:blank');
  
  const tab = {
    id: page.url(),
    title: await page.title(),
    url: page.url(),
    icon: '🌐',
    isActive: true
  };
  
  tabs.push(tab);
  broadcast({ type: 'tabCreated', payload: tab });
  res.json({ tab });
});

// WebSocket
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

app.listen(9222, () => console.log('API server running on port 9222'));
init();
```

## Troubleshooting

### Connection Fails
- Verify your Chromium API is running
- Check firewall/network settings
- Ensure API URL and WebSocket URL are correct
- Check browser console for detailed error messages

### Tabs Not Updating
- Verify WebSocket connection is established
- Check that your Chromium API is broadcasting events
- Try clicking the Reconnect button

### Health Check Fails
- Ensure `/health` endpoint is implemented
- Verify API is accessible from the browser
- Check for CORS issues

## Security Considerations

- Use HTTPS/WSS in production
- Implement authentication for your Chromium API
- Validate all incoming requests
- Sanitize user input (especially URLs)
- Consider rate limiting

## Performance

- Health checks run every 10 seconds
- WebSocket reconnection uses exponential backoff (max 10 attempts)
- Optimistic UI updates for better perceived performance
- Proper cleanup prevents memory leaks

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest with WebSocket support)
- Mobile browsers (with limitations on WebSocket stability)

## Support

For questions or issues with the integration, please refer to the main README or check the implementation in:
- `src/hooks/useBrowserController.ts` - Main integration logic
- `src/services/LiveDataSource.ts` - REST API client
- `src/services/BrowserEventsGateway.ts` - WebSocket client
