import {
	createConversationFromScratch,
	createSystemMessage,
	getAllMessagesForConversation
} from "@/lib/db/utils"
import { OpenAIEdgeClient } from "@/lib/features/ai/openai/edge-client"
import { readStreamedRequestBody } from "@/lib/utils/readRequestBodyStream"
import { ensureRequestIsAuthenticated } from "@/lib/utils/requestGuard"
import "@edge-runtime/ponyfill"
import { decode } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import { ChatCompletionRequestMessageRoleEnum } from "openai"
import { z } from "zod"

export const runtime = "edge"

const OPENAI_SECRET = process.env.OPENAI_SECRET

if (!OPENAI_SECRET) {
	throw new Error("OPENAI_SECRET missing")
}

export default async function getConversation(request: NextRequest) {
	const requestBodySchema = z.object({
		email: z.string().email(),
        conversationId: z.string()
	})

	requestBodySchema.safeParse

	const { errorResponse, successResponse } = await ensureRequestIsAuthenticated(
		request,

		requestBodySchema
	)

	if (errorResponse) {
		return errorResponse
	}

	const { email } = successResponse

	try {
		const { conversationId, publicId } = await getAllMessagesForConversation()

		if (successResponse.systemMessage) {
			await createSystemMessage(conversationId, successResponse.systemMessage)
		}

		return new Response(JSON.stringify({ conversationId, publicId }), {
			status: 200,
			headers: {
					"content-type": "application/json"
			}
		})
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
