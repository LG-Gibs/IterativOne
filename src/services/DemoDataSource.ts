import type {
  BrowserDataSource,
  Tab,
  TabCommand,
  NavigationCommand,
  AudioCommand,
  ConnectionStatus,
} from '../types/browser';

export class DemoDataSource implements BrowserDataSource {
  private tabs: Tab[] = [
    {
      id: '1',
      title: 'IterativOne - Home',
      url: 'iterativone.com',
      icon: '🏠',
      isActive: true,
    },
    {
      id: '2',
      title: 'YouTube Music',
      url: 'music.youtube.com',
      icon: '🎵',
      isActive: false,
      hasAudio: true,
      isMuted: false,
    },
    {
      id: '3',
      title: 'Gmail',
      url: 'mail.google.com',
      icon: '📧',
      isActive: false,
    },
  ];

  async fetchTabs(): Promise<Tab[]> {
    await this.simulateDelay(100);
    return [...this.tabs];
  }

  async createTab(command: TabCommand): Promise<Tab> {
    await this.simulateDelay(200);
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: command.url || 'iterativone.com/newtab',
      icon: '✨',
      isActive: true,
    };

    this.tabs = this.tabs.map((tab) => ({ ...tab, isActive: false }));
    this.tabs.push(newTab);

    return newTab;
  }

  async closeTab(tabId: string): Promise<void> {
    await this.simulateDelay(100);
    const tabIndex = this.tabs.findIndex((tab) => tab.id === tabId);
    
    if (tabIndex === -1) return;

    const wasActive = this.tabs[tabIndex].isActive;
    this.tabs.splice(tabIndex, 1);

    if (wasActive && this.tabs.length > 0) {
      this.tabs[0].isActive = true;
    }
  }

  async switchTab(tabId: string): Promise<void> {
    await this.simulateDelay(50);
    this.tabs = this.tabs.map((tab) => ({
      ...tab,
      isActive: tab.id === tabId,
    }));
  }

  async navigate(command: NavigationCommand): Promise<void> {
    await this.simulateDelay(300);
    const activeTab = this.tabs.find((tab) => tab.isActive);
    
    if (activeTab) {
      activeTab.url = command.url;
      try {
        const hostname = new URL(command.url.startsWith('http') ? command.url : `https://${command.url}`).hostname;
        activeTab.title = hostname;
      } catch {
        activeTab.title = command.url;
      }
    }
  }

  async toggleMute(command: AudioCommand): Promise<void> {
    await this.simulateDelay(50);
    const tab = this.tabs.find((tab) => tab.id === command.tabId);
    if (tab) {
      tab.isMuted = command.muted;
    }
  }

  getConnectionStatus(): ConnectionStatus {
    return 'connected';
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
