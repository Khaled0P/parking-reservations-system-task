'use client';

import { useState } from 'react';
import type { Zone, Ticket } from '@/lib/api/types';
import SubscriberZones from './SubscriberZones';
import { useSubscription } from '@/lib/api/subscriptions';
import { Button } from '@/components/ui/button';
import { isPlateMismatch } from '@/lib/utils';

type SubscriberTabProps = {
  zones: Zone[];
  gateId: string;
  onTicket: (ticket: Ticket) => void;
};


export default function SubscriberTab({
  zones,
  gateId,
  onTicket,
}: SubscriberTabProps) {
  const [plateInput, setPlateInput] = useState('');
  const [inputId, setInputId] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const {
    data: subscription,
    isFetching,
    errorMessage,
  } = useSubscription(submittedId);

  const plateMismatch = isPlateMismatch(subscription ?? null, plateInput);

  return (
    <div className="mt-4 space-y-4">
      {/* -------------- Subscriber Search -------------- */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Subscription ID"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && setSubmittedId(inputId.trim())
            }
            className="flex-1 text-white rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            onClick={() => setSubmittedId(inputId.trim())}
            disabled={isFetching}
          >
            {isFetching ? 'Checking...' : 'Verify'}
          </Button>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
        )}
        {subscription && !subscription.active && (
          <p className="text-sm text-yellow-700 mt-1">
            This subscription is <strong>inactive</strong>.
          </p>
        )}
      </div>

      {/* ----------------- Subscription Details ------------------ */}
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

          {/*-------------- Plate validation input -----------*/}
          <div className="mt-3 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Enter Car Plate"
              value={plateInput}
              onChange={(e) => setPlateInput(e.target.value)}
              className="text-white rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {plateMismatch && (
              <p className="text-sm text-red-600">
                Entered plate does not match subscription cars.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ---------------------- Zones & Check-in ---------------------- */}
      {subscription && (
        <SubscriberZones
          zones={zones}
          gateId={gateId}
          subscription={subscription}
          plateMismatch={!!plateMismatch}
          onTicket={onTicket}
        />
      )}
    </div>
  );
}
