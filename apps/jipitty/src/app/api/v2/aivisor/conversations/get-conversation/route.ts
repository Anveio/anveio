import {
	createConversationForUserId,
	createSystemMessage,
	getMessagesForConversationByPublicIdUserId
} from "@/lib/db/utils"
import {
	createConversationRequestBodySchema,
	createConversationResponseBodySchema,
	getConversationRequestBodySchema,
	getConversationResponseBodySchema
} from "@/lib/utils/aivisor-client"
import { readStreamedRequestBody } from "@/lib/utils/readRequestBodyStream"
import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"
export async function GET(request: NextRequest) {
	const { userId } = auth()
	if (!userId) return new NextResponse(undefined, { status: 401 })
	const parsedBody = await readStreamedRequestBody(request)
	const safeBody = getConversationRequestBodySchema.parse(parsedBody)
	const { conversation, messages } =
		await getMessagesForConversationByPublicIdUserId(
			safeBody.conversationPublicId,
			userId
		)

	const response = getConversationResponseBodySchema.parse({
		conversationId: conversation.publicId,
		messages
	})

	return NextResponse.json(response)
}
