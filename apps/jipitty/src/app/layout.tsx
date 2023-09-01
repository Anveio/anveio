import { Sidebar } from "@/components/Sidebar"
import { TopNavigationBar } from "@/components/TopNavigationBar"
import { inter } from "@/fonts"
import { cn } from "@/lib/cn"
import { getAllConversationsForUserByUserId } from "@/lib/db/queries"
import "@/lib/features/toasts/toast-styles.css"
import { ClerkProvider, auth } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"

export const metadata = {
	title: "Jipitty - AI Chat, AI Art, AI Insights"
}

export default async function RootLayout(props: React.PropsWithChildren<{}>,
	params: Record<string, string>) {
	console.log("🚀 ~ file: layout.tsx:17 ~ params:", params)
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
							{props.children}
						</div>
					</div>
					<Analytics />
				</body>
			</html>
		</ClerkProvider>
	)
}
