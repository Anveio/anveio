"use client"

import { signOut } from "next-auth/react"
import Image from "next/image"
import SignInWithGoogleIcon from "../../../public/sign-in-with-google-light-enabled.svg"

import { Routes } from "@/lib/constants/routes"
import { Cog6ToothIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import { Session } from "next-auth"
import Link from "next/link"

import { useClientSessionState } from "@/lib/features/client-session-state/client-session-state"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useMobileNavStore } from "@/lib/features/mobile-nav/state"
import React from "react"
export function SignInWithGitHubButton() {
	const { signInWithGitHub, isBusy } = useClientSessionState()
	return (
		<button
			disabled={isBusy}
			className="flex w-full items-center justify-start gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] disabled:animate-pulse"
			onClick={signInWithGitHub}
		>
			<svg
				className="h-5 w-5"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<path
					fillRule="evenodd"
					d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
					clipRule="evenodd"
				/>
			</svg>

			<span className="text-sm font-semibold leading-6">
				Sign in with GitHub
			</span>
		</button>
	)
}

export function SignInWithGoogleButton() {
	const { signInWithGoogle, isBusy } = useClientSessionState()
	return (
		<button
			disabled={isBusy}
			className="flex w-full items-center justify-start gap-3 rounded-md bg-white px-3 py-1.5 text-white drop-shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] disabled:animate-pulse"
			onClick={signInWithGoogle}
		>
			<Image alt="" height={20} width={20} src={SignInWithGoogleIcon}></Image>
			<span className="text-sm font-semibold leading-6 text-black">
				Sign in with Google
			</span>
		</button>
	)
}

export function SignOutButton() {
	return (
		<button
			className="flex items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
			onClick={async () => {
				await signOut()
			}}
		>
			<span className="text-sm font-semibold leading-6">Log out</span>
		</button>
	)
}

export function ProfileButton(props: { session: Session }) {
	const pathName = usePathname()
	const { close } = useMobileNavStore()
	return (
		<motion.div
			className={clsx(
				"grid grid-cols-[1fr_min-content] divide-x divide-white/10 ring-1 ring-white/10"
			)}
		>
			<Link
				onClick={close}
				href={Routes.PROFILE}
				className={clsx(
					"flex items-center gap-x-4 px-4 py-3 text-sm font-semibold leading-6 text-white ",
					pathName === Routes.PROFILE ? "bg-indigo-600" : "hover:bg-gray-800"
				)}
			>
				<Image
					width={32}
					height={32}
					className="h-8 w-8 rounded-full"
					src={props.session.user?.image ?? ""}
					alt=""
				/>
				<span className="sr-only">Your profile</span>
				<span aria-hidden="true">{props.session.user?.name ?? "Profile"}</span>
			</Link>
			<Link
				href={Routes.SETTINGS}
				onClick={close}
				className={clsx(
					"group flex items-center gap-x-3 p-4 text-lg font-semibold leading-6 text-indigo-200 hover:text-white lg:text-sm",
					pathName === Routes.SETTINGS ? "bg-indigo-600" : "hover:bg-gray-800"
				)}
			>
				<Cog6ToothIcon
					className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
					aria-hidden="true"
				/>
				<span className="sr-only">Settings</span>
			</Link>
		</motion.div>
	)
}

export const AuthButtons = (props: { session: Session | null }) => {
	const { setSession } = useClientSessionState()

	React.useEffect(() => {
		setSession(props.session)
	}, [props.session])

	return (
		<AnimatePresence>
			{props.session ? (
				<ProfileButton session={props.session} />
			) : (
				<motion.ul className="grid grid-cols-1 gap-4 px-6 py-6">
					<SignInWithGoogleButton />
					<SignInWithGitHubButton />{" "}
				</motion.ul>
			)}
		</AnimatePresence>
	)
}
