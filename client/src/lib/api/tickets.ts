import { useMutation, useQuery } from "@tanstack/react-query";
import client from "./client";
import { Ticket, CheckinResponse, CheckoutResponse } from "./types";

// check-in
export function useCheckin() {
  return useMutation<CheckinResponse, unknown, {
    gateId: string;
    zoneId: string;
    type: "visitor" | "subscriber";
    subscriptionId?: string;
  }>({
    mutationFn: async (payload) => {
      const { data } = await client.post<CheckinResponse>("/tickets/checkin", payload);
      return data;
    },
  });
}

// checkout
export function useCheckout() {
  return useMutation<CheckoutResponse, unknown, {
    ticketId: string;
    forceConvertToVisitor?: boolean;
  }>({
    mutationFn: async (payload) => {
      const { data } = await client.post<CheckoutResponse>("/tickets/checkout", payload);
      return data;
    },
  });
}

// fetch single ticket
export function useTicket(id: string) {
  return useQuery<Ticket>({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const { data } = await client.get<Ticket>(`/tickets/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
