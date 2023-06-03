"use client"

import { Routes } from "@/lib/constants/routes"
import { ConversationRow } from "@/lib/db"
import { AivisorClient } from "@/lib/utils/aivisor-client"
import Link from "next/link"
import * as React from "react"

interface Props {
	shouldAutomaticallyGenerateTitle: boolean
	conversation: Pick<ConversationRow, "title" | "publicId">
}

export default function SidebarConversationListItem(props: Props) {
	const [titleToDisplay, setTitleToDisplay] = React.useState(
		props.conversation.title || ""
	)

	React.useEffect(() => {
		async function handleGenerateTitleIfNone() {
			if (
				!props.conversation.title &&
				!titleToDisplay &&
				props.conversation.publicId
			) {
				console.log("Generating title for conversation: ", props.conversation)

				const { messages } =
					await AivisorClient.v2.conversations.getConversation({
						conversationPublicId: props.conversation.publicId
					})

				if (messages.length < 2) {
					console.log("No messages found for conversation")
					return
				}

				const resultReader =
					await AivisorClient.v2.conversations.generateConversationTitle({
						prompt: messages[0].content,
						response: messages[1].content,
						conversationPublicId: props.conversation.publicId
					})

				try {
					while (true) {
						const { done, value } = await resultReader.read()
						if (done) break

						if (value) {
							console.log("Received chunk", value)
							setTitleToDisplay((prev) => prev + value.toString())
						}
					}
				} catch (e) {
					throw e
				} finally {
					resultReader.releaseLock()
				}
			}
		}

		if (props.shouldAutomaticallyGenerateTitle) {
			handleGenerateTitleIfNone()
		}
	}, [
		props.shouldAutomaticallyGenerateTitle,
		props.conversation.title,
		props.conversation.publicId,
		titleToDisplay
	])

	return (
		<li>
			<Link
				className="overflow-hidden whitespace-normal text-sm shadow-md"
				href={Routes.AIVISOR + "/c/" + props.conversation.publicId}
			>
				<span className="truncate-non">
					{titleToDisplay || "Untitled Conversation"}
				</span>
			</Link>
		</li>
	)
}
