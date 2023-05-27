"use client"

import { Routes } from "@/lib/constants/routes"
import { ConversationRow } from "@/lib/db"
import { generateConversationTitle } from "@/lib/utils/aivisor-client"
import Link from "next/link"
import * as React from "react"

interface Props {
	conversation: Pick<ConversationRow, "title" | "publicId">
}
export default function SidebarConversationListItem(props: Props) {
	const [titleToDisplay, setTitleToDisplay] = React.useState(
		props.conversation.title || ""
	)

	React.useEffect(() => {
		async function handleGenerateTitleIfNone() {
			console.log(props.conversation, "conversation")

			if (
				!props.conversation.title &&
				!titleToDisplay &&
				props.conversation.publicId
			) {
				const resultReader = await generateConversationTitle({
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

		handleGenerateTitleIfNone()
	}, [props.conversation.title, props.conversation.publicId, titleToDisplay])

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
