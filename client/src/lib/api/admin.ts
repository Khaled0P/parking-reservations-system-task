import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from './client';
import { AdminZone, Category, Subscription } from './types';

// Parking state report
export const useParkingStateReport = () =>
  useQuery<AdminZone[]>({
    queryKey: ['admin', 'parking-state'],
    queryFn: async () => {
      const res = await client.get<AdminZone[]>('/admin/reports/parking-state');
      return res.data;
    },
    staleTime: 10_000,
    retry: false,
  });

// Toggle zone open/close
export const useToggleZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, open }: { id: string; open: boolean }) => {
      const res = await client.put(`/admin/zones/${id}/open`, { open });
      return res.data as AdminZone;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'parking-state'] }),
  });
};

// Categories list
export const useCategories = () =>
  useQuery<Category[]>({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const res = await client.get<Category[]>('/master/categories');
      return res.data;
    },
    staleTime: 60_000,
  });

// Update category rates
export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await client.put(`/admin/categories/${id}`, payload);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  });
};

// Subscriptions
export const useAdminSubscriptions = () =>
  useQuery<Subscription[]>({
    queryKey: ['admin', 'subscriptions'],
    queryFn: async () => {
      const res = await client.get<Subscription[]>('/admin/subscriptions');
      return res.data;
    },
    staleTime: 60_000,
  });

  //rush hours 
  export const useAddRushHour = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await client.post('/admin/rush-hours', payload);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'parking-state'] }),
  });
};

// vacations
export const useAddVacation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await client.post('/admin/vacations', payload);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'parking-state'] }),
  });
};