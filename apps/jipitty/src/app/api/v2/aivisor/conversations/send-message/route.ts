import {
	createConversationForUserId,
	createSystemMessage,
	createUserMessage,
	getMessagesForConversationByPublicIdUserId
} from "@/lib/db/utils"
import { OpenAIEdgeClient } from "@/lib/features/ai/openai/edge-client"
import {
	createConversationRequestBodySchema,
	createConversationResponseBodySchema,
	sendMessageRequestBodySchema
} from "@/lib/utils/aivisor-client"
import { readStreamedRequestBody } from "@/lib/utils/readRequestBodyStream"
import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"
import { ChatCompletionRequestMessageRoleEnum } from "openai"

export const runtime = "edge"

const OPENAI_SECRET = process.env.OPENAI_SECRET

if (!OPENAI_SECRET) {
	throw new Error("OPENAI_SECRET missing")
}

export async function POST(request: NextRequest) {
	const { userId } = auth()
	if (!userId) return NextResponse.redirect("/sign-in")

	console.log("🚀 ~ file: route.ts:12 ~ POST ~ userId:", userId)

	const parsedBody = await readStreamedRequestBody(request)
	console.log("🚀 ~ file: route.ts:14 ~ POST ~ parsedBody:", parsedBody)

	const safeBody = sendMessageRequestBodySchema.parse(parsedBody)
	console.log("🚀 ~ file: route.ts:17 ~ POST ~ safeBody:", safeBody)

	const { conversation, messages } =
		await getMessagesForConversationByPublicIdUserId(
			safeBody.conversationPublicId,
			userId
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
								el.senderType === "user"
									? ChatCompletionRequestMessageRoleEnum.User
									: ChatCompletionRequestMessageRoleEnum.Assistant
						}
					})
					.concat([
						{
							content: safeBody.message,
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
			createUserMessage(result, conversation.id, userId)
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
