"use client";

import { useLogin } from "@/lib/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { setAuth } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export function useLoginHandler() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loginMutation = useLogin();
  const { token, user } = useAppSelector((s) => s.auth);

  // auto-redirect if already logged in
  useEffect(() => {
    if (token && user) {
      if (user.role === "employee") {
        router.replace("/checkpoint");
      } else if (user.role === "admin") {
        router.replace("/admin");
      }
    }
  }, [token, user, router]);

  const handleLogin = (username: string, password: string) => {
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: (data) => {
          dispatch(setAuth({ token: data.token, user: data.user }));

          if (data.user.role === "employee") {
            router.replace("/checkpoint");
          } else if (data.user.role === "admin") {
            router.replace("/admin");
          }
        },
      }
    );
  };

  return {
    handleLogin,
    loginMutation,
  };
}
