import { Routes } from "@/lib/constants/routes"
import Link from "next/link"
import { Button } from "../ShadCdn/button"
import { MobileNavMenuOpener } from "./client/MobileNavMenuOpener"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export function TopNavigationBar() {
	return (
		<div className="sticky top-0 z-40 flex grid h-16 shrink-0 grid-cols-2 items-center gap-x-4 border-b border-gray-200 bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden lg:w-full lg:px-8">
			<div className="grid grid-cols-[min-content_1px]">
				<MobileNavMenuOpener />
				{/* Separator */}
				<div className="ml-3 h-6 bg-white/10" aria-hidden="true" />
			</div>
			<SignedOut>
				<div className="grid max-w-sm grid-cols-2 gap-3 justify-self-end">
					<Link href={Routes.LOGIN}>
						<Button variant={"secondary"} className="h-full w-full">
							Log in
						</Button>
					</Link>
					<Link href={Routes.SIGNUP}>
						<Button
							variant={"default"}
							className="h-full w-full bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Sign up
						</Button>
					</Link>
				</div>
			</SignedOut>
			<SignedIn>
				<UserButton
					userProfileUrl={Routes.PROFILE}
					userProfileMode="navigation"
					appearance={{
						elements: {
							rootBox: "flex items-center p-2 justify-self-end",
							userButtonOuterIdentifier: "text-current"
						},
						layout: {}
					}}
				/>
			</SignedIn>
		</div>
	)
}
