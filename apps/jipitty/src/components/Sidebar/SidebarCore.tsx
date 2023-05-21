import { Routes, TEAMS } from "@/lib/constants/routes"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import clsx from "clsx"
import { Session } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import CompanyLogoWhite from "../../../public/company-logo-white.svg"
import { WithSessionOnly } from "../WithSessionOnly"
import {
	AivisorLink,
	SidebarTeamLinks,
	SidebarTopLevelNavLinks
} from "./SidebarNavLink"
import { ProfileButton } from "./SidebarButtons"
import { SignUpButton } from "@clerk/clerk-react"

interface Props {
	session: Session | null
	className?: string
	closeOnNavChange?: boolean
	conversations?: {
		title: string | null
		public_id: string
	}[]
}

export function SidebarCore(props: Props) {
	console.log(props.conversations?.length, "L")

	return (
		<div
			className={clsx(
				"fixed top-0 z-40 flex h-[100dvh] h-full w-[15rem] flex-col bg-gray-900",
				props.className
			)}
		>
			<div className="flex grow flex-col gap-y-5 overflow-y-auto  px-6 pb-4 ring-1 ring-white/10">
				<div className="flex h-16 shrink-0 items-center">
					<Link href="/">
						<Image className="h-8 w-auto" src={CompanyLogoWhite} alt="" />
					</Link>
				</div>
				<nav className="flex flex-1 flex-col">
					<ul role="list" className="flex flex-1 flex-col gap-y-0">
						<li>
							<AivisorLink />
							{props.conversations && props.conversations.length > 0 ? (
								<ul className="pb-3 pl-5 pt-1 text-white">
									{props.conversations.map((conversation) => (
										<li key={conversation.public_id}>
											<Link
												className=""
												href={Routes.AIVISOR + "/c/" + conversation.public_id}
											>
												{conversation.title || "Untitled"}
											</Link>
										</li>
									))}
								</ul>
							) : null}
						</li>
						<SidebarTopLevelNavLinks />
						<WithSessionOnly session={props.session}>
							<li>
								<div className="mt-4 pl-2 text-xs font-semibold leading-6 text-indigo-200">
									Your teams
								</div>
								<SidebarTeamLinks teams={TEAMS} />
							</li>
						</WithSessionOnly>
					</ul>
				</nav>
			</div>

			<div className="mt-auto grid gap-3 bg-inherit text-indigo-200">
				<SignedOut>
					<Link href={Routes.LOGIN}>Log in</Link>
					<Link href={Routes.SIGNUP}>Sign up</Link>
				</SignedOut>
				<SignedIn>
					<ProfileButton />
				</SignedIn>
			</div>
		</div>
	)
}
