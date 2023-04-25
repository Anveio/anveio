"use client";

import { signIn } from "next-auth/react";
import { createToast } from "../features/toasts";

export const signInWithGitHub = async () => {
  try {
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
  }
};

export const signInWithGoogle = async () => {
  try {
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
  }
};
