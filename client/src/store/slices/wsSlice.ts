import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AdminUpdatePayload } from "@/lib/api/types";

interface WsState {
  connected: boolean;
  lastConnectedAt: string | null;
  audit: AdminUpdatePayload[]; // live admin events
}

const initialState: WsState = {
  connected: false,
  lastConnectedAt: null,
  audit: [],
};

const wsSlice = createSlice({
  name: "ws",
  initialState,
  reducers: {
    setConnected(state) {
      state.connected = true;
      state.lastConnectedAt = new Date().toISOString();
    },
    setDisconnected(state) {
      state.connected = false;
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

export const { setConnected, setDisconnected, addAdminUpdate, clearAudit } =
  wsSlice.actions;
export default wsSlice.reducer;
