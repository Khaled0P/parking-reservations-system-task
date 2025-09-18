"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Gate } from "@/lib/api/types";

interface GateDropdownProps {
  gates: Gate[] | undefined;
  currentGateId: string | undefined;
}

export default function GateDropdown({ gates, currentGateId }: GateDropdownProps) {
  const router = useRouter();

  const currentGate = gates?.find((g) => g.id === currentGateId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {currentGate?.name || currentGateId || "Select Gate"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {gates?.map((g) => (
          <DropdownMenuItem
            key={g.id}
            onClick={() => router.push(`/gate/${g.id}`)}
          >
            {g.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
