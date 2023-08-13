import ChatFeed from "@/components/Aivisor/ChatFeed"
import { Routes } from "@/lib/constants/routes"
import { getMessagesForConversationByPublicIdUserId } from "@/lib/db/queries"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import AivisorConversationNotFound from "./404"

export default async function AivisorConversation(props: {
	params: {
		conversationPublicId: string[]
	}
}) {
	const { userId, user } = auth()

	if (!userId) {
		return redirect("/")
	}

	const publicIdForConversation = props.params?.conversationPublicId[0]

	if (!publicIdForConversation) {
		return redirect(Routes.AIVISOR)
	}

	try {
		const data = await getMessagesForConversationByPublicIdUserId(
			publicIdForConversation,
			userId
		)
		console.log("🚀 ~ file: page.tsx:30 ~ data:", data)

		if (!data) {
			return <AivisorConversationNotFound />
		}


		return (
			<ChatFeed
				userId={userId}
				initialMessages={data.messages}
				conversationPublicId={publicIdForConversation}
				profileImageSrc={user?.profileImageUrl}
			/>
		)
	} catch (error) {
		return redirect(Routes.AIVISOR)
	}
}
