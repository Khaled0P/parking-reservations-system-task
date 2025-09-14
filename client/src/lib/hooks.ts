import { useQuery } from "@tanstack/react-query";
import api from "./api";

export function useGates() {
  return useQuery({
    queryKey: ["gates"],
    queryFn: async () => {
      const { data } = await api.get("/master/gates");
      return data;
    },
  });
}
