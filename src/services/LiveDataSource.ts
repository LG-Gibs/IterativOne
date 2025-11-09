import type {
  BrowserDataSource,
  Tab,
  TabCommand,
  NavigationCommand,
  AudioCommand,
  ConnectionStatus,
} from '../types/browser';

export class LiveDataSource implements BrowserDataSource {
  private apiUrl: string;
  private connectionStatus: ConnectionStatus = 'disconnected';
  private healthCheckInterval: number | null = null;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl.replace(/\/$/, '');
    this.startHealthCheck();
  }

  private startHealthCheck() {
    this.healthCheckInterval = window.setInterval(async () => {
      try {
        const response = await fetch(`${this.apiUrl}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        });
        
        this.connectionStatus = response.ok ? 'connected' : 'disconnected';
      } catch {
        this.connectionStatus = 'disconnected';
      }
    }, 10000);
  }

  async fetchTabs(): Promise<Tab[]> {
    try {
      this.connectionStatus = 'connecting';
      const response = await fetch(`${this.apiUrl}/tabs`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tabs: ${response.status}`);
      }

      const data = await response.json();
      this.connectionStatus = 'connected';
      
      return this.normalizeTabs(data.tabs || data);
    } catch (error) {
      this.connectionStatus = 'disconnected';
      console.error('Error fetching tabs:', error);
      throw error;
    }
  }

  async createTab(command: TabCommand): Promise<Tab> {
    try {
      const response = await fetch(`${this.apiUrl}/tabs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: command.url || 'about:blank' }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create tab: ${response.status}`);
      }

      const data = await response.json();
      return this.normalizeTab(data.tab || data);
    } catch (error) {
      console.error('Error creating tab:', error);
      throw error;
    }
  }

  async closeTab(tabId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/tabs/${tabId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to close tab: ${response.status}`);
      }
    } catch (error) {
      console.error('Error closing tab:', error);
      throw error;
    }
  }

  async switchTab(tabId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/tabs/${tabId}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to switch tab: ${response.status}`);
      }
    } catch (error) {
      console.error('Error switching tab:', error);
      throw error;
    }
  }

  async navigate(command: NavigationCommand): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/navigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: command.url,
          tabId: command.tabId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to navigate: ${response.status}`);
      }
    } catch (error) {
      console.error('Error navigating:', error);
      throw error;
    }
  }

  async toggleMute(command: AudioCommand): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/tabs/${command.tabId}/audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ muted: command.muted }),
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle mute: ${response.status}`);
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
      throw error;
    }
  }

  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  cleanup() {
    if (this.healthCheckInterval !== null) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  private normalizeTab(rawTab: any): Tab {
    return {
      id: rawTab.id || rawTab.tabId || String(rawTab.index || 0),
      title: rawTab.title || 'Untitled',
      url: rawTab.url || 'about:blank',
      icon: rawTab.icon || rawTab.favIconUrl || '🌐',
      isActive: rawTab.isActive || rawTab.active || false,
      hasAudio: rawTab.hasAudio || rawTab.audible || false,
      isMuted: rawTab.isMuted || rawTab.mutedInfo?.muted || false,
    };
  }

  private normalizeTabs(rawTabs: any[]): Tab[] {
    return rawTabs.map((tab) => this.normalizeTab(tab));
  }
}
