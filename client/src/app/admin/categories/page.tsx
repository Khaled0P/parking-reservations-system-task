"use client";

import { Loading } from "@/components/ui/Loading";
import { useCategories, useUpdateCategory } from "@/lib/api/admin";
import { useState } from "react";

export default function CategoriesPage() {
  const { data, isLoading, isError, error } = useCategories();
  const updateCategory = useUpdateCategory();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{ rateNormal: number; rateSpecial: number }>({
    rateNormal: 0,
    rateSpecial: 0,
  });

  if (isLoading) return <Loading title="Loading categories..." />
  if (isError) return <div className="text-red-600">Error: {(error as Error).message}</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Categories</h1>

      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Normal Rate</th>
            <th className="p-2 text-left">Special Rate</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((cat) => (
            <tr key={cat.id} className="border-t">
              <td className="p-2">{cat.name}</td>
              <td className="p-2">
                {editingId === cat.id ? (
                  <input
                    type="number"
                    className="border p-1 rounded w-24 text-white"
                    value={form.rateNormal}
                    onChange={(e) => setForm({ ...form, rateNormal: +e.target.value })}
                  />
                ) : (
                  cat.rateNormal
                )}
              </td>
              <td className="p-2">
                {editingId === cat.id ? (
                  <input
                    type="number"
                    className="border p-1 rounded w-24 text-white"
                    value={form.rateSpecial}
                    onChange={(e) => setForm({ ...form, rateSpecial: +e.target.value })}
                  />
                ) : (
                  cat.rateSpecial
                )}
              </td>
              <td className="p-2">
                {editingId === cat.id ? (
                  <div className="space-x-2">
                    <button
                      className="px-2 py-1 bg-green-600 text-white rounded"
                      onClick={() =>
                        updateCategory.mutate(
                          { id: cat.id, payload: form },
                          {
                            onSuccess: () => setEditingId(null),
                          }
                        )
                      }
                    >
                      Save
                    </button>
                    <button
                      className="px-2 py-1 bg-gray-400 text-white rounded"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded"
                    onClick={() => {
                      setEditingId(cat.id);
                      setForm({ rateNormal: cat.rateNormal, rateSpecial: cat.rateSpecial });
                    }}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
