'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGates } from '@/lib/api/gates';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { data: gates, isLoading } = useGates();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6">
        {/* Admin / Employee */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Manage zones, categories, rush hours, vacations, and
              subscriptions.
            </p>
            <p className="text-sm text-gray-600">
              Check in and out vehicles at designated gates.
            </p>
            <Button asChild className="w-full">
              <Link href="/login?role=admin">Login as staff</Link>
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
              View parking availability at gates. and check-in
            </p>
            <p className="text-sm text-gray-600">
              Check your subscription and use your active subscription to check-in
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
              <Button variant="outline" className="w-full" disabled>
                <Loader2 />
                Loading Gates...
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

