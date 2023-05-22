import { SignedIn } from "@clerk/nextjs"

export default async function ProfileLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<SignedIn>
			<main className="h-full bg-white">
				<div className="sm:px6 mx-auto max-w-7xl px-3 lg:px-8">{children}</div>
			</main>
		</SignedIn>
	)
}
