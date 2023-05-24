import ChatFeed from "@/components/Aivisor/ChatFeed"
import { Routes } from "@/lib/constants/routes"
import { getMessagesForConversationByPublicIdUserId } from "@/lib/db/utils"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import AivisorConversationNotFound from "./404"

// props: React.PropsWithChildren<{
// 	params: {
// 		conversationPublicId: string
// 	}
// }>

export default async function AivisorConversation(
	
) {
	const { userId } = auth()

	if (!userId) {
		return redirect("/")
	}

	const publicIdForConversation = ""

	if (!publicIdForConversation) {
		return redirect(Routes.AIVISOR)
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
