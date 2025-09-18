"use client";

import { useState } from "react";
import { useAddVacation } from "@/lib/api/admin";

export default function VacationsPage() {
  const addVacation = useAddVacation();

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVacation.mutate(
      { start, end, reason },
      {
        onSuccess: () => {
          setStart("");
          setEnd("");
          setReason("");
        },
      }
    );
  };

  return (
    <div className="p-6 max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Add Vacation</h1>

      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-white">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full border rounded px-2 py-1 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border rounded px-2 py-1 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Reason</label>
          <input
            type="text"
            placeholder="Holiday, maintenance..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded px-2 py-1 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={addVacation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {addVacation.isPending ? "Saving..." : "Add Vacation"}
        </button>

        {addVacation.isError && (
          <p className="text-sm text-red-600">
            {(addVacation.error as any)?.response?.data?.message || "Error adding vacation"}
          </p>
        )}
        {addVacation.isSuccess && (
          <p className="text-sm text-green-600">Vacation added successfully!</p>
        )}
      </form>
    </div>
  );
}
