import {
	createConversationForUserId,
	createSystemMessage
} from "@/lib/db/utils"
import { createConversationRequestBodySchema, createConversationResponseBodySchema } from "@/lib/utils/aivisor-client"
import { readStreamedRequestBody } from "@/lib/utils/readRequestBodyStream"
import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"
export async function POST(request: NextRequest) {
	const { userId } = auth()
	if (!userId) return NextResponse.redirect("/sign-in")
	console.log("🚀 ~ file: route.ts:12 ~ POST ~ userId:", userId)

	const parsedBody = await readStreamedRequestBody(request)
	console.log("🚀 ~ file: route.ts:14 ~ POST ~ parsedBody:", parsedBody)

	const safeBody = createConversationRequestBodySchema.parse(parsedBody)
	console.log("🚀 ~ file: route.ts:17 ~ POST ~ safeBody:", safeBody)

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
