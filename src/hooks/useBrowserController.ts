import { useEffect, useCallback, useReducer, useRef } from 'react';
import type {
  Tab,
  BrowserState,
  BrowserEvent,
  ConnectionStatus,
  BrowserDataSource,
} from '../types/browser';
import { DemoDataSource } from '../services/DemoDataSource';
import { LiveDataSource } from '../services/LiveDataSource';
import { BrowserEventsGateway } from '../services/BrowserEventsGateway';

type BrowserAction =
  | { type: 'SET_TABS'; payload: Tab[] }
  | { type: 'ADD_TAB'; payload: Tab }
  | { type: 'REMOVE_TAB'; payload: string }
  | { type: 'UPDATE_TAB'; payload: { id: string; updates: Partial<Tab> } }
  | { type: 'SET_ADDRESS_BAR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONNECTION_STATUS'; payload: ConnectionStatus }
  | { type: 'SWITCH_TAB'; payload: string };

function browserReducer(state: BrowserState, action: BrowserAction): BrowserState {
  switch (action.type) {
    case 'SET_TABS':
      return { ...state, tabs: action.payload };

    case 'ADD_TAB':
      return {
        ...state,
        tabs: [...state.tabs.map((t) => ({ ...t, isActive: false })), action.payload],
        addressBar: action.payload.url,
      };

    case 'REMOVE_TAB': {
      const newTabs = state.tabs.filter((tab) => tab.id !== action.payload);
      const removedTab = state.tabs.find((tab) => tab.id === action.payload);

      if (removedTab?.isActive && newTabs.length > 0) {
        newTabs[0].isActive = true;
        return {
          ...state,
          tabs: newTabs,
          addressBar: newTabs[0].url,
        };
      }

      return { ...state, tabs: newTabs };
    }

    case 'UPDATE_TAB':
      return {
        ...state,
        tabs: state.tabs.map((tab) =>
          tab.id === action.payload.id ? { ...tab, ...action.payload.updates } : tab
        ),
      };

    case 'SET_ADDRESS_BAR':
      return { ...state, addressBar: action.payload };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };

    case 'SWITCH_TAB':
      return {
        ...state,
        tabs: state.tabs.map((tab) => ({ ...tab, isActive: tab.id === action.payload })),
        addressBar: state.tabs.find((tab) => tab.id === action.payload)?.url || state.addressBar,
      };

    default:
      return state;
  }
}

interface UseBrowserControllerOptions {
  mode?: 'demo' | 'live';
  apiUrl?: string;
  wsUrl?: string;
}

