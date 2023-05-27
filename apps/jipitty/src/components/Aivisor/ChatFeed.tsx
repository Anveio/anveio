"use client"

import { SUPPORTED_LLM_MODEL } from "@/lib/constants"
import { getConversationResponseBodySchema } from "@/lib/utils/aivisor-client"
import { z } from "zod"
import { motion } from "framer-motion"
import { Input } from "../ShadCdn/input"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "../ShadCdn/select"
import { ResponseCard } from "./ResponseCard"
import { useChat } from "./use-chat"
import twitterIcon from "../../../public/images/icons/send-message-icon.svg"
import Image from "next/image"
export default function ChatFeed(props: {
	userId: string
	profileImageSrc?: string
	initialMessages: z.infer<typeof getConversationResponseBodySchema>["messages"]
	conversatioPublicId: string | null
}) {
	const { state, updateDraftMessage, uploadMessage } = useChat(
		props.userId,
		props.initialMessages,
		props.conversatioPublicId,
		(generatedConversationId) => {
			window.history.pushState({}, "", `/aivisor/c/${generatedConversationId}`)
		}
	)

	return (
		<div className="">
			<div className="flex-1 flex-grow">
				{state.previousMessages.length > 0 ? (
					state.previousMessages.map((message) => {
						console.log("IN HERE", message)
						return (
							<ResponseCard responseString={message.content}></ResponseCard>
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
				className="absolute bottom-4 left-0 w-full px-32"
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
				<div className="h-full">
					<motion.div className="relative flex flex-grow flex-col rounded-md border border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-gray-900/50 dark:bg-gray-700 dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
						<textarea
							rows={1}
							style={{
								resize: "none",
								overflow: "auto",
								height: "auto"
							}}
							className="w-full resize-none border-0 bg-transparent p-2 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent "
							value={state.messageDraft}
							onChange={(e) => {
								updateDraftMessage(e.target.value)
							}}
						/>
						<button className="sticky bottom-1.5 end-[2%] h-[28px] w-[28px] rounded-md p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-gray-900 enabled:dark:hover:text-gray-400 dark:disabled:hover:bg-transparent">
							<Image
								className="h-full w-full"
								alt="Send Message"
								src={twitterIcon}
							></Image>
						</button>
					</motion.div>
				</div>
			</form>
		</div>
	)
}
