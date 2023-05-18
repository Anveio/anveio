import {
	createUserMessage,
	getAllMessagesForConversation
} from "@/lib/db/utils"
import { OpenAIEdgeClient } from "@/lib/features/ai/openai/edge-client"
import { sendMessageRequestBodySchema } from "@/lib/utils/aivisor-client"
import { ensureRequestIsAuthenticated } from "@/lib/utils/requestGuard"
import "@edge-runtime/ponyfill"
import type { NextRequest } from "next/server"
import { ChatCompletionRequestMessageRoleEnum } from "openai"

export const runtime = "edge"

const OPENAI_SECRET = process.env.OPENAI_SECRET

if (!OPENAI_SECRET) {
	throw new Error("OPENAI_SECRET missing")
}

export default async function sendMessage(request: NextRequest) {
	const { errorResponse, successResponse } = await ensureRequestIsAuthenticated(
		request,
		sendMessageRequestBodySchema
	)

	if (errorResponse) {
		return errorResponse
	}

	/**
	 * From this point on, the user is who they say they are, it's safe to
	 * make some DB reads and writes.
	 */

	const { conversationPublicId, email } = successResponse

	const { conversation, messages } = await getAllMessagesForConversation(
		conversationPublicId
	)

	try {
		const responseStream = await OpenAIEdgeClient(
			"chat",
			{
				model: "gpt-3.5-turbo",
				stream: true,
				messages: messages
					.map((el) => {
						return {
							content: el.content,
							role:
								el.sender_type === "user"
									? ChatCompletionRequestMessageRoleEnum.User
									: ChatCompletionRequestMessageRoleEnum.Assistant
						}
					})
					.concat([
						{
							content: successResponse.message,
							role: ChatCompletionRequestMessageRoleEnum.User
						}
					])
			},
			{
				apiKey: OPENAI_SECRET
			}
		)

		const [clientStream, serverStream] = responseStream.tee()

		processStreamedData(serverStream).then((result) => {
			createUserMessage(result, conversation.id, email)
		})

		return new Response(clientStream)
	} catch (e) {
		const errorResponse = new Response(String(e), {
			status: 500,
			headers: {
				"content-type": "application/json"
			}
		})

		return errorResponse
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

async function processStreamedData(rootStream: ReadableStream<Uint8Array>) {
	const reader = rootStream.getReader()
	const textDecoderStreamRef = new TextDecoderStream()

	const readableStream = new ReadableStream<Uint8Array>({
		async start(controller) {
			for await (const chunk of readerToGenerator(reader)) {
				controller.enqueue(chunk)
			}
			controller.close()
		}
	})

	let finalResult = ""

	const resultStream = readableStream.pipeThrough(textDecoderStreamRef)
	const resultReader = resultStream.getReader()

	while (true) {
		const { done, value } = await resultReader.read()
		if (done) break

		if (value) {
			finalResult += value
		}
	}

	return finalResult
}
