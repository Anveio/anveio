import {
	createAssistantMessage,
	createUserMessage,
	getMessagesForConversationByPublicIdUserId
} from "@/lib/db/utils"
import { OpenAIEdgeClient } from "@/lib/features/ai/openai/edge-client"
import { sendMessageRequestBodySchema } from "@/lib/utils/aivisor-client"
import {
	processStreamedData,
	readStreamedRequestBody
} from "@/lib/utils/readRequestBodyStream"
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
	if (!userId) return new NextResponse(undefined, { status: 401 })

	const parsedBody = await readStreamedRequestBody(request)

	const safeBody = sendMessageRequestBodySchema.parse(parsedBody)

	const { conversation, messages } =
		await getMessagesForConversationByPublicIdUserId(
			safeBody.conversationPublicId,
			userId
		)

	try {
		createUserMessage(safeBody.message, conversation.id, userId)

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

		processStreamedData(serverStream)
			.then((result) => {
				return createAssistantMessage(result, conversation.id)
			})
			.then((result) => {
				console.log("Saved message", result.rowsAffected)
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
