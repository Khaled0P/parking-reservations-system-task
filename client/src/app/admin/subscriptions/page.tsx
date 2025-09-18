"use client";

import { useAdminSubscriptions } from "@/lib/api/admin";
import { Subscription } from "@/lib/api/types";

export default function SubscriptionsPage() {
  const { data, isLoading, isError, error } = useAdminSubscriptions();

  if (isLoading) return <div>Loading subscriptions...</div>;
  if (isError) return <div className="text-red-600">Error: {(error as Error).message}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Subscriptions</h1>

      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Active</th>
            <th className="p-2 text-left">Cars</th>
            <th className="p-2 text-left">Period</th>
            <th className="p-2 text-left">Current Check-ins</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((sub: Subscription) => (
            <tr key={sub.id} className="border-t">
              <td className="p-2">{sub.userName}</td>
              <td className="p-2">{sub.category}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    sub.active ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {sub.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-2">
                <ul className="list-disc pl-4">
                  {sub.cars.map((car, idx) => (
                    <li key={idx} className="text-sm">
                      {car.plate} — {car.brand} {car.model} ({car.color})
                    </li>
                  ))}
                </ul>
              </td>
              <td className="p-2 text-sm">
                {new Date(sub.startsAt).toLocaleDateString()} →{" "}
                {new Date(sub.expiresAt).toLocaleDateString()}
              </td>
              <td className="p-2">
                {sub.currentCheckins.length > 0 ? (
                  <ul className="list-disc pl-4">
                    {sub.currentCheckins.map((c) => (
                      <li key={c.ticketId} className="text-sm">
                        Ticket {c.ticketId} @ Zone {c.zoneId}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500 text-sm">None</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
