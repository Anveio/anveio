import ChatFeed from "@/components/Aivisor/ChatFeed"
import { Routes } from "@/lib/constants/routes"
import { getMessagesForConversationByPublicIdUserId } from "@/lib/db/utils"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import AivisorConversationNotFound from "./404"

export default async function AivisorConversation(props: {
	params: {
		conversationPublicId: string[]
	}
}) {
	const { userId, user } = auth()

	console.log(props.params, "Params")

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

		if (!data) {
			return <AivisorConversationNotFound />
		}

		console.log(data.messages)

		return (
			<ChatFeed
				userId={userId}
				initialMessages={data.messages}
				conversatioPublicId={publicIdForConversation}
				profileImageSrc={user?.profileImageUrl}
			/>
		)
	} catch (error) {
		return redirect(Routes.AIVISOR)
	}
}
