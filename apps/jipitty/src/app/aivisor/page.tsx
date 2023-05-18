import ChatFeed from "@/components/Aivisor/ChatFeed"
import { NEXT_AUTH_HANDLER_OPTIONS } from "@/lib/features/next-auth"
import { getServerSession } from "next-auth"

export default async function Aivisor() {
	const session = await getServerSession(NEXT_AUTH_HANDLER_OPTIONS)

	if (!session) {
		return null
	}

	return (
		<main>
			<div className="flex">
				<div className=" who knows"></div>
				<div className="align-self-end">
					<ChatFeed session={session} initialMessages={[]} conversatioPublicId={null} />
				</div>
			</div>
		</main>
	)
}
