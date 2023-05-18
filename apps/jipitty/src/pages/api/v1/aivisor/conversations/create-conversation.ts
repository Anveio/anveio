import {
	createConversationFromScratch,
	createSystemMessage
} from "@/lib/db/utils"
import { createConversationResponseBodySchema, createConversationRequestBodySchema } from "@/lib/utils/aivisor-client/schemas"
import { ensureRequestIsAuthenticated } from "@/lib/utils/requestGuard"
import "@edge-runtime/ponyfill"
import type { NextRequest } from "next/server"

export const runtime = "edge"

const OPENAI_SECRET = process.env.OPENAI_SECRET

if (!OPENAI_SECRET) {
	throw new Error("OPENAI_SECRET missing")
}

export default async function createConversationPostEndpoint(request: NextRequest) {
	const { errorResponse, successResponse } = await ensureRequestIsAuthenticated(
		request,
		createConversationRequestBodySchema
	)

	if (errorResponse) {
		return errorResponse
	}

	const { email } = successResponse

	try {
		const { conversationId, publicId } = await createConversationFromScratch(
			email,
			"private"
		)

		if (successResponse.systemMessage) {
			await createSystemMessage(conversationId, successResponse.systemMessage)
		}

		const responseJson = createConversationResponseBodySchema.parse({
			conversationId,
			publicId
		})

		return new Response(JSON.stringify(responseJson), {
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
