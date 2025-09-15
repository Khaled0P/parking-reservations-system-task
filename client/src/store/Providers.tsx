"use client";

import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { wsClient } from "@/lib/ws";
import { setConnected, setDisconnected } from "@/store/slices/wsSlice";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

const queryClient = new QueryClient();

function WsManager({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    wsClient.connect(queryClient);

    wsClient.setStatusHandler((connected) => {
      if (connected) {
        dispatch(setConnected());
      } else {
        dispatch(setDisconnected());
      }
    });

    return () => {
      wsClient.setStatusHandler(undefined);
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
