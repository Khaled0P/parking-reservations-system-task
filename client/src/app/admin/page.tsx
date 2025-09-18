"use client";

import { useEffect } from "react";
import client from "@/lib/api/client";
import { wsClient } from "@/lib/ws";
import { Gate } from "@/lib/api/types";
import ParkingStateReport from "@/components/admin/ParkingStateReport";
import AdminAuditLog from "@/components/admin/AdminAuditLog";

export default function AdminDashboard() {

  // subscribe to all gates to get updates on the log
  useEffect(() => {
    async function subscribeAll() {
      try {
        const res = await client.get<Gate[]>("/master/gates");
        res.data.forEach((gate) => {
          wsClient.subscribeGate(gate.id);
        });
      } catch (err) {
        console.error("Failed to subscribe to all gates:", err);
      }
    }

    subscribeAll();

    // unsubscribe on unmount
    return () => {
      wsClient.disconnect();
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <ParkingStateReport />
      <AdminAuditLog />
    </div>
  );
}
