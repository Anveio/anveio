import { Sidebar } from "@/components/Sidebar"
import { TopNavigationBar } from "@/components/TopNavigationBar"
import { ConversationRow } from "@/lib/db"
import { NEXT_AUTH_HANDLER_OPTIONS } from "@/lib/features/next-auth"
import "@/lib/features/toasts/toast-styles.css"
import { ClerkProvider } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/react"
import { getServerSession } from "next-auth"
import "./globals.css"
import { cn } from "@/lib/utils"
import { inter } from "@/fonts"

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
	return (
		<ClerkProvider>
			<html lang="en" className={cn(`bg-white`, inter.className)}>
				<body>
					<div className="static min-h-[100dvh] lg:grid lg:grid-cols-[15rem_1fr]">
						<Sidebar session={session} conversations={conversations} />
						<div className="grid grid-rows-[min-content_1fr] lg:grid-rows-1">
							<TopNavigationBar session={session} />
							{children}
						</div>
					</div>
					<Analytics />
				</body>
			</html>
		</ClerkProvider>
	)
}
