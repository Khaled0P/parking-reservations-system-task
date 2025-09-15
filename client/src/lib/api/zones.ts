import { useQuery } from "@tanstack/react-query";
import client from "./client";
import { Zone } from "./types";

// Public: fetch zones by gateId
export function useZones(gateId: string) {
  return useQuery<Zone[]>({
    queryKey: ["zones", gateId],
    queryFn: async () => {
      const { data } = await client.get<Zone[]>(`/master/zones?gateId=${gateId}`);
      return data;
    },
    enabled: !!gateId, // don't fetch until we have a gateId
  });
}
