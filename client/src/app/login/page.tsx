"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/lib/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { setAuth } from "@/store/slices/authSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loginMutation = useLogin();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: (data) => {
          dispatch(setAuth({ token: data.token, user: data.user }));

          // redirect based on role
          if (data.user.role === "employee") {
            router.push("/checkpoint");
          } else if (data.user.role === "admin") {
            router.push("/admin");
          }
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
            {loginMutation.isError && (
              <p className="text-sm text-red-500">
                {(loginMutation.error as any)?.response?.data?.message || "Login failed"}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
