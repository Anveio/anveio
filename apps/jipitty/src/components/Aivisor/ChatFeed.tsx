"use client"

import { getMessagesForConversationByPublicIdUserId } from "@/lib/db/queries"
import { convertDbMessageToVercelAiMessage } from "@/lib/utils/aivisor-client/common"
import { createConversationResponseBodySchema } from "@/lib/utils/aivisor-client/schemas"
import { Message, UseChatHelpers, useChat } from "ai/react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import * as React from "react"
import twitterIcon from "../../../public/images/icons/send-message-icon.svg"
import { AssistantMessageCard } from "./AssistantMessageCard"
import { UserMessageCard } from "./UserMessageCard"

export default function ChatFeed(props: {
	userId: string
	profileImageSrc?: string
	initialMessages: Awaited<
		ReturnType<typeof getMessagesForConversationByPublicIdUserId>
	>["messages"]
	conversationPublicId: string | null
}) {
	const { push } = useRouter()

	const lastMessageRef = React.useRef<Message | null>(null)
	const conversationPublicIdRef = React.useRef<string | null>(
		props.conversationPublicId
	)

	const [messageToSend, setMessagesToSend] = React.useState<Message>(
		convertDbMessageToVercelAiMessage(
			props.initialMessages[props.initialMessages.length - 1]
		)
	)

	const { messages, input, handleInputChange, handleSubmit } = useChat({
		initialMessages: props.initialMessages.map(
			convertDbMessageToVercelAiMessage
		),
		api: "/api/v2/aivisor/conversations/send-message",
		body: {
			message: messageToSend,
			conversationPublicId: conversationPublicIdRef.current
		},
		id: conversationPublicIdRef.current ?? undefined
	})

	React.useEffect(() => {
		setMessagesToSend(messages[messages.length - 0])
	}, [messages])

	React.useEffect(() => {
		lastMessageRef.current = messages[messages.length - 1]
	}, [messages])

	return (
		<div className="w-full">
			<div className="flex-1 flex-grow">
				{messages.length > 0 ? (
					messages.map((message) => {
						return message.role === "user" ? (
							<UserMessageCard
								key={message.id}
								message={message}
							></UserMessageCard>
						) : (
							<AssistantMessageCard key={message.id} message={message} />
						)
					})
				) : (
					<div>Chat history will appear here</div>
				)}
			</div>
			<form
				className="max-w-24 absolute bottom-4 left-0 w-full px-32"
				onSubmit={async (e) => {
					e.preventDefault()

					if (!conversationPublicIdRef.current) {
						const res = await fetch(
							"/api/v2/aivisor/conversations/create-conversation",
							{
								method: "POST",
								credentials: "include"
							}
						)

						const unsafeResponseBody = await res.json()

						const parsedSafeResponseBody =
							createConversationResponseBodySchema.parse(unsafeResponseBody)

						conversationPublicIdRef.current =
							parsedSafeResponseBody.conversationId

						push(`/aivisor/c/${parsedSafeResponseBody.conversationId}`)
					}

					handleSubmit(e)
				}}
			>
				<motion.div
					className="relative grid h-auto grid-cols-[1fr_28px] rounded-md border border-black/10 bg-white px-2 py-4 shadow-[0_0_10px_rgba(0,0,0,0.10)] 
					dark:border-gray-900/50 dark:bg-gray-700 dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]"
				>
					<motion.input
						required
						style={{
							resize: "none",
							overflow: "auto",
							overflowWrap: "break-word",
							height: "auto"
						}}
						className="w-full resize-none border-0 bg-transparent px-2 py-0 focus:ring-0 focus-visible:ring-0 dark:bg-transparent "
						value={input}
						onChange={handleInputChange}
					/>
					<button className="sticky bottom-1.5 end-[2%] h-[24px] w-[24px] self-end rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-gray-900 enabled:dark:hover:text-gray-400 dark:disabled:hover:bg-transparent">
						<Image
							className="h-full w-full"
							alt="Send Message"
							src={twitterIcon}
						></Image>
					</button>
				</motion.div>
			</form>
		</div>
	)
}

type UseChatOptions =
	| {
			// ... <original UseChatOptions
	  }
	| ((valueState: UseChatHelpers) => UseChatOptions)
