import { Session } from "next-auth";
import { create } from "zustand";

/**
 * Zustand store for client session state
 */

export interface IClientSessionState {
  session: Session | null;
  setSession: (session: Session) => void;
}

export const useClientSessionState = create<IClientSessionState>((set) => ({
  session: null,
  setSession: (session: Session) => set({ session }),
}));
