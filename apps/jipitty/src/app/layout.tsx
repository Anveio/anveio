import { Sidebar } from "@/components/Sidebar"
import { TopNavigationBar } from "@/components/TopNavigationBar"
import { ConversationRow } from "@/lib/db"
import "@/lib/features/toasts/toast-styles.css"
import { ClerkProvider, auth } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
import { cn } from "@/lib/cn"
import { inter } from "@/fonts"
import { getAllConversationsForUserByUserId } from "@/lib/db/utils"

export const metadata = {
	title: "Jipitty - AI Chat, AI Art, AI Insights"
}

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = auth()

	const conversations = session.userId
		? await getAllConversationsForUserByUserId(session.userId)
		: []

	return (
		<ClerkProvider>
			<html lang="en" className={cn(`bg-white`, inter.className)}>
				<body>
					<div className="static lg:grid lg:grid-cols-[15rem_1fr]">
						<Sidebar conversations={conversations} />
						<div className="grid min-h-[100dvh] grid-rows-[min-content_1fr] lg:grid-rows-1">
							<TopNavigationBar />
							{children}
						</div>
					</div>
					<Analytics />
				</body>
			</html>
		</ClerkProvider>
	)
}
