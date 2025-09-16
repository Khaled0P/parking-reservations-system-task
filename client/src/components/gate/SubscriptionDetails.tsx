'use client';

import type { Subscription } from '@/lib/api/types';

type SubscriptionDetailsProps = {
  subscription: Subscription;
  plateInput: string;
  setPlateInput: (val: string) => void;
  plateMismatch: boolean;
};

export default function SubscriptionDetails({
  subscription,
  plateInput,
  setPlateInput,
  plateMismatch,
}: SubscriptionDetailsProps) {
  return (
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

      {/* Plate validation input */}
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
  );
}
