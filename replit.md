# IterativOne Browser Landing Page

## Overview
A modern, production-ready browser landing page inspired by Opera One, completely reimagined as "IterativOne". This project features smooth parallax scrolling, responsive design, and elegant animations.

## Project Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **Build Tool**: Vite 5.x

## Technology Stack
- React 18 with hooks
- TypeScript for type safety
- Tailwind CSS for styling
- Vite for fast development and optimized builds
- Lucide React for consistent iconography

## Project Structure
```
src/
├── components/
│   ├── Navigation.tsx      # Sticky navigation with mobile menu
│   ├── Hero.tsx            # Hero section with parallax effects
│   ├── FeatureSection.tsx  # Reusable feature showcase component
│   └── Footer.tsx          # Comprehensive footer with links
├── App.tsx                 # Main application component
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
