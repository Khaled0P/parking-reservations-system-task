"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTicket } from "@/lib/api/tickets";

export default function PrintTicketPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { data, isLoading, isError } = useTicket(ticketId, {enabled: true});

  useEffect(() => {
    if (!isLoading && !isError && data) {
      // print once ticket is fully fetched
      window.print();
    }
  }, [isLoading, isError, data]);

  if (isLoading) return <p>Loading ticket...</p>;
  if (isError) return <p className="text-red-500">Failed to load ticket</p>;

  const ticket = data;

  return (
    <div className="p-6 max-w-md mx-auto text-sm">
      <h1 className="text-xl font-bold text-center mb-4">Parking Ticket</h1>
      <div className="space-y-2">
        <p><strong>ID:</strong> {ticket?.id}</p>
        <p><strong>Type:</strong> {ticket?.type}</p>
        <p><strong>Gate:</strong> {ticket?.gateId}</p>
        <p><strong>Zone:</strong> {ticket?.zoneId}</p>
        <p>
          <strong>Check-in Time:</strong>{" "}
          {ticket?.checkinAt
            ? new Date(ticket?.checkinAt).toLocaleString()
            : "N/A"}
        </p>
      </div>
    </div>
  );
}
