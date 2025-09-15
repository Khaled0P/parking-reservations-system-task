import { useMutation } from "@tanstack/react-query";
import client from "./client";

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: "admin" | "employee";
  };
}

export function useLogin() {
  return useMutation<LoginResponse, unknown, LoginPayload>({
    mutationFn: async (payload) => {
      const { data } = await client.post<LoginResponse>("/auth/login", payload);
      return data;
    },
  });
}
