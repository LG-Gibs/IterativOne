import { createContext, useContext, ReactNode } from 'react';
import { useBrowserController } from '../hooks/useBrowserController';
import type { Tab, ConnectionStatus } from '../types/browser';

interface BrowserContextType {
  tabs: Tab[];
  addressBar: string;
  isLoading: boolean;
  connectionStatus: ConnectionStatus;
  activeTab?: Tab;
  createTab: (url?: string) => Promise<void>;
  closeTab: (tabId: string) => Promise<void>;
  switchTab: (tabId: string) => Promise<void>;
  navigate: (url: string) => Promise<void>;
  toggleMute: (tabId: string, muted: boolean) => Promise<void>;
  reconnect: () => Promise<void>;
  mode: 'demo' | 'live' | 'agent-integrated';
}

const BrowserContext = createContext<BrowserContextType | undefined>(undefined);

interface BrowserProviderProps {
  children: ReactNode;
  mode?: 'demo' | 'live' | 'agent-integrated';
  apiUrl?: string;
  wsUrl?: string;
  enableAgentBackend?: boolean;
}

export function BrowserProvider({
  children,
  mode = 'demo',
  apiUrl,
  wsUrl,
  enableAgentBackend = true,
}: BrowserProviderProps) {
  const controller = useBrowserController({
    mode,
    apiUrl,
    wsUrl,
    enableAgentBackend,
  });

  const value: BrowserContextType = {
    tabs: controller.tabs,
    addressBar: controller.addressBar,
    isLoading: controller.isLoading,
    connectionStatus: controller.connectionStatus,
    activeTab: controller.activeTab,
    createTab: controller.createTab,
    closeTab: controller.closeTab,
    switchTab: controller.switchTab,
    navigate: controller.navigate,
    toggleMute: controller.toggleMute,
    reconnect: controller.reconnect,
    mode: controller.mode as 'demo' | 'live' | 'agent-integrated',
  };

  return (
    <BrowserContext.Provider value={value}>
      {children}
    </BrowserContext.Provider>
  );
}

export function useBrowser() {
  const context = useContext(BrowserContext);
  if (context === undefined) {
    throw new Error('useBrowser must be used within a BrowserProvider');
  }
  return context;
}
