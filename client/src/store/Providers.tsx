'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { wsClient } from '@/lib/ws';
import {
  setConnected,
  setDisconnected,
  setReconnecting,
} from '@/store/slices/wsSlice';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';
import { loadAuthFromStorage } from './slices/authSlice';

const queryClient = new QueryClient();


function WsManager({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  
  // initialize Redux from storage at app boot
  useEffect(() => {
    store.dispatch(loadAuthFromStorage());
  }, []);

  useEffect(() => {
    wsClient.connect(queryClient);

    // listen for reconnecting custom event
    const handleReconnecting = () => dispatch(setReconnecting());
    window.addEventListener('ws:reconnecting', handleReconnecting);

    wsClient.setStatusHandler((connected) => {
      if (connected) {
        dispatch(setConnected());
      } else {
        dispatch(setDisconnected());
      }
    });

    return () => {
      wsClient.setStatusHandler(undefined);
      window.removeEventListener('ws:reconnecting', handleReconnecting);
      wsClient.disconnect();
    };
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <WsManager>{children}</WsManager>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReduxProvider>
  );
}
