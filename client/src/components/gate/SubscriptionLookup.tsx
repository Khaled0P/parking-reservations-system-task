'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useSubscription } from '@/lib/api/subscriptions';
import type { Subscription } from '@/lib/api/types';

type SubscriptionLookupProps = {
  onResult: (subscription: Subscription | null) => void;
  setPlateInput: (val: string) => void;
};

export default function SubscriptionLookup({
  onResult,
  setPlateInput,
}: SubscriptionLookupProps) {
  const [inputId, setInputId] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const {
    data: subscription,
    isFetching,
    isError,
    error,
  } = useSubscription(submittedId, { enabled: !!submittedId }); // only fetch on submit

  useEffect(() => {
    onResult(subscription ?? null);
  }, [subscription, onResult]);

  // temporary inline error handling
  const getErrorMessage = (err: unknown) => {
    if (!err) return 'Subscription not found';
    const anyErr = err as any;
    if (anyErr?.response?.data?.message)
      return String(anyErr.response.data.message);
    if (anyErr?.message) return String(anyErr.message);
    return 'Subscription not found';
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Subscription ID"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputId) setSubmittedId(inputId.trim());
          }}
          className="flex-1 text-white rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button
          onClick={() => inputId && setSubmittedId(inputId.trim())}
          disabled={!inputId || isFetching}
        >
          {isFetching ? 'Checking...' : 'Verify'}
        </Button>
      </div>

      {isError && (
        <p className="text-sm text-red-600 mt-1">{getErrorMessage(error)}</p>
      )}
      {subscription && !subscription.active && (
        <p className="text-sm text-yellow-700 mt-1">
          This subscription is <strong>inactive</strong>.
        </p>
      )}
    </div>
  );
}
