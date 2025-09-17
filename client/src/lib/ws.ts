import type { QueryClient } from '@tanstack/react-query';
import type { Zone, AdminUpdatePayload, WSMessage } from '@/lib/api/types';

/**
 * WebSocket client wrapper:
 * - Single socket instance
 * - automatic reconnect with backoff
 * - subscribe/unsubscribe by gateId
 * - updates React Query cache for ["zones", gateId]
 * - allows registering an admin-update handler (for audit log)
 */

type AdminHandler = (payload: AdminUpdatePayload) => void;

class WSClient {
  private url: string;
  private socket: WebSocket | null = null;
  private connected = false;
  private queryClient: QueryClient | null = null;
  private subscriptions = new Set<string>(); // gateIds
  private pendingSends: string[] = [];
  private reconnectAttempts = 0;
  private adminHandler?: AdminHandler;
  private manualClose = false;
  private statusHandler?: (connected: boolean) => void;

  constructor(url = 'ws://localhost:4000/api/v1/ws') {
    this.url = url;
  }

  // expose status handler
  setStatusHandler(handler?: (connected: boolean) => void) {
    this.statusHandler = handler;
  }

  // Connect (must pass the app's QueryClient to allow cache updates)
  connect(queryClient: QueryClient) {
    this.queryClient = queryClient;

    // if already connected or connecting, do nothing
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    this.manualClose = false;
    this._open();
  }

  private _open() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.connected = true;

      this.statusHandler?.(true); // notify app

      this._flushPending();
      for (const gateId of Array.from(this.subscriptions)) {
        this._send({ type: 'subscribe', payload: { gateId } });
      }
    };

    this.socket.onclose = () => {
      this.connected = false;
      this.statusHandler?.(false); // notify app

      // dispatch reconnecting state
      try {
        const event = new CustomEvent('ws:reconnecting');
        window.dispatchEvent(event);
      } catch {}

      if (this.manualClose) return;
      const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30_000);
      this.reconnectAttempts += 1;
      setTimeout(() => {
        this._open();
      }, delay);
    };

    this.socket.onmessage = (event) => {
      try {
        const parsed: WSMessage = JSON.parse(event.data);
        this._handleMessage(parsed);
      } catch (e) {
        console.warn('ws: failed to parse message', e);
      }
    };

    this.socket.onerror = (err) => {
      console.warn('ws: error', err);
    };
  }

  // Close intentionally (manual)
  disconnect() {
    this.manualClose = true;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connected = false;
    }
  }

  // Subscribe to a gateId channel
  subscribeGate(gateId: string) {
    this.subscriptions.add(gateId);
    this._send({ type: 'subscribe', payload: { gateId } });
  }

  unsubscribeGate(gateId: string) {
    this.subscriptions.delete(gateId);
    this._send({ type: 'unsubscribe', payload: { gateId } });
  }

  // Allows admin pages to register a handler for admin-update events
  setAdminHandler(handler: AdminHandler | undefined) {
    this.adminHandler = handler;
  }

  // Internal: send JSON, queue if socket not open yet
  private _send(obj: unknown) {
    const str = JSON.stringify(obj);
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(str);
    } else {
      this.pendingSends.push(str);
    }
  }

  private _flushPending() {
    if (
      this.socket &&
      this.socket.readyState === WebSocket.OPEN &&
      this.pendingSends.length
    ) {
      for (const s of this.pendingSends.splice(0)) {
        this.socket.send(s);
      }
    }
  }

  // Message dispatcher
  private _handleMessage(msg: WSMessage) {
    if (!this.queryClient) return;

    if (msg.type === 'zone-update') {
      const zone = msg.payload as Zone;
      // Update all relevant zone queries (["zones", gateId]) for each gate the zone belongs to
      const gateIds =
        (zone as Partial<Zone> & { gateIds?: string[] }).gateIds || [];
      for (const gateId of gateIds) {
        const key = ['zones', gateId];
        this.queryClient.setQueryData<Zone[] | undefined>(key, (old) => {
          if (!old) {
            // no cached zones for this gate yet — safe to return old
            return old;
          }
          const found = old.find((z) => z.id === zone.id);
          if (found) {
            return old.map((z) => (z.id === zone.id ? zone : z));
          } else {
            return [...old, zone];
          }
        });
      }
      return;
    }

    if (msg.type === 'admin-update') {
      const payload = msg.payload as AdminUpdatePayload;
      // notify registered handler (for example, admin UI will dispatch this into redux)
      this.adminHandler?.(payload);
      return;
    }

    console.debug('ws: unknown msg type', msg.type); //log unknown message types to debug
  }
}

// singleton client
export const wsClient = new WSClient();
