'use client';

import { useParams } from 'next/navigation';
import { useGates } from '@/lib/api/gates';
import { useZones } from '@/lib/api/zones';
import { useCheckin } from '@/lib/api/tickets';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TicketModal from '@/components/gate/TicketModal';
import { useEffect, useState } from 'react';
import { Ticket } from '@/lib/api/types';
import { wsClient } from '@/lib/ws';
import WsStatus from '@/components/gate/WsStatus';
import VisitorTab from '@/components/gate/VisitorTab';
import SubscriberTab from '@/components/gate/SubscriberTab';

export default function GatePage() {
  const { gateId } = useParams<{ gateId: string }>();

  const { data: gates } = useGates();
  const gate = gates?.find((g) => g.id === gateId);

  const { data: zones, isLoading, error } = useZones(gateId);

  const checkinMutation = useCheckin();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!gateId) return;
    wsClient.subscribeGate(gateId);
    return () => {
      wsClient.unsubscribeGate(gateId);
    };
  }, [gateId]);

  if (isLoading) return <p className="p-6">Loading zones...</p>;
  if (error) return <p className="p-6 text-red-500">Failed to load zones</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{gate?.name || 'Gate'}</h1>
        <span className="text-sm text-gray-500">Gate ID: {gateId}</span>
        <WsStatus />
      </header>

      {/* Tabs */}
      <Tabs defaultValue="visitor">
        <TabsList>
          <TabsTrigger value="visitor">Visitor</TabsTrigger>
          <TabsTrigger value="subscriber">Subscriber</TabsTrigger>
        </TabsList>

        <TabsContent value="visitor">
          <VisitorTab
            zones={zones || []}
            gateId={gateId}
            checkinMutation={checkinMutation}
            onTicket={handleTicket}
          />
        </TabsContent>

        <TabsContent value="subscriber">
          <SubscriberTab
            zones={zones || []}
            gateId={gateId}
            onTicket={handleTicket}
          />
        </TabsContent>
      </Tabs>

      {/* Ticket Modal */}
      <TicketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        ticket={selectedTicket}
      />
    </div>
  );
}
