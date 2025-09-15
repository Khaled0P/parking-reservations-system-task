import { useQuery } from '@tanstack/react-query';
import client from './client';
import { Subscription } from './types';

export const useSubscription = (id: string | null) => {
  return useQuery<Subscription, Error>({
    queryKey: ['subscription', id],
    queryFn: async () => {
      if (!id) throw new Error('No subscription id provided');
      const res = await client.get(`/subscriptions/${id}`);
      return res.data;
    },
    enabled: !!id, // only run when id is provided
    retry: false,  // don’t spam requests for invalid ids
  });
};
