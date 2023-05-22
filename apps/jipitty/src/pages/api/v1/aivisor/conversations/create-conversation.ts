import {
	createConversationForUserId,
	createSystemMessage
} from "@/lib/db/utils"
import { createConversationResponseBodySchema } from "@/lib/utils/aivisor-client/schemas"
import { withAuth } from "@clerk/nextjs/api"
import { ServerGetToken } from "@clerk/types"
import "@edge-runtime/ponyfill"
import { NextApiRequest, NextApiResponse } from "next"
export const runtime = "edge"

const OPENAI_SECRET = process.env.OPENAI_SECRET

if (!OPENAI_SECRET) {
	throw new Error("OPENAI_SECRET missing")
}

interface ClerkRequest extends NextApiRequest {
	auth: {
		userId?: string | null
		sessionId?: string | null
		getToken: ServerGetToken
	}
}

async function createConversationPostEndpoint(
	request: ClerkRequest,
	response: NextApiResponse
) {
	const { userId, sessionId } = request.auth

	if (!userId || !sessionId) {
		response.status(401)
		return
	}

	const { systemMessage } = request.body

	try {
		const { conversationId, publicId } = await createConversationForUserId(
			userId,
			"private"
		)

		if (systemMessage) {
			await createSystemMessage(conversationId, systemMessage)
		}

		const responseJson = createConversationResponseBodySchema.parse({
			publicId
		})

		response.json(responseJson)
	} catch (e) {
		console.error(e)
		response.status(500)
	}
}

export default withAuth(createConversationPostEndpoint)
