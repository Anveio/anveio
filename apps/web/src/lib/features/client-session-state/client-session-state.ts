"use client";

import { Session } from "next-auth";
import { create, createStore } from "zustand";
import { createToast } from "../toasts";
import { signIn } from "next-auth/react";

/**
 * Zustand store for client session state
 */

export interface IClientSessionState {
  session: Session | null;
  isBusy: boolean;
  setSession: (session: Session) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
}

export const useClientSessionState = create<IClientSessionState>((set) => ({
  session: null,
  isBusy: false,
  signInWithGoogle: async () => {
    console.log("IN HERE");
    try {
      set({ isBusy: true });
      createToast("Signing in with Google...", {
        timeout: 15000,
        category: "sign-in",
      });

      const maybeSignInResponse = await signIn("google");

      console.log(maybeSignInResponse);
    } catch (e) {
      createToast("Sign in failed.", {
        timeout: 15000,
        category: "sign-in",
        type: "error",
      });

      console.error(e);
    } finally {
      set({ isBusy: false });
    }
  },
  signInWithGitHub: async () => {
    try {
      set({ isBusy: true });
      createToast("Signing in with Github...", {
        timeout: 15000,
        category: "sign-in",
      });

      const maybeSignInResponse = await signIn("github");

      console.log(maybeSignInResponse);
    } catch (e) {
      createToast("Signing in...", {
        timeout: 15000,
        category: "sign-in",
      });

      console.error(e);
    } finally {
      set({ isBusy: true });
    }
  },
  setSession: (session: Session) => set({ session }),
}));
