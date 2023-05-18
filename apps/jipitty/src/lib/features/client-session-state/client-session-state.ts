"use client"

import { Session } from "next-auth"
import { create, createStore } from "zustand"
import { createToast } from "../toasts"
import { signIn, signOut } from "next-auth/react"

/**
 * Zustand store for client session state
 */

export interface IClientSessionState {
	session: Session | null
	isBusy: boolean
	setSession: (session: IClientSessionState['session']) => void
	signInWithGoogle: () => Promise<void>
	signInWithGitHub: () => Promise<void>
	signOut: () => Promise<void>
}

export const useClientSessionState = create<IClientSessionState>((set) => ({
	session: null,
	isBusy: false,
	signInWithGoogle: async () => {
		console.log("IN HERE")
		try {
			set({ isBusy: true })
			createToast("Signing in with Google...", {
				timeout: 15000,
				category: "sign-in"
			})

			const maybeSignInResponse = await signIn("google", {
				redirect: false
			})

			createToast("Signed in =] Redirecting shortly...", {
				timeout: 3000,
				category: "sign-in"
			})

			console.log(maybeSignInResponse)
		} catch (e) {
			createToast("Sign in failed.", {
				timeout: 15000,
				category: "sign-in",
				type: "error"
			})

			console.error(e)
		} finally {
			set({ isBusy: false })
		}
	},
	signInWithGitHub: async () => {
		try {
			set({ isBusy: true })
			createToast("Signing in with Github...", {
				timeout: 15000,
				category: "sign-in"
			})

			const maybeSignInResponse = await signIn("github")

			console.log(maybeSignInResponse)
		} catch (e) {
			createToast("Signing in...", {
				timeout: 15000,
				category: "sign-in"
			})

			console.error(e)
		} finally {
			set({ isBusy: true })
		}
	},
	signOut: async () => {
		createToast("Signing out...", {
			category: 'sign-out'
		})

		set({ isBusy: true })

		await signOut()

        set({ session: null })
        createToast("You have been logged out of your account.", {
			category: 'sign-out'
		})
	},
	setSession: (session) => set({ session })
}))
