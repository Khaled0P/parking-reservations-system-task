import { useQuery } from '@tanstack/react-query';
import client from './client';
import { Subscription } from './types';

export const useSubscription = (id: string | null, opts?: { enabled?: boolean }) => {
  return useQuery<Subscription, Error>({
    queryKey: ['subscription', id],
    queryFn: async () => {
      if (!id) throw new Error('No subscription id provided');
      const res = await client.get(`/subscriptions/${id}`);
      return res.data;
    },
    enabled: opts?.enabled ?? false, // avoid verifying on input change
    retry: false,  // don’t spam requests for invalid ids
    staleTime: 1000 * 60 * 2,
  });
};
