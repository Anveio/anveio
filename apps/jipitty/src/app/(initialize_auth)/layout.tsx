import {
	PrettyFloatingBlob,
	PrettyFloatingBlob2
} from "@/components/PrettyFloatingBlob"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	const { userId } = auth()

	if (!userId) {
		return redirect("/")
	}

	return (
		<>
			<PrettyFloatingBlob />
			<PrettyFloatingBlob2 />
			<div className="flex flex-1 flex-col justify-center px-6 py-8 lg:px-8">
				{children}
			</div>
		</>
	)
}
