import type { BrowserEvent } from '../types/browser';

type EventCallback = (event: BrowserEvent) => void;

export class BrowserEventsGateway {
  private ws: WebSocket | null = null;
  private wsUrl: string;
  private callbacks: Set<EventCallback> = new Set();
  private reconnectTimeout: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private baseReconnectDelay = 1000;
  private isIntentionallyClosed = false;

  constructor(wsUrl: string) {
    this.wsUrl = wsUrl;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    this.isIntentionallyClosed = false;

    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected to Chromium instance');
        this.reconnectAttempts = 0;
        this.notifyCallbacks({
          type: 'status:changed',
          payload: { status: 'connected' },
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleServerEvent(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.notifyCallbacks({
          type: 'status:changed',
          payload: { status: 'disconnected' },
        });
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.ws = null;
        
        this.notifyCallbacks({
          type: 'status:changed',
          payload: { status: 'disconnected' },
        });

        if (!this.isIntentionallyClosed) {
          this.scheduleReconnect();
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.scheduleReconnect();
    }
  }

  disconnect() {
    this.isIntentionallyClosed = true;
    
    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.reconnectAttempts = 0;
  }

  subscribe(callback: EventCallback) {
    this.callbacks.add(callback);
    
    return () => {
      this.callbacks.delete(callback);
    };
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts),
      30000
    );

    this.reconnectAttempts++;
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimeout = window.setTimeout(() => {
      this.connect();
    }, delay);
  }

  private handleServerEvent(data: any) {
    const eventType = data.type || data.event;

    switch (eventType) {
      case 'tabCreated':
      case 'tab:created':
        this.notifyCallbacks({
          type: 'tab:created',
          payload: data.payload || data.tab,
        });
        break;

      case 'tabClosed':
      case 'tab:closed':
        this.notifyCallbacks({
          type: 'tab:closed',
          payload: { tabId: data.payload?.tabId || data.tabId },
        });
        break;

      case 'tabSwitched':
      case 'tab:switched':
        this.notifyCallbacks({
          type: 'tab:switched',
          payload: { tabId: data.payload?.tabId || data.tabId },
        });
        break;

      case 'navigationChanged':
      case 'navigation:changed':
        this.notifyCallbacks({
          type: 'navigation:changed',
          payload: {
            tabId: data.payload?.tabId || data.tabId,
            url: data.payload?.url || data.url,
            title: data.payload?.title || data.title,
          },
        });
        break;

      case 'audioChanged':
      case 'audio:changed':
        this.notifyCallbacks({
          type: 'audio:changed',
          payload: {
            tabId: data.payload?.tabId || data.tabId,
            muted: data.payload?.muted || data.muted,
          },
        });
        break;

      case 'tabsUpdated':
      case 'tabs:updated':
        this.notifyCallbacks({
          type: 'tabs:updated',
          payload: data.payload?.tabs || data.tabs || [],
        });
        break;

      default:
        console.warn('Unknown WebSocket event type:', eventType);
    }
  }

  private notifyCallbacks(event: BrowserEvent) {
    this.callbacks.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in event callback:', error);
      }
    });
  }
}
