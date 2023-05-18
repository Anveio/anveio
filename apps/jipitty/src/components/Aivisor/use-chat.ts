import { MessageRow } from "@/lib/db"
import {
	createConversation,
	createMessageInConversation
} from "@/lib/utils/aivisor-client"
import { Session } from "next-auth"
import * as React from "react"

interface ChatMachineContext {
	previousMessages: MessageRow[]
	messageDraft: string
	session: Session
	responseStream: ReadableStream<Uint8Array> | null
	streamedReplyFromAi: string
}

export const useChat = (
	initialSession: Session,
	initialChatHistory: ChatMachineContext["previousMessages"],
	conversationPublicId: string | null,
	onGenerateConversationPublicId?: (publicId: string) => void
) => {
	const currentConversationIdRef = React.useRef(conversationPublicId)

	const [state, setState] = React.useState<ChatMachineContext>({
		previousMessages: initialChatHistory,
		messageDraft: "Please type 2 sentences of lorem ipsum",
		session: initialSession,
		responseStream: null,
		streamedReplyFromAi: ""
	})

	const generateConversationId = async () => {
		if (!state.session.user?.email) {
			throw new Error("No session user email:" + JSON.stringify(state.session))
		}

		const json = await createConversation({
			email: state.session.user?.email
		})

		if (onGenerateConversationPublicId) {
			onGenerateConversationPublicId(json.publicId)
		}

		return json
	}

	const uploadMessage = async () => {
		if (!state.session) {
			throw new Error("No session")
		}

		if (!state.session.user?.email) {
			throw new Error("No session user email")
		}

		if (!currentConversationIdRef.current) {
			currentConversationIdRef.current = (await generateConversationId()).publicId
		}

		const resultReader = await createMessageInConversation({
			conversationPublicId: currentConversationIdRef.current,
			email: state.session.user?.email,
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
