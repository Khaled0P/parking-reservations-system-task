"use client";

import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

export default function WsStatus() {
  const connected = useAppSelector((state) => state.ws.connected);

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
        connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          connected ? "bg-green-500" : "bg-red-500"
        )}
      />
      {connected ? "Connected" : "Disconnected"}
    </div>
  );
}
