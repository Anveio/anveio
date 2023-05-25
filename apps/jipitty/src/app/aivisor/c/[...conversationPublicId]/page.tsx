import ChatFeed from "@/components/Aivisor/ChatFeed"
import { Routes } from "@/lib/constants/routes"
import { getMessagesForConversationByPublicIdUserId } from "@/lib/db/utils"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import AivisorConversationNotFound from "./404"

export default async function AivisorConversation(props: {
	params: {
		conversationPublicId: string
	}
}) {
	const { userId, user } = auth()

	if (!userId || !user) {
		return redirect("/")
	}

	const publicIdForConversation = props.params?.conversationPublicId

	if (!publicIdForConversation) {
		return redirect(Routes.AIVISOR)
	}

	try {
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
				profileImageSrc={user.profileImageUrl}
			/>
		)
	} catch (error) {
		return redirect(Routes.AIVISOR)
	}
}
