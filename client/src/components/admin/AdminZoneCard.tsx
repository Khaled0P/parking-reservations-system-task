"use client";

import { AdminZone } from "@/lib/api/types";

type AdminZoneCardProps = {
  zone: AdminZone;
  onToggle: (open: boolean) => void;
};

export default function AdminZoneCard({ zone, onToggle }: AdminZoneCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{zone.name}</h3>
          <p className="text-sm text-gray-600">Category: {zone.categoryId}</p>
        </div>
        <button
          className={`px-3 py-1 rounded ${
            zone.open ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
          onClick={() => onToggle(!zone.open)}
        >
          {zone.open ? 'Open' : 'Closed'}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>Occupied: <strong>{zone.occupied}</strong></div>
        <div>Free: <strong>{zone.free}</strong></div>
        <div>Reserved: <strong>{zone.reserved}</strong></div>
        <div>Visitors: <strong>{zone.availableForVisitors}</strong></div>
        <div>Subscribers: <strong>{zone.availableForSubscribers}</strong></div>
        <div>Rates: N:{zone.rateNormal} / S:{zone.rateSpecial}</div>
      </div>

      {zone?.specialActive && (
        <div className="mt-2 text-xs text-yellow-800">Special rates active</div>
      )}
    </div>
  );
}
