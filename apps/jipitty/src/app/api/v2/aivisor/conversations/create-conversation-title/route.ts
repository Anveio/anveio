import { getFirstMessageForConversation } from "@/lib/db/utils"
import {
	createConversationForUserId,
	createSystemMessage,
	updateConversationWithTitle
} from "@/lib/db/utils"
import { OpenAIEdgeClient } from "@/lib/features/ai/openai/edge-client"
import {
	createConversationRequestBodySchema,
	createConversationResponseBodySchema,
	getConversationTitleSuggestionRequestBodySchema
} from "@/lib/utils/aivisor-client"
import {
	processStreamedData,
	readStreamedRequestBody
} from "@/lib/utils/readRequestBodyStream"
import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

const OPENAI_SECRET = process.env.OPENAI_SECRET

if (!OPENAI_SECRET) {
	throw new Error("OPENAI_SECRET missing")
}

const createSystemPrompt = (messageContents: string) => {
	return `Create a clever title, preferably a short pun, that fits into an 40 character limit for a conversation with an AI assistant given the following initial prompt:\n\n${messageContents}\n\nConversation title:`
}

export async function POST(request: NextRequest) {
	const { userId } = auth()
	if (!userId) return new NextResponse(undefined, { status: 401 })

	const parsedBody = await readStreamedRequestBody(request)

	const safeBody =
		getConversationTitleSuggestionRequestBodySchema.parse(parsedBody)

	const firstMessage = await getFirstMessageForConversation(
		safeBody.conversationPublicId
	)

	if (!firstMessage) {
		return new NextResponse(undefined, { status: 400 })
	}

	const responseStream = await OpenAIEdgeClient(
		"completions",
		{
			model: "text-davinci-003",
			prompt: createSystemPrompt(firstMessage.messages[0].content),
			temperature: 1.0
		},
		{
			apiKey: OPENAI_SECRET
		}
	)

	const [clientStream, serverStream] = responseStream.tee()

	processStreamedData(serverStream).then((result) => {
		return updateConversationWithTitle(
			result,
			userId,
			parsedBody.conversationPublicId
		)
	})

	return new Response(clientStream)
}
