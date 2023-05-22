"use client"
import { UserButton } from "@clerk/nextjs"

import { Routes } from "@/lib/constants/routes"
import { Cog6ToothIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import Link from "next/link"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

export function ProfileButton() {
	const pathName = usePathname()
	return (
		<motion.div
			className={clsx(
				"grid grid-cols-[1fr_min-content] divide-x divide-white/10 ring-1 ring-white/10 group-hover:text-white"
			)}
		>
			<Link href={Routes.PROFILE}>
				<UserButton
					userProfileUrl={Routes.PROFILE}
					userProfileMode="navigation"
					showName
					appearance={{
						elements: {
							rootBox: "flex items-center p-2",
							userButtonBox: "flex-row-reverse",
							userButtonOuterIdentifier: "text-current"
						},
						layout: {}
					}}
				/>
			</Link>
			<Link
				href={Routes.SETTINGS}
				className={clsx(
					"group flex items-center gap-x-3 p-4 text-lg font-semibold leading-6 hover:text-white lg:text-sm",
					pathName === Routes.SETTINGS ? "bg-indigo-600" : "hover:bg-gray-800"
				)}
			>
				<Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
				<span className="sr-only">Settings</span>
			</Link>
		</motion.div>
	)
}
