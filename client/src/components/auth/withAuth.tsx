'use client';

import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Unauthorized from './Unauthorized';

interface WithAuthOptions {
  role: 'admin' | 'employee';
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions
) {
  return function ProtectedComponent(props: P) {
    const { token, user } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const [hydrated, setHydrated] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);

    // wait for Redux to hydrate
    useEffect(() => {
      setHydrated(true);
    }, []);

    useEffect(() => {
      if (!hydrated) return;

      if (!token || !user || user.role !== options.role) {
        setUnauthorized(true);
      }
    }, [hydrated, token, user, router]);

    if (!hydrated) {
      return null; // loading
    }

    if (unauthorized) {
      return <Unauthorized />;
    }

    if (!token || !user) {
      return null; // handled by redirect
    }

    return <Component {...props} />;
  };
}
