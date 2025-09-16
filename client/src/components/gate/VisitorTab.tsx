'use client';

import ZoneCard from './ZoneCard';
import type { Zone, Ticket } from '@/lib/api/types';
import { UseMutationResult } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleVisitorCheckin = (zoneId: string) => {
    checkinMutation.mutate(
      { gateId, zoneId, type: 'visitor' },
      {
        onSuccess: (data) => {
          onTicket(data.ticket);
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

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {zones.map((zone) => (
        <ZoneCard
          key={zone.id}
          zone={zone}
          mode="visitor"
          disabled={!zone.open || zone.availableForVisitors <= 0}
          loading={checkinMutation.isPending}
          onCheckin={() => handleVisitorCheckin(zone.id)}
        />
      ))}
    </div>
  );
}
