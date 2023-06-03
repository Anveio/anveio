import { updateConversationWithTitle } from "@/lib/db/queries"
import { OpenAIEdgeClient } from "@/lib/features/ai/openai/edge-client"
import { AivisorClient } from "@/lib/utils/aivisor-client"
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
	return `Create a clever title, preferably a short pun, that fits into an 40 character limit for a conversation with an AI assistant given the following initial prompt:\n\n${messageContents}\n\nConversation title:\n`
}

export async function POST(request: NextRequest) {
	console.log("Received request to generate conversation title")

	const { userId } = auth()
	if (!userId) return new NextResponse(undefined, { status: 401 })

	const parsedBody = await readStreamedRequestBody(request)

	const safeBody =
		AivisorClient.v2.schemas.getConversationTitleSuggestionRequestBodySchema.parse(
			parsedBody
		)

	const responseStream = await OpenAIEdgeClient(
		"completions",
		{
			model: "text-davinci-003",
			prompt: createSystemPrompt(safeBody.prompt),
			temperature: 1.0,
			max_tokens: 40
		},
		{
			apiKey: OPENAI_SECRET
		}
	)

	const [clientStream, serverStream] = responseStream.tee()

	processStreamedData(serverStream).then((result) => {
		console.log("Got result from OpenAI", result)
		return updateConversationWithTitle(
			result,
			userId,
			safeBody.conversationPublicId
		)
	})

	return new Response(clientStream)
}
