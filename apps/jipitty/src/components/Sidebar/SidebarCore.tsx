import { Routes, TEAMS } from "@/lib/constants/routes"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import CompanyLogoWhite from "../../../public/company-logo-white.svg"
import { Button } from "../ShadCdn/button"
import { ProfileButton } from "./SidebarButtons"
import {
	AivisorLink,
	SidebarTeamLinks,
	SidebarTopLevelNavLinks
} from "./SidebarNavLink"

interface Props {
	className?: string
	closeOnNavChange?: boolean
	conversations?: {
		title: string | null
		public_id: string
	}[]
}

export function SidebarCore(props: Props) {
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
						<SignedIn>
							<li>
								<div className="mt-4 pl-2 text-xs font-semibold leading-6 text-indigo-200">
									Your teams
								</div>
								<SidebarTeamLinks teams={TEAMS} />
							</li>
						</SignedIn>
					</ul>
				</nav>
			</div>

			<div className="mt-auto grid gap-3 bg-inherit text-indigo-200">
				<SignedOut>
					<div className="mb-2 grid grid-cols-2 gap-3">
						<Link href={Routes.LOGIN}>
							<Button
								variant={"secondary"}
								className="w-full bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Log in
							</Button>
						</Link>
						<Link href={Routes.SIGNUP}>
							<Button
								variant={"default"}
								className="w-full bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Sign up
							</Button>
						</Link>
					</div>
				</SignedOut>
				<SignedIn>
					<ProfileButton />
				</SignedIn>
			</div>
		</div>
	)
}
