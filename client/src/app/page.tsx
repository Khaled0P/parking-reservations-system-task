"use client";

import { useGates } from "@/lib/hooks";

export default function Home() {
  const { data, isLoading } = useGates();
console.log(data);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Gates</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}