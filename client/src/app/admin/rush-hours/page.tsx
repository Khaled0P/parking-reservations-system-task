"use client";

import { useState } from "react";
import { useAddRushHour } from "@/lib/api/admin";

export default function RushHoursPage() {
  const addRushHour = useAddRushHour();

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [multiplier, setMultiplier] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRushHour.mutate(
      { start, end, multiplier },
      {
        onSuccess: () => {
          setStart("");
          setEnd("");
          setMultiplier(1);
        },
      }
    );
  };

  return (
    <div className="p-6 max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Add Rush Hour</h1>

      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-white">
        <div>
          <label className="block text-sm font-medium">Start Time</label>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full border rounded px-2 py-1 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">End Time</label>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border rounded px-2 py-1 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Multiplier</label>
          <input
            type="number"
            step="0.1"
            min="1"
            value={multiplier}
            onChange={(e) => setMultiplier(Number(e.target.value))}
            className="w-full border rounded px-2 py-1 text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={addRushHour.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {addRushHour.isPending ? "Saving..." : "Add Rush Hour"}
        </button>

        {addRushHour.isError && (
          <p className="text-sm text-red-600">
            {(addRushHour.error as any)?.response?.data?.message || "Error adding rush hour"}
          </p>
        )}
        {addRushHour.isSuccess && (
          <p className="text-sm text-green-600">Rush hour added successfully!</p>
        )}
      </form>
    </div>
  );
}
