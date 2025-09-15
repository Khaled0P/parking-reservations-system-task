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
import { useSubscription } from '@/lib/api/subscriptions';

export default function GatePage() {
  const { gateId } = useParams<{ gateId: string }>();

  // fetch gates (for header)
  const { data: gates } = useGates();
  const gate = gates?.find((g) => g.id === gateId);

  // fetch zones for this gate
  const { data: zones, isLoading, error } = useZones(gateId);

  // fetch subscriptions
  const [subscriptionId, setSubscriptionId] = useState('');
  const {
    data: subscription,
    refetch: refetchSubscription,
    isFetching: isSubFetching,
    isError: isSubError,
    error: subscriptionError,
  } = useSubscription(subscriptionId);

  // to show a message for different error shapes (WILL BE RELOCATED TO INSIDE API)
  const getErrorMessage = (err: unknown) => {
    if (!err) return 'Subscription not found';
    const anyErr = err as any;
    if (anyErr?.response?.data?.message)
      return String(anyErr.response.data.message);
    if (anyErr?.message) return String(anyErr.message);
    return 'Subscription not found';
  };

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

        {/* Subscriber tab */}
        <TabsContent value="subscriber">
          <div className="mt-4 space-y-4">
            {/* Subscription ID input + Verify */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Subscription ID"
                  value={subscriptionId}
                  onChange={(e) => setSubscriptionId(e.target.value.trim())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && subscriptionId)
                      refetchSubscription();
                  }}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <Button
                  onClick={() => subscriptionId && refetchSubscription()}
                  disabled={!subscriptionId || isSubFetching}
                >
                  {isSubFetching ? 'Checking...' : 'Verify'}
                </Button>
              </div>

              {/* Inline validation/error message */}
              <div>
                {isSubError && (
                  <p className="text-sm text-red-600 mt-1">
                    {getErrorMessage(subscriptionError)}
                  </p>
                )}
                {/* If subscription exists but is inactive, show an inline note (not an "error") */}
                {subscription && !subscription.active && (
                  <p className="text-sm text-yellow-700 mt-1">
                    This subscription is <strong>inactive</strong>. Check
                    validity or contact admin.
                  </p>
                )}
              </div>
            </div>

            {/* Subscription details */}
            {subscription && (
              <div className="p-4 border rounded-md bg-gray-50 space-y-3 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p>
                      <strong>Subscriber:</strong> {subscription.userName}
                    </p>
                    <p className="text-xs text-gray-500">
                      ID: {subscription.id}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      subscription.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {subscription.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p>
                  <strong>Category:</strong> {subscription.category}
                </p>
                <p>
                  <strong>Valid:</strong>{' '}
                  {new Date(subscription.startsAt).toLocaleDateString()} →{' '}
                  {new Date(subscription.expiresAt).toLocaleDateString()}
                </p>

                <div>
                  <strong>Cars:</strong>
                  <ul className="mt-2 space-y-2">
                    {subscription.cars.map((car, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between rounded border bg-white px-3 py-2"
                      >
                        <div>
                          <div className="text-sm font-medium">{car.plate}</div>
                          <div className="text-xs text-gray-500">
                            {car.brand} {car.model} • {car.color}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {subscription.currentCheckins &&
                  subscription.currentCheckins.length > 0 && (
                    <div>
                      <strong>Active Check-ins:</strong>
                      <ul className="mt-2 space-y-1 text-xs">
                        {subscription.currentCheckins.map((ci, idx) => (
                          <li
                            key={idx}
                            className="rounded border bg-white px-3 py-2"
                          >
                            Ticket: <strong>{ci.ticketId}</strong> — Zone:{' '}
                            <strong>{ci.zoneId}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}

            {/* Zones available for this subscription (only when subscription is active) */}
            {subscription && subscription.active && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {zones?.map((zone) => {
                  const allowed = subscription.category === zone.categoryId;
                  const disabled =
                    !zone.open ||
                    !allowed ||
                    zone.availableForSubscribers <= 0 ||
                    checkinMutation.isPending;

                  return (
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
                          Subscribers Available: {zone.availableForSubscribers}
                        </p>

                        {!allowed && (
                          <p className="text-xs text-red-600 mt-2">
                            Subscription category doesn't match this zone.
                          </p>
                        )}

                        <Button
                          className="mt-3 w-full"
                          disabled={disabled}
                          onClick={() => {
                            // guard: prevent click if disabled (extra safety)
                            if (disabled) return;

                            checkinMutation.mutate(
                              {
                                gateId: gateId,
                                zoneId: zone.id,
                                type: 'subscriber',
                                subscriptionId: subscription.id,
                              },
                              {
                                onSuccess: (data) => {
                                  setSelectedTicket(data.ticket);
                                  setModalOpen(true);
                                  toast({
                                    title: 'Subscriber check-in successful',
                                    description: (
                                      <span>
                                        Ticket <strong>{data.ticket.id}</strong>{' '}
                                        created for Zone{' '}
                                        <strong>{data.ticket.zoneId}</strong>
                                      </span>
                                    ),
                                  });
                                },
                                onError: (err: any) => {
                                  toast({
                                    title: 'Check-in failed',
                                    description:
                                      err?.response?.data?.message ||
                                      'Something went wrong',
                                    variant: 'destructive',
                                  });
                                },
                              }
                            );
                          }}
                        >
                          {checkinMutation.isPending
                            ? 'Checking in...'
                            : 'Check-in'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
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
