import {
	createSystemMessage,
	getMessagesForConversationByPublicIdUserId
} from "@/lib/db/utils"
import "@edge-runtime/ponyfill"
import { NextApiRequest, NextApiResponse } from "next"

import { z } from "zod"

export const runtime = "edge"

interface ClerkRequest extends NextApiRequest {
	auth: {
		userId?: string | null
		sessionId?: string | null
	}
}

export default async function getConversation(
	request: ClerkRequest,
	response: NextApiResponse
) {
	const { userId } = request.auth

	if (!userId) {
		response.status(401)
		return
	}

	const requestBodySchema = z.object({
		conversationId: z.string()
	})

	const parsedRequestBody = requestBodySchema.parse(request.body)

	try {
		const result = await getMessagesForConversationByPublicIdUserId(
			parsedRequestBody.conversationId,
			userId
		)

		return new Response(JSON.stringify(result), {
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
