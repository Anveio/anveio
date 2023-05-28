import { SUPPORTED_LLM_MODEL } from "@/lib/constants"
import { getMessagesForConversationByPublicIdUserId } from "@/lib/db/utils"
import {
	createConversation,
	createMessageInConversation
} from "@/lib/utils/aivisor-client"
import * as React from "react"

interface ChatMachineContext {
	previousMessages: Awaited<
		ReturnType<typeof getMessagesForConversationByPublicIdUserId>
	>["messages"]
	selectedModel: (typeof SUPPORTED_LLM_MODEL)[keyof typeof SUPPORTED_LLM_MODEL]
	messageDraft: string
	responseStream: ReadableStream<Uint8Array> | null
	streamedReplyFromAi: string
}

export const useChat = (
	userId: string,
	initialChatHistory: ChatMachineContext["previousMessages"],
	conversationPublicId: string | null,
	onGenerateConversationPublicId?: (publicId: string) => void
) => {
	const currentConversationIdRef = React.useRef(conversationPublicId)

	const [state, setState] = React.useState<ChatMachineContext>({
		previousMessages: initialChatHistory,
		selectedModel: SUPPORTED_LLM_MODEL.THREE_POINT_FIVE,
		messageDraft: "Please type 2 sentences of lorem ipsum",
		responseStream: null,
		streamedReplyFromAi: ""
	})

	const generateConversationId = async () => {
		const json = await createConversation({
			userId
		})

		currentConversationIdRef.current = json.conversationId

		if (onGenerateConversationPublicId) {
			onGenerateConversationPublicId(json.conversationId)
		}

		return json
	}

	const uploadMessage = async () => {
		let conversationId =
			currentConversationIdRef.current ||
			(await generateConversationId()).conversationId

		const resultReader = await createMessageInConversation({
			conversationPublicId: conversationId,
			userId: userId,
			message: state.messageDraft
		})

		try {
			while (true) {
				const { done, value } = await resultReader.read()
				if (done) break

				if (value) {
					console.log("Received chunk", value)
					setState((prevState) => ({
						...prevState,
						streamedReplyFromAi: prevState.streamedReplyFromAi + value
					}))
				}
			}
		} catch (e) {
			throw e
		} finally {
			resultReader.releaseLock()
		}
	}

	const updateDraftMessage = (value: string) => {
		setState((prevState) => ({
			...prevState,
			messageDraft: value
		}))
	}

	return {
		state,
		uploadMessage,
		updateDraftMessage,
		createConversation
	}
}
