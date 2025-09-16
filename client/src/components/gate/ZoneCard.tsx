'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Zone } from '@/lib/api/types';

type ZoneCardProps = {
  zone: Zone;
  mode: 'visitor' | 'subscriber';
  disabled: boolean;
  loading: boolean;
  onCheckin: () => void;
  extraMessage?: string; // e.g. category mismatch or inactive subscription
};

export default function ZoneCard({
  zone,
  mode,
  disabled,
  loading,
  onCheckin,
  extraMessage,
}: ZoneCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{zone.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Category: {zone.categoryId}</p>
        <p className="text-sm">Occupied: {zone.occupied}</p>
        <p className="text-sm">Free: {zone.free}</p>
        <p className="text-sm">Reserved: {zone.reserved}</p>

        {mode === 'visitor' && (
          <p className="text-sm">
            Visitors Available: {zone.availableForVisitors}
          </p>
        )}

        {mode === 'subscriber' && (
          <p className="text-sm">
            Subscribers Available: {zone.availableForSubscribers}
          </p>
        )}

        <p className="text-sm">
          Rates: N {zone.rateNormal} / S {zone.rateSpecial}
        </p>

        {extraMessage && (
          <p className="text-xs text-red-600 mt-2">{extraMessage}</p>
        )}

        <Button
          className="mt-3 w-full"
          disabled={disabled || loading}
          onClick={onCheckin}
        >
          {loading ? 'Checking in...' : 'Check-in'}
        </Button>
      </CardContent>
    </Card>
  );
}
