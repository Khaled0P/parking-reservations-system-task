"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGates } from "@/lib/api/gates";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function HomePage() {
  const { data: gates } = useGates();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-4xl w-full grid md:grid-cols-3 gap-6">
        {/* Admin */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Manage zones, categories, rush hours, vacations, and subscriptions.
            </p>
            <Button asChild className="w-full">
              <Link href="/login?role=admin">Login as Admin</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Employee */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Checkpoint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Check in and out vehicles at designated gates.
            </p>
            <Button asChild className="w-full">
              <Link href="/login?role=employee">Login as Employee</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Public */}
        <Card>
          <CardHeader>
            <CardTitle>Public Gate Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              View parking availability at gates without logging in.
            </p>
            {gates && gates.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Select a Gate
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {gates.map((g) => (
                    <DropdownMenuItem key={g.id} asChild>
                      <Link href={`/gate/${g.id}`}>{g.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <p className="text-sm text-gray-400">No gates available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