export function useBrowserController(options: UseBrowserControllerOptions = {}) {
  const { mode = 'demo', apiUrl, wsUrl } = options;

  const [state, dispatch] = useReducer(browserReducer, {
    tabs: [],
    addressBar: '',
    isLoading: false,
    connectionStatus: mode === 'demo' ? 'connected' : 'disconnected',
  });

  const dataSourceRef = useRef<BrowserDataSource | null>(null);
  const eventsGatewayRef = useRef<BrowserEventsGateway | null>(null);

  useEffect(() => {
    if (mode === 'demo') {
      dataSourceRef.current = new DemoDataSource();
    } else if (mode === 'live' && apiUrl) {
      dataSourceRef.current = new LiveDataSource(apiUrl);
    }

    if (mode === 'live' && wsUrl) {
      eventsGatewayRef.current = new BrowserEventsGateway(wsUrl);
      eventsGatewayRef.current.connect();

      const unsubscribe = eventsGatewayRef.current.subscribe(handleBrowserEvent);

      return () => {
        unsubscribe();
        eventsGatewayRef.current?.disconnect();
        eventsGatewayRef.current = null;
      };
    }

    return () => {
      dataSourceRef.current?.cleanup?.();
      dataSourceRef.current = null;
    };
  }, [mode, apiUrl, wsUrl]);

  useEffect(() => {
    loadInitialTabs();
  }, [mode, apiUrl]);

  const handleBrowserEvent = useCallback((event: BrowserEvent) => {
    switch (event.type) {
      case 'tabs:updated':
        dispatch({ type: 'SET_TABS', payload: event.payload });
        break;

      case 'tab:created':
        dispatch({ type: 'ADD_TAB', payload: event.payload });
        break;

      case 'tab:closed':
        dispatch({ type: 'REMOVE_TAB', payload: event.payload.tabId });
        break;

      case 'tab:switched':
        dispatch({ type: 'SWITCH_TAB', payload: event.payload.tabId });
        break;

      case 'navigation:changed':
        dispatch({
          type: 'UPDATE_TAB',
          payload: {
            id: event.payload.tabId,
            updates: {
              url: event.payload.url,
              ...(event.payload.title && { title: event.payload.title }),
            },
          },
        });
        break;

      case 'audio:changed':
        dispatch({
          type: 'UPDATE_TAB',
          payload: {
            id: event.payload.tabId,
            updates: { isMuted: event.payload.muted },
          },
        });
        break;

      case 'status:changed':
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: event.payload.status });
        break;
    }
  }, []);

  const loadInitialTabs = async () => {
    if (!dataSourceRef.current) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const tabs = await dataSourceRef.current.fetchTabs();
      dispatch({ type: 'SET_TABS', payload: tabs });

      const activeTab = tabs.find((tab) => tab.isActive);
      if (activeTab) {
        dispatch({ type: 'SET_ADDRESS_BAR', payload: activeTab.url });
      }

      const status = dataSourceRef.current.getConnectionStatus();
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: status });
    } catch (error) {
      console.error('Failed to load initial tabs:', error);
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createTab = async (url?: string) => {
    if (!dataSourceRef.current) return;

    try {
      const newTab = await dataSourceRef.current.createTab({ url });
      
      if (mode === 'demo') {
        dispatch({ type: 'ADD_TAB', payload: newTab });
      }
    } catch (error) {
      console.error('Failed to create tab:', error);
    }
  };

  const closeTab = async (tabId: string) => {
    if (!dataSourceRef.current) return;

    try {
      await dataSourceRef.current.closeTab(tabId);
      
      if (mode === 'demo') {
        dispatch({ type: 'REMOVE_TAB', payload: tabId });
      }
    } catch (error) {
      console.error('Failed to close tab:', error);
    }
  };

  const switchTab = async (tabId: string) => {
    if (!dataSourceRef.current) return;

    try {
      await dataSourceRef.current.switchTab(tabId);
      
      if (mode === 'demo') {
        dispatch({ type: 'SWITCH_TAB', payload: tabId });
      }
    } catch (error) {
      console.error('Failed to switch tab:', error);
    }
  };

  const navigate = async (url: string) => {
    if (!dataSourceRef.current) return;

    const activeTab = state.tabs.find((tab) => tab.isActive);
    if (!activeTab) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ADDRESS_BAR', payload: url });

      await dataSourceRef.current.navigate({ url, tabId: activeTab.id });

      if (mode === 'demo') {
        dispatch({
          type: 'UPDATE_TAB',
          payload: {
            id: activeTab.id,
            updates: { url, title: 'Loading...' },
          },
        });

        setTimeout(() => {
          try {
            const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
            dispatch({
              type: 'UPDATE_TAB',
              payload: {
                id: activeTab.id,
                updates: { title: hostname },
              },
            });
          } catch {
            dispatch({
              type: 'UPDATE_TAB',
              payload: {
                id: activeTab.id,
                updates: { title: url },
              },
            });
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to navigate:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const toggleMute = async (tabId: string, muted: boolean) => {
    if (!dataSourceRef.current) return;

    try {
      await dataSourceRef.current.toggleMute({ tabId, muted });

      if (mode === 'demo') {
        dispatch({
          type: 'UPDATE_TAB',
          payload: { id: tabId, updates: { isMuted: muted } },
        });
      }
    } catch (error) {
      console.error('Failed to toggle mute:', error);
    }
  };

  const reconnect = async () => {
    if (mode === 'live') {
      eventsGatewayRef.current?.disconnect();
      eventsGatewayRef.current?.connect();
      await loadInitialTabs();
    }
  };

  return {
    ...state,
    activeTab: state.tabs.find((tab) => tab.isActive),
    createTab,
    closeTab,
    switchTab,
    navigate,
    toggleMute,
    reconnect,
    mode,
  };
}
