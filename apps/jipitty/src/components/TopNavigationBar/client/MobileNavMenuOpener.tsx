"use client"

import { useMobileNavStore } from "@/lib/features/mobile-nav/state"
import { Bars3Icon } from "@heroicons/react/24/outline"

export function MobileNavMenuOpener() {
	const { open } = useMobileNavStore()
	return (
		<button
			type="button"
			onClick={open}
			className="-m-2.5 shrink-0 p-2.5 text-white focus-visible:outline-blue-600 lg:hidden"
		>
			<span className="sr-only">Open sidebar</span>
			<Bars3Icon className="h-6 w-6" aria-hidden="true" />
		</button>
	)
}
