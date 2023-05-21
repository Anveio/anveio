import { Routes } from "@/lib/constants/routes"
import { BellIcon } from "@heroicons/react/24/outline"
import { Session } from "next-auth"
import Link from "next/link"
import { WithSessionOnly } from "../WithSessionOnly"
import { TopNavigationBarMenu } from "./client/Menu"
import { MobileNavMenuOpener } from "./client/MobileNavMenuOpener"
import { SearchField } from "./client/SearchField"

interface Props {
	session: Session | null
}

export function TopNavigationBar(props: Props) {
	return (
		<div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden lg:w-full lg:px-8">
			<MobileNavMenuOpener />
			{/* Separator */}
			<div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />
			<div>
				<Link href={Routes.SIGNUP}>Sign up</Link>
				<Link href={Routes.SIGNUP}>Log in</Link>
			</div>
		</div>
	)
}
