'use client';

import ZoneCard from './ZoneCard';
import { Button } from '@/components/ui/button';
import type { Zone, Subscription, Ticket } from '@/lib/api/types';
import { useSubscriberCheckin } from '@/hooks/useSubscriberCheckin';

type SubscriberZonesProps = {
  zones: Zone[];
  gateId: string;
  subscription: Subscription;
  plateMismatch: boolean;
  onTicket: (ticket: Ticket) => void;
};

export default function SubscriberZones({
  zones,
  gateId,
  subscription,
  plateMismatch,
  onTicket,
}: SubscriberZonesProps) {
  const { handleCheckin, isPending } = useSubscriberCheckin({
    gateId,
    subscription,
    onTicket,
  });

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {zones.map((zone) => {
        const allowed = subscription.category === zone.categoryId;
        const isMismatch = plateMismatch;
        const isInactive = !subscription.active;
        const disabled =
          !zone.open ||
          !allowed ||
          zone.availableForSubscribers <= 0 ||
          isPending ||
          isMismatch ||
          isInactive;

        return (
          <div key={zone.id} className="space-y-2">
            <ZoneCard
              zone={zone}
              mode="subscriber"
              disabled={disabled}
              loading={isPending}
              extraMessage={
                !allowed
                  ? "Subscription category doesn't match this zone."
                  : undefined
              }
              onCheckin={() => handleCheckin(zone.id)}
            />

            {(isMismatch || isInactive || disabled) && (
              <Button
                variant="secondary"
                className="w-full"
                disabled={isPending}
                onClick={() => handleCheckin(zone.id, true)}
              >
                {isPending ? 'Processing...' : 'Check-in as visitor'}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
