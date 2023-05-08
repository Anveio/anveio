import { Session } from "next-auth"
import * as React from "react"

interface ChatMachineContext {
	previousMessages: {
		senderName: string
		message: string
	}[]
	messageDraft: string
	session: Session
	responseStream: ReadableStream<Uint8Array> | null
	streamedReplyFromAi: string
}

const textDecoderStreamRef = new TextDecoderStream()
export const useChat = (
	initialSession: Session,
	initialChatHistory: ChatMachineContext["previousMessages"]
) => {

	const [state, setState] = React.useState<ChatMachineContext>({
		previousMessages: initialChatHistory,
		messageDraft: "Please type 2 sentences of lorem ipsum",
		session: initialSession,
		responseStream: null,
		streamedReplyFromAi: "string"
	})

	const uploadMessage = async () => {
		if (!state.session) {
			throw new Error("No session")
		}

		const response = await fetch("/api/v1/aivisor/send-message", {
			method: "POST",
			body: JSON.stringify({
				email: state.session.user?.email,
				message: state.messageDraft
			})
		})

		if (!response.body) {
			throw new Error("No Response Body")
		}

		if (!response.ok) {
			throw new Error("Response not ok")
		}

		const reader = response.body.getReader()

		const readableStream = new ReadableStream<Uint8Array>({
			async start(controller) {
				for await (const chunk of readerToGenerator(reader)) {
					controller.enqueue(chunk)
				}
				controller.close()
			}
		})

		try {
			const resultStream = readableStream.pipeThrough(textDecoderStreamRef)
			const resultReader = resultStream.getReader()
			while (true) {
				const { done, value } = await resultReader.read()
				console.log("Reading", !done)
				if (done) break

				if (value) {
					console.log("Sending message to parent;")
					setState((prevState) => ({
                        ...prevState,
                        streamedReplyFromAi: prevState.streamedReplyFromAi + value
                    }))
				}
			}
		} finally {
			reader.releaseLock()
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
		updateDraftMessage
	}
}


async function* readerToGenerator(
	reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<Uint8Array> {
	while (true) {
		const { done, value } = await reader.read()

		if (done) {
			break
		}

		yield value
	}
}