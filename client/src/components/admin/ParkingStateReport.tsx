"use client";

import { useParkingStateReport, useToggleZone } from '@/lib/api/admin';
import AdminZoneCard from './AdminZoneCard';
import { AdminZone } from '@/lib/api/types';
import { Loading } from '../ui/Loading';

export default function ParkingStateReport() {
  const { data, isLoading, isError, error } = useParkingStateReport();
  const toggleZone = useToggleZone();

  if (isLoading) return <Loading title="Loading parking state..." />
  if (isError) return <div className="text-red-600">Error: {(error as Error).message}</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.map((zone: AdminZone) => (
        <AdminZoneCard
          key={zone.zoneId}
          zone={zone}
          onToggle={(open: boolean) => toggleZone.mutate({ id: zone.zoneId, open })}
        />
      ))}
    </div>
  );
}
