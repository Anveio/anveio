import { Sidebar } from "@/components/Sidebar"
import { TopNavigationBar } from "@/components/TopNavigationBar"
import { NEXT_AUTH_HANDLER_OPTIONS } from "@/lib/features/next-auth"
import "@/lib/features/toasts/toast-styles.css"
import { Analytics } from "@vercel/analytics/react"
import { getServerSession } from "next-auth"
import "./globals.css"
import { getAllConversationsForUserByEmailAddress } from "@/lib/db/utils"
import { ConversationRow } from "@/lib/db"

export const metadata = {
	title: "Jipitty - AI Chat, AI Art, AI Insights"
}

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getServerSession(NEXT_AUTH_HANDLER_OPTIONS)

	let conversations: ConversationRow[] = []

	if (session && session.user?.email) {
		conversations = await getAllConversationsForUserByEmailAddress(session.user.email)
	}

	return (
		<html lang="en" className={`bg-white`}>
			<body>
				<div className="static min-h-[100dvh] lg:grid lg:grid-cols-[15rem_1fr]">
					<Sidebar session={session} conversations={conversations}/>
					<div className="grid grid-rows-[min-content_1fr] lg:grid-rows-1">
						<TopNavigationBar session={session} />
						{children}
					</div>
				</div>
				<Analytics />
			</body>
		</html>
	)
}
