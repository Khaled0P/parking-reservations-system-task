'use client';

import { useParams } from 'next/navigation';
import { useGates } from '@/lib/api/gates';
import { useZones } from '@/lib/api/zones';
import { useCheckin } from '@/lib/api/tickets';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TicketModal from '@/components/gate/TicketModal';
import { useEffect, useState } from 'react';
import { Ticket } from '@/lib/api/types';
import { useToast } from '@/hooks/use-toast';
import { wsClient } from '@/lib/ws';
import WsStatus from '@/components/gate/WsStatus';

export default function GatePage() {
  const { gateId } = useParams<{ gateId: string }>();

  // fetch gates (for header)
  const { data: gates } = useGates();
  const gate = gates?.find((g) => g.id === gateId);

  // fetch zones for this gate
  const { data: zones, isLoading, error } = useZones(gateId);

  // visitor check-in
  const checkinMutation = useCheckin();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { toast } = useToast();

  const handleVisitorCheckin = (zoneId: string) => {
    checkinMutation.mutate(
      { gateId: gateId, zoneId, type: 'visitor' },
      {
        onSuccess: (data) => {
          setSelectedTicket(data.ticket);
          setModalOpen(true);
          toast({
            title: 'Check-in successful',
            description: (
              <span>
                Ticket <strong>{data.ticket.id}</strong> created for Zone{' '}
                <strong>{data.ticket.zoneId}</strong>
              </span>
            ),
          });
        },
        onError: (err: any) => {
          toast({
            title: 'Check-in failed',
            description: err?.response?.data?.message || 'Something went wrong',
            variant: 'destructive',
          });
        },
      }
    );
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

      {/* Tabs: Visitor vs Subscriber */}
      <Tabs defaultValue="visitor">
        <TabsList>
          <TabsTrigger value="visitor">Visitor</TabsTrigger>
          <TabsTrigger value="subscriber">Subscriber</TabsTrigger>
        </TabsList>

        {/* Visitor tab */}
        <TabsContent value="visitor">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {zones?.map((zone) => (
              <Card key={zone.id}>
                <CardHeader>
                  <CardTitle>{zone.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Category: {zone.categoryId}</p>
                  <p className="text-sm">Occupied: {zone.occupied}</p>
                  <p className="text-sm">Free: {zone.free}</p>
                  <p className="text-sm">Reserved: {zone.reserved}</p>
                  <p className="text-sm">
                    Visitors Available: {zone.availableForVisitors}
                  </p>
                  <p className="text-sm">
                    Subscribers Available: {zone.availableForSubscribers}
                  </p>
                  <p className="text-sm">
                    Rates: N {zone.rateNormal} / S {zone.rateSpecial}
                  </p>
                  <Button
                    className="mt-3 w-full"
                    disabled={
                      !zone.open ||
                      zone.availableForVisitors <= 0 ||
                      checkinMutation.isPending
                    }
                    onClick={() => handleVisitorCheckin(zone.id)}
                  >
                    {checkinMutation.isPending ? 'Checking in...' : 'Check-in'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Subscriber tab (to implement later) */}
        <TabsContent value="subscriber">
          <p>Subscriber flow coming soon...</p>
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
