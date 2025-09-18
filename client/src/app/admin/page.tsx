"use client";

import { useEffect } from "react";
import client from "@/lib/api/client";
import { wsClient } from "@/lib/ws";
import { Gate } from "@/lib/api/types";
import ParkingStateReport from "@/components/admin/ParkingStateReport";
import AdminAuditLog from "@/components/admin/AdminAuditLog";
import { withAuth } from "@/components/auth/withAuth";

function AdminDashboard() {

  // subscribe to all gates to get updates on the log
  useEffect(() => {
  let gates: Gate[] = []; //store gates for the cleanup

  async function subscribeAll() {
    try {
      const res = await client.get<Gate[]>("/master/gates");
      gates = res.data;
      gates.forEach((gate) => {
        wsClient.subscribeGate(gate.id);
      });
    } catch (err) {
      console.error("Failed to subscribe to all gates:", err);
    }
  }

  subscribeAll();

  return () => {
    gates.forEach((gate) => {
      wsClient.unsubscribeGate(gate.id);
    });
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

export default withAuth(AdminDashboard, { role: "admin" }); //export protected