"use client";

import { useEffect, useState } from "react";
import { wsClient } from "@/lib/ws";
import type { AdminUpdatePayload } from "@/lib/api/types";

export default function AdminAuditLog() {
  const [log, setLog] = useState<AdminUpdatePayload[]>([]);

  useEffect(() => {
    wsClient.setAdminHandler((payload) => {
      setLog((prev) => {
        // unique key to avoid duplicates
        const key = `${payload.timestamp}-${payload.action}-${payload.targetId}`;
        const alreadyExists = prev.some(
          (p) =>
            `${p.timestamp}-${p.action}-${p.targetId}` === key
        );

        if (alreadyExists) return prev; // skip duplicate

        return [payload, ...prev].slice(0, 50);
      });
    });

    return () => wsClient.setAdminHandler(undefined);
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-white max-h-[600px] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-2">Live Admin Audit</h2>
      <ul className="text-sm max-h-64 overflow-y-auto space-y-1">
        {log.map((item, idx) => (
          <li key={idx} className="border-b pb-1">
            <span className="text-gray-600">{item.timestamp}</span> —{" "}
            <span className="font-semibold">{item.adminId}</span>{" "}
            {item.action}{" "}
            <span className="text-gray-800">{item.targetId}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
