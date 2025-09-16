'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ZoneCard from './ZoneCard';
import { useSubscription } from '@/lib/api/subscriptions';
import type { Zone, Ticket, Subscription } from '@/lib/api/types';
import { UseMutationResult } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

type SubscriberTabProps = {
  zones: Zone[];
  gateId: string;
  checkinMutation: UseMutationResult<any, unknown, any>;
  onTicket: (ticket: Ticket) => void;
};

export default function SubscriberTab({
  zones,
  gateId,
  checkinMutation,
  onTicket,
}: SubscriberTabProps) {
  const [subscriptionId, setSubscriptionId] = useState('');
  const {
    data: subscription,
    refetch,
    isFetching,
    isError,
    error,
  } = useSubscription(subscriptionId);
  const { toast } = useToast();

  const getErrorMessage = (err: unknown) => {
    if (!err) return 'Subscription not found';
    const anyErr = err as any;
    if (anyErr?.response?.data?.message)
      return String(anyErr.response.data.message);
    if (anyErr?.message) return String(anyErr.message);
    return 'Subscription not found';
  };

  const handleSubscriberCheckin = (zoneId: string, sub: Subscription) => {
    checkinMutation.mutate(
      { gateId, zoneId, type: 'subscriber', subscriptionId: sub.id },
      {
        onSuccess: (data) => {
          onTicket(data.ticket);
          toast({
            title: 'Subscriber check-in successful',
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

  return (
    <div className="mt-4 space-y-4">
      {/* Subscription ID input */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Subscription ID"
            value={subscriptionId}
            onChange={(e) => setSubscriptionId(e.target.value.trim())}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && subscriptionId) refetch();
            }}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            onClick={() => subscriptionId && refetch()}
            disabled={!subscriptionId || isFetching}
          >
            {isFetching ? 'Checking...' : 'Verify'}
          </Button>
        </div>

        {isError && (
          <p className="text-sm text-red-600 mt-1">
            {getErrorMessage(error)}
          </p>
        )}
        {subscription && !subscription.active && (
          <p className="text-sm text-yellow-700 mt-1">
            This subscription is <strong>inactive</strong>.
          </p>
        )}
      </div>

      {/* Subscription details */}
      {subscription && (
        <div className="p-4 border rounded-md bg-gray-50 space-y-3 text-sm">
          <p>
            <strong>Subscriber:</strong> {subscription.userName} (
            {subscription.id})
          </p>
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
        </div>
      )}

      {/* Zones (only when subscription active) */}
      {subscription && subscription.active && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone) => {
            const allowed = subscription.category === zone.categoryId;
            const disabled =
              !zone.open ||
              !allowed ||
              zone.availableForSubscribers <= 0 ||
              checkinMutation.isPending;

            return (
              <ZoneCard
                key={zone.id}
                zone={zone}
                mode="subscriber"
                disabled={disabled}
                loading={checkinMutation.isPending}
                extraMessage={
                  !allowed
                    ? "Subscription category doesn't match this zone."
                    : undefined
                }
                onCheckin={() => handleSubscriberCheckin(zone.id, subscription)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
