import {
	createAssistantMessage,
	createUserMessage,
	getMessagesForConversationByPublicIdUserId
} from "@/lib/db/queries"
import { OpenAIEdgeClient } from "@/lib/features/ai/openai/edge-client"
import { AivisorClient } from "@/lib/utils/aivisor-client"
import { readBodyFromStream } from "@/lib/utils/readRequestBodyStream"
import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"
import { ChatCompletionRequestMessageRoleEnum } from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"
import { handleCreateChatCompletion } from "@/lib/utils/aivisor-client/common"

export const runtime = "edge"

const ratelimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(5, "1 m"),
	analytics: true
})

export async function POST(request: NextRequest) {
	const { userId } = auth()
	if (!userId) return new NextResponse(undefined, { status: 401 })

	const { success } = await ratelimit.limit(userId)

	if (!success) {
		return new NextResponse("Rate limit exceeded", { status: 429 })
	}

	const parsedBody = await readBodyFromStream(request)

	const safeBody =
		AivisorClient.v2.schemas.sendMessageRequestBodySchema.parse(parsedBody)

	try {
		return handleCreateChatCompletion(
			userId,
			safeBody.conversationPublicId,
			safeBody.message
		)
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
