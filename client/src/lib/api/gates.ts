import { useQuery } from "@tanstack/react-query";
import client from "./client";
import { Gate } from "./types";

export function useGates() {
  return useQuery<Gate[]>({
    queryKey: ["gates"],
    queryFn: async () => {
      const { data } = await client.get<Gate[]>("/master/gates");
      return data;
    },
  });
}
