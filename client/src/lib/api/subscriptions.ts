import { useQuery } from '@tanstack/react-query';
import client from './client';
import { Subscription } from './types';
import { getApiErrorMessage } from '../utils';

export const useSubscription = (id: string | null, opts?: { enabled?: boolean }) => {
  const query = useQuery<Subscription, Error>({
    queryKey: ['subscription', id],
    queryFn: async () => {
      if (!id) throw new Error('No subscription id provided');
      const res = await client.get(`/subscriptions/${id}`);
      return res.data;
    },
    enabled: opts?.enabled ?? id !== null, // prevent initial fetch only when id null (still accepts undefined and empty strings "")
    retry: false,
    staleTime: 1000 * 60 * 2,
  });

  return {
    ...query,
    errorMessage: query.isError
      ? getApiErrorMessage(query.error, 'Subscription not found')
      : null,
  };
};

