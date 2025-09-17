'use client';

import { useToast } from '@/hooks/use-toast';
import { useCheckin } from '@/lib/api/tickets';
import type { Subscription, Ticket } from '@/lib/api/types';

export function useSubscriberCheckin({
  gateId,
  subscription,
  onTicket,
}: {
  gateId: string;
  subscription: Subscription;
  onTicket: (ticket: Ticket) => void;
}) {
  const { toast } = useToast();
  const checkinMutation = useCheckin();

  const handleCheckin = (zoneId: string, asVisitor = false) => {
    checkinMutation.mutate(
      asVisitor
        ? { gateId, zoneId, type: 'visitor' }
        : { gateId, zoneId, type: 'subscriber', subscriptionId: subscription.id },
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

  return {
    handleCheckin,
    isPending: checkinMutation.isPending,
  };
}
