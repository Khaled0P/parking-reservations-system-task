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
  occupied: number;                // server computed
  free: number;                    // server computed
  reserved: number;                // server computed
  availableForVisitors: number;    // server computed
  availableForSubscribers: number; // server computed
  rateNormal: number;
  rateSpecial: number;
  open: boolean;
}

// Ticket Types
export type TicketType = "visitor" | "subscriber";

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
  rateMode: "normal" | "special";
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
