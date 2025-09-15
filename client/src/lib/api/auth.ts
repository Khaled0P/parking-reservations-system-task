import { useMutation } from "@tanstack/react-query";
import client from "./client";

interface LoginPayload {
  username: string;
  password: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await client.post("/auth/login", payload);
      return data; // { user, token }
    },
  });
}
