import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AdminUpdatePayload } from "@/lib/api/types";

interface WsState {
  connected: boolean;
  reconnecting: boolean;
  lastConnectedAt: string | null;
  audit: AdminUpdatePayload[];
}

const initialState: WsState = {
  connected: false,
  reconnecting: false,
  lastConnectedAt: null,
  audit: [],
};

const wsSlice = createSlice({
  name: "ws",
  initialState,
  reducers: {
    setConnected(state) {
      state.connected = true;
      state.reconnecting = false;
      state.lastConnectedAt = new Date().toISOString();
    },
    setDisconnected(state) {
      state.connected = false;
    },
    setReconnecting(state) {
      state.connected = false;
      state.reconnecting = true;
    },
    addAdminUpdate(state, action: PayloadAction<AdminUpdatePayload>) {
      state.audit.unshift(action.payload);
      if (state.audit.length > 200) {
        state.audit.length = 200;
      }
    },
    clearAudit(state) {
      state.audit = [];
    },
  },
});

export const {
  setConnected,
  setDisconnected,
  setReconnecting,
  addAdminUpdate,
  clearAudit,
} = wsSlice.actions;
export default wsSlice.reducer;
