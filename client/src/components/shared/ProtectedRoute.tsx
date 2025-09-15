"use client";

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: ("admin" | "employee")[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { token, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!token || !user || !allowedRoles.includes(user.role)) {
      router.push("/login");
    }
  }, [token, user, router, allowedRoles]);

  if (!token || !user || !allowedRoles.includes(user.role)) {
    return null; // loading spinner later
  }

  return <>{children}</>;
}
