export interface Tab {
  id: string;
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  hasAudio?: boolean;
  isMuted?: boolean;
}

export interface BrowserState {
  tabs: Tab[];
  addressBar: string;
  isLoading: boolean;
  connectionStatus: ConnectionStatus;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export interface NavigationCommand {
  url: string;
  tabId?: string;
}

export interface TabCommand {
  id?: string;
  url?: string;
}

export interface AudioCommand {
  tabId: string;
  muted: boolean;
}

export interface BrowserDataSource {
  fetchTabs(): Promise<Tab[]>;
  createTab(command: TabCommand): Promise<Tab>;
  closeTab(tabId: string): Promise<void>;
  switchTab(tabId: string): Promise<void>;
  navigate(command: NavigationCommand): Promise<void>;
  toggleMute(command: AudioCommand): Promise<void>;
  getConnectionStatus(): ConnectionStatus;
  cleanup?: () => void;
}

export type BrowserEvent =
  | { type: 'tabs:updated'; payload: Tab[] }
  | { type: 'tab:created'; payload: Tab }
  | { type: 'tab:closed'; payload: { tabId: string } }
  | { type: 'tab:switched'; payload: { tabId: string } }
  | { type: 'navigation:changed'; payload: { tabId: string; url: string; title?: string } }
  | { type: 'audio:changed'; payload: { tabId: string; muted: boolean } }
  | { type: 'status:changed'; payload: { status: ConnectionStatus } };
