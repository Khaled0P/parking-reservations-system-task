"use client";

import { useGates } from "@/lib/api/gates";

export default function Home() {
  const { data, isLoading } = useGates();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Gates</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}