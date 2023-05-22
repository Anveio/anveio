import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function AivisorLayout(
	props: React.PropsWithChildren<{
		params?: {
			conversationPublicId: string
		}
	}>
) {
	const { userId } = auth()

	if (!userId) {
		return redirect("/")
	}

	return (
		<main className="h-full bg-gray-800">
			<div className="sm:px6 mx-auto max-w-7xl px-3 lg:px-8">
				<header className="tborder-b border-white/5 py-3">
					<div className="md:flex md:items-center md:justify-between">
						<div className="min-w-0 flex-1">
							<h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
								Aivisor
							</h2>
						</div>
					</div>
				</header>
				{props.children}
			</div>
		</main>
	)
}
