// src/components/checkpoint/TicketDetailsModal.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCheckout } from '@/lib/api/tickets';
import { useSubscription } from '@/lib/api/subscriptions';
import { Ticket, CheckoutBreakdown } from '@/lib/api/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface TicketDetailsModalProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

export default function TicketDetailsModal({
  open,
  onClose,
  ticket,
}: TicketDetailsModalProps) {
  const { toast } = useToast();
  const checkoutMutation = useCheckout();

  const subscriptionId = ticket?.subscriptionId;
  const { data: subscription } = useSubscription(subscriptionId ?? '', {
    enabled: !!subscriptionId,
  });

  const handleCheckout = (forceConvert = false) => {
    if (!ticket) return;

    checkoutMutation.mutate(
      { ticketId: ticket.id, forceConvertToVisitor: forceConvert },
      {
        onSuccess: (data) => {
          toast({
            title: forceConvert
              ? 'Converted to Visitor checkout successful'
              : 'Checkout successful',
            description: `Ticket ${data.ticketId} closed. Amount: $${data.amount}`,
          });
        },
        onError: (err: any) => {
          toast({
            title: 'Checkout failed',
            description: err?.response?.data?.message || 'Something went wrong',
            variant: 'destructive',
          });
        },
      }
    );
  };

  useEffect(() => {
    checkoutMutation.reset();
  }, [ticket?.id]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ticket Details</DialogTitle>
        </DialogHeader>

        {!ticket && <p>No ticket loaded</p>}

        {ticket && (
          <div className="space-y-4">
            <p>
              <strong>Ticket ID:</strong> {ticket.id}
            </p>
            <p>
              <strong>Type:</strong> {ticket.type}
            </p>
            <p>
              <strong>Zone:</strong> {ticket.zoneId}
            </p>
            <p>
              <strong>Gate:</strong> {ticket.gateId}
            </p>
            <p>
              <strong>Check-in:</strong>{' '}
              {new Date(ticket.checkinAt).toLocaleString()}
            </p>

            {/* Subscription cars if subscriber */}
            {ticket.type === 'subscriber' && subscription && (
              <div>
                <h3 className="font-medium mb-1">Subscriber Cars</h3>
                <ul className="list-disc ml-5 text-sm">
                  {subscription.cars.map((car) => (
                    <li key={car.plate}>
                      {car.plate} — {car.brand} {car.model} ({car.color})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Checkout result */}
            {checkoutMutation.data && (
              <div className="mt-4">
                <h3 className="font-medium">Breakdown</h3>
                <ul className="list-disc ml-5 text-sm">
                  {checkoutMutation.data.breakdown.map(
                    (b: CheckoutBreakdown, idx: number) => (
                      <li key={idx}>
                        {new Date(b.from).toLocaleTimeString()} →{' '}
                        {new Date(b.to).toLocaleTimeString()} ({b.hours}h) —{' '}
                        {b.rateMode} @ ${b.rate}/h = ${b.amount}
                      </li>
                    )
                  )}
                </ul>
                <p className="font-semibold mt-2">
                  Total: ${checkoutMutation.data.amount.toFixed(2)}
                </p>
              </div>
            )}

            {/* Actions */}
            {!checkoutMutation.data && (
              <div className="flex gap-2">
                <Button onClick={() => handleCheckout(false)}>
                  Checkout Normally
                </Button>
                {ticket.type === 'subscriber' && (
                  <Button
                    variant="destructive"
                    onClick={() => handleCheckout(true)}
                  >
                    Convert to Visitor
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
