'use client';

import ZoneCard from './ZoneCard';
import type { Zone, Ticket } from '@/lib/api/types';
import { UseMutationResult } from '@tanstack/react-query';
import { useVisitorCheckin } from '@/hooks/useVisitorCheckin';

type VisitorTabProps = {
  zones: Zone[];
  gateId: string;
  checkinMutation: UseMutationResult<any, unknown, any>;
  onTicket: (ticket: Ticket) => void;
};

export default function VisitorTab({
  zones,
  gateId,
  checkinMutation,
  onTicket,
}: VisitorTabProps) {
  const { handleCheckin } = useVisitorCheckin({ checkinMutation, onTicket });

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {zones.map((zone) => (
        <ZoneCard
          key={zone.id}
          zone={zone}
          mode="visitor"
          disabled={!zone.open || zone.availableForVisitors <= 0}
          loading={checkinMutation.isPending}
          onCheckin={() => handleCheckin(gateId, zone.id, 'visitor')}
        />
      ))}
    </div>
  );
}
