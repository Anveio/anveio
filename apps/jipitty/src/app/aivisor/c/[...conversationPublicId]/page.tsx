import ChatFeed from "@/components/Aivisor/ChatFeed"
import { Routes } from "@/lib/constants/routes"
import { getMessagesForConversationByPublicIdAndUserEmail } from "@/lib/db/utils"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import AivisorConversationNotFound from "./404"

export default async function AivisorConversation(
	props: React.PropsWithChildren<{
		params: {
			conversationPublicId: string[]
		}
	}>
) {
	const { userId } = auth()

	if (!userId) {
		return redirect("/")
	}

	const publicIdForConversation = props.params.conversationPublicId[0]

	if (!publicIdForConversation) {
		return redirect(Routes.AIVISOR)
	}

	const messages = await getMessagesForConversationByPublicIdAndUserEmail(
		props.params.conversationPublicId[0],
		userId
	)

	if (!messages) {
		return <AivisorConversationNotFound />
	}

	return (
		<ChatFeed
			userId={userId}
			initialMessages={messages}
			conversatioPublicId={publicIdForConversation}
		/>
	)
}
