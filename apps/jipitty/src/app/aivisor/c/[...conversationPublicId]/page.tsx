import ChatFeed from "@/components/Aivisor/ChatFeed"
import { Routes } from "@/lib/constants/routes"
import { getMessagesForConversationByPublicIdAndUserEmail } from "@/lib/db/utils"
import { NEXT_AUTH_HANDLER_OPTIONS } from "@/lib/features/next-auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import AivisorConversationNotFound from "./404"

export default async function AivisorConversation(props: React.PropsWithChildren<{
    params: {
        conversationPublicId: string[]
    }
}>) {
    const session = await getServerSession(NEXT_AUTH_HANDLER_OPTIONS)

    if (!session) {
        return redirect(Routes.AIVISOR)
    }

    if (!session.user) {
        return redirect(Routes.AIVISOR)
    }

    if(!session.user.email) {
        return redirect(Routes.AIVISOR)
    }

    const publicIdForConversation = props.params.conversationPublicId[0]

    if (!publicIdForConversation) {
        return redirect(Routes.AIVISOR)
    }

	const messages = await getMessagesForConversationByPublicIdAndUserEmail(props.params.conversationPublicId[0], session.user.email)

    if (!messages) {
        return <AivisorConversationNotFound />
    }

	return (
		<ChatFeed session={session}  initialMessages={messages} conversatioPublicId={publicIdForConversation}/>
	)
}