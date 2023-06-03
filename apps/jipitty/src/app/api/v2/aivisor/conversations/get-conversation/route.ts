import { getMessagesForConversationByPublicIdUserId } from "@/lib/db/queries"
import { AivisorClient } from "@/lib/utils/aivisor-client"
import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"
export async function GET(request: NextRequest) {
	const { userId } = auth()
	if (!userId) return new NextResponse(undefined, { status: 401 })

	const { searchParams } = new URL(request.url)
	const conversationPublicId = searchParams.get("conversationPublicId")

	if (!conversationPublicId) {
		return new NextResponse(undefined, { status: 400 })
	}

	const { conversation, messages } =
		await getMessagesForConversationByPublicIdUserId(
			conversationPublicId,
			userId
		)

	const response =
		AivisorClient.v2.schemas.getConversationResponseBodySchema.parse({
			conversationId: conversation.publicId,
			messages
		})

	return NextResponse.json(response)
}
