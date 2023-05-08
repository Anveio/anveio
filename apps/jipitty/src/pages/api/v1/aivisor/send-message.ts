import {
	createConversationFromScratch,
	getAllMessagesForConversation
} from "@/lib/db/utils"
import { OpenAIEdgeClient } from "@/lib/features/ai/openai/edge-client"
import { ensureRequestIsAuthenticated } from "@/lib/utils/requestGuard"
import "@edge-runtime/ponyfill"
import type { NextRequest } from "next/server"
import { ChatCompletionRequestMessageRoleEnum } from "openai"
import { z } from "zod"

export const runtime = "edge"

const OPENAI_SECRET = process.env.OPENAI_SECRET

if (!OPENAI_SECRET) {
	throw new Error("OPENAI_SECRET missing")
}

export default async function sendMessage(request: NextRequest) {
	const requestBodySchema = z.object({
		email: z.string().email(),
		message: z.string(),
		conversationId: z.string().optional()
	})

	const { errorResponse, successResponse } = await ensureRequestIsAuthenticated(
		request,
		requestBodySchema
	)

	if (errorResponse) {
		return errorResponse
	}

	/**
	 * From this point on, the user is who they say they are, it's safe to
	 * make some DB reads and writes.
	 */

	let conversationId = successResponse.conversationId

	if (!conversationId) {
		console.log(
			"Generating a conversation from scratch for user with email",
			successResponse.email
		)
		conversationId = await createConversationFromScratch(
			successResponse.email,
			"private"
		)
	}

	console.log("Creating a message under conversation", conversationId)

	const messageHistory = await getAllMessagesForConversation(conversationId)

	console.log(
		"Found messages for conversation with ID ",
		conversationId,
		"--",
		messageHistory
	)

	try {
		const responseStream = await OpenAIEdgeClient(
			"chat",
			{
				model: "gpt-3.5-turbo",
				stream: true,
				messages: messageHistory
					.map((el) => {
						return {
							content: el.content,
							role:
								el.sender === "user"
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

		return new Response(responseStream)
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
