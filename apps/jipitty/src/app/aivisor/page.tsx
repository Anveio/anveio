import { ChatWindow } from "@/components/Aivisor"
import ChatFeed from "@/components/Aivisor/ChatFeed"
import { NEXT_AUTH_HANDLER_OPTIONS } from "@/lib/features/next-auth"
import { getServerSession } from "next-auth"

export default async function Aivisor() {
	console.log("in Aivisor page")
	const session = await getServerSession(NEXT_AUTH_HANDLER_OPTIONS)

	if (!session) {
		return null
	}

	return <ChatFeed session={session} />
}
