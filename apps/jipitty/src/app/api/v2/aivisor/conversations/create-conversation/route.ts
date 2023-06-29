import {
	createConversationForUserId,
	createSystemMessage
} from "@/lib/db/queries"
import { AivisorClient } from "@/lib/utils/aivisor-client"
import { readStreamedRequestBody } from "@/lib/utils/readRequestBodyStream"
import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

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

	const parsedBody = await readStreamedRequestBody(request)

	const safeBody =
		AivisorClient.v2.schemas.createConversationRequestBodySchema.parse(
			parsedBody
		)

	const { publicId, conversationId } = await createConversationForUserId(
		userId,
		"private"
	)

	if (safeBody && safeBody.systemMessage) {
		await createSystemMessage(safeBody.systemMessage, Number(conversationId))
	}

	const response =
		AivisorClient.v2.schemas.createConversationResponseBodySchema.parse({
			conversationId: publicId
		})

	return NextResponse.json(response)
}
