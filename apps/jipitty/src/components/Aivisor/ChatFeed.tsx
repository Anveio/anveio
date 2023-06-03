"use client"

import { getMessagesForConversationByPublicIdUserId } from "@/lib/db/queries"
import { motion } from "framer-motion"
import Image from "next/image"
import twitterIcon from "../../../public/images/icons/send-message-icon.svg"
import { AssistantMessageCard } from "./AssistantMessageCard"
import { ResponseCard } from "./ResponseCard"
import { UserMessageCard } from "./UserMessageCard"
import { useChat } from "./use-chat"

export default function ChatFeed(props: {
	userId: string
	profileImageSrc?: string
	initialMessages: Awaited<
		ReturnType<typeof getMessagesForConversationByPublicIdUserId>
	>["messages"]
	conversationPublicId: string | null
}) {
	const { state, updateDraftMessage, uploadMessage } = useChat(
		props.userId,
		props.initialMessages,
		props.conversationPublicId,
		(generatedConversationId) => {
			window.history.pushState({}, "", `/aivisor/c/${generatedConversationId}`)
		}
	)

	return (
		<div className="w-full">
			<div className="flex-1 flex-grow">
				{state.previousMessages.length > 0 ? (
					state.previousMessages.map((message) => {
						return message.senderType === "user" ? (
							<UserMessageCard
								key={message.publicId}
								message={message}
							></UserMessageCard>
						) : (
							<AssistantMessageCard key={message.publicId} message={message} />
						)
					})
				) : (
					<div>Chat history will appear here</div>
				)}
				{state.streamedReplyFromAi ? (
					<ResponseCard responseString={state.streamedReplyFromAi} />
				) : null}
			</div>
			<form
				className="max-w-24 absolute bottom-4 left-0 w-full px-32"
				onSubmit={(e) => {
					e.preventDefault()
					uploadMessage()
				}}
			>
				{/* <Select value={state.selectedModel}>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Model" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Model</SelectLabel>
									<SelectItem value={SUPPORTED_LLM_MODEL.THREE_POINT_FIVE}>
										GPT-3.5
									</SelectItem>
									<SelectItem disabled value={"gpt-4"}>
										GPT-4
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select> */}
				<motion.div
					className="relative grid h-auto  grid-cols-[1fr_28px] rounded-md border border-black/10 bg-white px-2 py-4 shadow-[0_0_10px_rgba(0,0,0,0.10)] 
					dark:border-gray-900/50 dark:bg-gray-700 dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]"
				>
					<motion.textarea
						style={{
							resize: "none",
							overflow: "auto",
							overflowWrap: "break-word",
							height: "auto"
						}}
						className="w-full resize-none border-0 bg-transparent px-2 py-0 focus:ring-0 focus-visible:ring-0 dark:bg-transparent "
						value={state.messageDraft}
						onChange={(e) => {
							updateDraftMessage(e.target.value)
						}}
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
