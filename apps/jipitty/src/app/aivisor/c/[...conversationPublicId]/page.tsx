import ChatFeed from "@/components/Aivisor/ChatFeed"
import { Routes } from "@/lib/constants/routes"
import { getMessagesForConversationByPublicIdUserId } from "@/lib/db/utils"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import AivisorConversationNotFound from "./404"

export default async function AivisorConversation() {
	const publicIdForConversation = "1"

	if (!publicIdForConversation) {
		return redirect(Routes.AIVISOR)
	}

	const { userId } = auth()

	if (!userId) {
		return redirect("/")
	}

	const data = await getMessagesForConversationByPublicIdUserId(
		publicIdForConversation,
		userId
	)

	if (!data) {
		return <AivisorConversationNotFound />
	}

	return (
		<ChatFeed
			userId={userId}
			initialMessages={data.messages}
			conversatioPublicId={publicIdForConversation}
		/>
	)
}
