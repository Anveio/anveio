"use client"

import { Routes, TOP_LEVEL_NAVIGATION } from "@/lib/constants/routes"
import { useMobileNavStore } from "@/lib/features/mobile-nav/state"
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function SidebarTopLevelNavLinks() {
	const pathname = usePathname()
	const { close } = useMobileNavStore()

	return (
		<>
			{TOP_LEVEL_NAVIGATION.map((item) => {
				return (
					<li key={item.name}>
						<Link
							href={item.href}
							onClick={close}
							className={clsx(
								"text-gray-400 hover:bg-gray-800 hover:text-white",
								"group flex gap-x-3 rounded-md p-2 text-lg font-semibold leading-6 lg:text-sm"
							)}
						>
							<item.icon
								className={clsx("h-6 w-6 shrink-0")}
								aria-hidden="true"
							/>
							{item.name}
						</Link>
					</li>
				)
			})}
		</>
	)
}

interface SidebarTeamLinkProps {
	teams: { href: string; name: string; initial: string }[]
}

export function SidebarTeamLinks(props: SidebarTeamLinkProps) {
	const pathname = usePathname()
	const { close } = useMobileNavStore()
	return (
		<ul role="list" className="-mx-2 mt-2 space-y-1">
			{props.teams.map((team) => (
				<li key={team.name}>
					<Link
						href={team.href}
						onClick={close}
						className={clsx(
							pathname === team.href
								? "bg-indigo-700 text-white"
								: "text-indigo-200 hover:bg-indigo-700 hover:text-white",
							"group ml-4 flex gap-x-3 rounded-md p-2 text-lg font-semibold leading-6 lg:text-sm"
						)}
					>
						<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
							{team.initial}
						</span>
						<span className="truncate">{team.name}</span>
					</Link>
				</li>
			))}
		</ul>
	)
}

export const AivisorLink = () => {
	const { close } = useMobileNavStore()
	return (
		<Link
			href={Routes.AIVISOR}
			onClick={close}
			className={
				"group flex gap-x-3 rounded-md p-2 text-lg font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white lg:text-sm"
			}
		>
			<ChatBubbleBottomCenterIcon
				className={clsx("h-6 w-6 shrink-0")}
				aria-hidden="true"
			/>
			Aivisor
		</Link>
	)
}
