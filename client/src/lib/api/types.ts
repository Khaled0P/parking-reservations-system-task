// Master Data Types
export interface Gate {
  id: string;
  name: string;
  zoneIds: string[];
  location: string;
}

export interface Zone {
  id: string;
  name: string;
  categoryId: string;
  gateIds: string[];
  totalSlots: number;
  occupied: number; // server computed
  free: number; // server computed
  reserved: number; // server computed
  availableForVisitors: number; // server computed
  availableForSubscribers: number; // server computed
  rateNormal: number;
  rateSpecial: number;
  open: boolean;
}

// Ticket Types
export type TicketType = 'visitor' | 'subscriber';

export interface Ticket {
  id: string;
  type: TicketType;
  zoneId: string;
  gateId: string;
  checkinAt: string;
  checkoutAt?: string;
  subscriptionId?: string; // for subscriber tickets
}

// Response after check-in
export interface CheckinResponse {
  ticket: Ticket;
  zoneState: Zone;
}

// Response after checkout
export interface CheckoutBreakdown {
  from: string;
  to: string;
  hours: number;
  rateMode: 'normal' | 'special';
  rate: number;
  amount: number;
}

export interface CheckoutResponse {
  ticketId: string;
  checkinAt: string;
  checkoutAt: string;
  durationHours: number;
  breakdown: CheckoutBreakdown[];
  amount: number;
  zoneState: Zone;
}

// WebSocket types
export interface AdminUpdatePayload {
  adminId: string;
  action:
    | 'category-rates-changed'
    | 'zone-closed'
    | 'zone-opened'
    | 'vacation-added'
    | 'rush-updated';
  targetType: 'category' | 'zone' | 'vacation' | 'rush';
  targetId: string;
  details?: Record<string, unknown>;
  timestamp: string; // ISO
}

export type WSMessage =
  | { type: 'zone-update'; payload: Zone }
  | { type: 'admin-update'; payload: AdminUpdatePayload }
  | { type: string; payload?: unknown }; // fallback

// subscriptions
export interface Car {
  plate: string;
  brand: string;
  model: string;
  color: string;
}

export interface Subscription {
  id: string;
  userName: string;
  active: boolean;
  category: string;
  cars: Car[];
  startsAt: string;
  expiresAt: string;
  currentCheckins: { ticketId: string; zoneId: string }[];
}
