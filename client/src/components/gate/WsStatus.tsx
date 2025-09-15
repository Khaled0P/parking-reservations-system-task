"use client";

import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

export default function WsStatus() {
  const { connected, reconnecting } = useAppSelector((state) => state.ws);

  let text = "Disconnected";
  let colorClasses = "bg-red-100 text-red-800";
  let dotClasses = "bg-red-500";

  if (reconnecting) {
    text = "Reconnecting…";
    colorClasses = "bg-yellow-100 text-yellow-800 animate-pulse";
    dotClasses = "bg-yellow-500";
  } else if (connected) {
    text = "Connected";
    colorClasses = "bg-green-100 text-green-800";
    dotClasses = "bg-green-500";
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors",
        colorClasses
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", dotClasses)} />
      {text}
    </div>
  );
}
