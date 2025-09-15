'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ticket } from '@/lib/api/types';

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

export default function TicketModal({
  open,
  onClose,
  ticket,
}: TicketModalProps) {
  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ticket Issued</DialogTitle>
          <DialogDescription>
            Print or save this ticket for reference
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <p>
            <strong>ID:</strong> {ticket.id}
          </p>
          <p>
            <strong>Type:</strong> {ticket.type}
          </p>
          <p>
            <strong>Gate:</strong> {ticket.gateId}
          </p>
          <p>
            <strong>Zone:</strong> {ticket.zoneId}
          </p>
          <p>
            <strong>Check-in Time:</strong>{' '}
            {new Date(ticket.checkinAt).toLocaleString()}
          </p>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
          <Button
            variant="outline"
            onClick={() => {
              window.open(`/print/${ticket.id}`, '_blank');
            }}
          >
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
