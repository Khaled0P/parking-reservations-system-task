'use client';

import ZoneCard from './ZoneCard';
import { Button } from '@/components/ui/button';
import type { Zone, Subscription, Ticket } from '@/lib/api/types';
import { UseMutationResult } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

type SubscriberZonesProps = {
  zones: Zone[];
  gateId: string;
  subscription: Subscription;
  plateMismatch: boolean;
  checkinMutation: UseMutationResult<any, unknown, any>;
  onTicket: (ticket: Ticket) => void;
};

export default function SubscriberZones({
  zones,
  gateId,
  subscription,
  plateMismatch,
  checkinMutation,
  onTicket,
}: SubscriberZonesProps) {
  const { toast } = useToast();

  // zone check-in logic
  const handleCheckin = (zoneId: string, asVisitor = false) => {
    checkinMutation.mutate(
      asVisitor
        ? { gateId, zoneId, type: 'visitor' }
        : {
            gateId,
            zoneId,
            type: 'subscriber',
            subscriptionId: subscription.id,
          },
      {
        onSuccess: (data) => {
          onTicket(data.ticket);
          toast({
            title: asVisitor
              ? 'Converted to Visitor check-in'
              : 'Subscriber check-in successful',
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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {zones.map((zone) => {
        const allowed = subscription.category === zone.categoryId;
        const isMismatch = !!plateMismatch;
        const isInactive = !subscription.active;
        const disabled =
          !zone.open ||
          !allowed ||
          zone.availableForSubscribers <= 0 ||
          checkinMutation.isPending ||
          isMismatch ||
          isInactive;

        return (
          <div key={zone.id} className="space-y-2">
            <ZoneCard
              zone={zone}
              mode="subscriber"
              disabled={disabled}
              loading={checkinMutation.isPending}
              extraMessage={
                !allowed
                  ? "Subscription category doesn't match this zone."
                  : undefined
              }
              onCheckin={() => handleCheckin(zone.id)}
            />

            {/* Check in as visitor when subscription check-in unavailable */}
            {(isMismatch || isInactive || disabled) && (
              <Button
                variant="secondary"
                className="w-full"
                disabled={checkinMutation.isPending}
                onClick={() => handleCheckin(zone.id, true)}
              >
                {checkinMutation.isPending
                  ? 'Processing...'
                  : 'Check-in as visitor'}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
