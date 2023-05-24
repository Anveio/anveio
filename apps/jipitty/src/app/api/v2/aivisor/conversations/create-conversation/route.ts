import {
	createConversationForUserId,
	createSystemMessage
} from "@/lib/db/utils"
import {
	createConversationRequestBodySchema,
	createConversationResponseBodySchema
} from "@/lib/utils/aivisor-client"
import { readStreamedRequestBody } from "@/lib/utils/readRequestBodyStream"
import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"
export async function POST(request: NextRequest) {
	const { userId } = auth()
	if (!userId) return new NextResponse(undefined, { status: 401 })

	const parsedBody = await readStreamedRequestBody(request)

	const safeBody = createConversationRequestBodySchema.parse(parsedBody)

	const { publicId, conversationId } = await createConversationForUserId(
		userId,
		"private"
	)

	if (safeBody.systemMessage) {
		await createSystemMessage(safeBody.systemMessage, Number(conversationId))
	}

	const response = createConversationResponseBodySchema.parse({
		conversationId: publicId
	})

	return NextResponse.json(response)
}
