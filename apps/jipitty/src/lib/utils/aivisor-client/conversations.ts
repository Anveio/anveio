import { z } from "zod"
import {
	createConversationRequestBodySchema,
	createConversationResponseBodySchema,
	getConversationRequestBodySchema,
	getConversationResponseBodySchema,
	getConversationTitleSuggestionRequestBodySchema,
	sendMessageRequestBodySchema
} from "./schemas"

export const createConversation = async (
	body: z.infer<typeof createConversationRequestBodySchema>
) => {
	const safeBody = createConversationRequestBodySchema.parse(body)

	const response = await fetch(
		"/api/v2/aivisor/conversations/create-conversation",
		{
			method: "POST",
			body: JSON.stringify(safeBody)
		}
	)

	const json = await response.json()

	const safeJson = createConversationResponseBodySchema.parse(json)

	return safeJson
}

export const getConversation = async (
	body: z.infer<typeof getConversationRequestBodySchema>
) => {
	const safeBody = getConversationRequestBodySchema.parse(body)

	const searchParams = new URLSearchParams({
		conversationPublicId: safeBody.conversationPublicId
	})

	const response = await fetch(
		"/api/v2/aivisor/conversations/get-conversation?" + searchParams,
		{
			method: "GET"
		}
	)

	const json = await response.json()

	const formattedJson = {
		...json,
		messages: json.messages.map(
			(
				message: z.infer<
					typeof getConversationResponseBodySchema
				>["messages"][number]
			) => {
				return {
					...message,
					createdAt: new Date(message.createdAt)
				}
			}
		)
	}

	const safeJson = getConversationResponseBodySchema.parse(formattedJson)

	return safeJson
}

export const generateConversationTitle = async (
	body: z.infer<typeof getConversationTitleSuggestionRequestBodySchema>
) => {
	const safeBody = getConversationTitleSuggestionRequestBodySchema.parse(body)

	const response = await fetch(
		"/api/v2/aivisor/conversations/generate-conversation-title",
		{
			method: "POST",
			body: JSON.stringify(safeBody)
		}
	)

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

	const textDecoderStream = new TextDecoderStream()

	const resultStream = readableStream.pipeThrough(textDecoderStream)
	const resultReader = resultStream.getReader()

	return resultReader
}

export const createMessageInConversation = async (
	body: z.infer<typeof sendMessageRequestBodySchema>
) => {
	const safeBody = sendMessageRequestBodySchema.parse(body)

	const response = await fetch("/api/v2/aivisor/conversations/send-message", {
		method: "POST",
		body: JSON.stringify(safeBody)
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
	const textDecoderStream = new TextDecoderStream()
	const resultStream = readableStream.pipeThrough(textDecoderStream)
	const resultReader = resultStream.getReader()

	return resultReader
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
