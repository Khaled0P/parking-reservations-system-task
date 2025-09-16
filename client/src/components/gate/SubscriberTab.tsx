'use client';

import { useState } from 'react';
import type { Zone, Ticket, Subscription } from '@/lib/api/types';
import { UseMutationResult } from '@tanstack/react-query';
import SubscriptionLookup from './SubscriptionLookup';
import SubscriptionDetails from './SubscriptionDetails';
import SubscriberZones from './SubscriberZones';

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
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plateInput, setPlateInput] = useState('');

  const plateMismatch =
    subscription &&
    plateInput &&
    !subscription.cars.some(
      (c) => c.plate.toLowerCase() === plateInput.toLowerCase()
    );

  return (
    <div className="mt-4 space-y-4">
      <SubscriptionLookup
        onResult={(sub) => setSubscription(sub)}
        setPlateInput={setPlateInput}
      />

      {subscription && (
        <>
          <SubscriptionDetails
            subscription={subscription}
            plateInput={plateInput}
            setPlateInput={setPlateInput}
            plateMismatch={!!plateMismatch}
          />
          <SubscriberZones
            zones={zones}
            gateId={gateId}
            subscription={subscription}
            plateMismatch={!!plateMismatch}
            checkinMutation={checkinMutation}
            onTicket={onTicket}
          />
        </>
      )}
    </div>
  );
}
