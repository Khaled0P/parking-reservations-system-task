"use client";

import { UseMutationResult } from "@tanstack/react-query";
import { Ticket } from "@/lib/api/types";
import { useToast } from "@/hooks/use-toast";

interface UseVisitorCheckinProps {
  checkinMutation: UseMutationResult<any, unknown, any>;
  onTicket: (ticket: Ticket) => void;
}

export function useVisitorCheckin({ checkinMutation, onTicket }: UseVisitorCheckinProps) {
  const { toast } = useToast();

  const handleCheckin = (gateId: string, zoneId: string, type: "visitor" | "subscriber") => {
    checkinMutation.mutate(
      { gateId, zoneId, type },
      {
        onSuccess: (data) => {
          onTicket(data.ticket);
          toast({
            title: "Check-in successful",
            description: (
              <span>
                Ticket <strong>{data.ticket.id}</strong> created for Zone{" "}
                <strong>{data.ticket.zoneId}</strong>
              </span>
            ),
          });
        },
        onError: (err: any) => {
          toast({
            title: "Check-in failed",
            description: err?.response?.data?.message || "Something went wrong",
            variant: "destructive",
          });
        },
      }
    );
  };

  return { handleCheckin };
}
