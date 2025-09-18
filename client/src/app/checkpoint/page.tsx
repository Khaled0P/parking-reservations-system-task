'use client';

import { useState } from 'react';
import { useTicket } from '@/lib/api/tickets';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TicketDetailsModal from '@/components/checkpoint/TicketDetailsModal';

 export default function CheckpointPage() {
  const [ticketIdInput, setTicketIdInput] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const ticketQuery = useTicket(selectedTicketId ?? '', {
    enabled: !!selectedTicketId,
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkpoint Checkout</h1>

      {/* Ticket input */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Enter or scan ticket ID"
          value={ticketIdInput}
          onChange={(e) => setTicketIdInput(e.target.value)}
        />
        <Button
          onClick={() => setSelectedTicketId(ticketIdInput)}
          disabled={!ticketIdInput}
        >
          Load Ticket
        </Button>
      </div>

      {/* Modal for ticket details */}
      <TicketDetailsModal
        open={!!ticketQuery.data}
        onClose={() => setSelectedTicketId(null)}
        ticket={ticketQuery.data ?? null}
      />
    </div>
  );
}