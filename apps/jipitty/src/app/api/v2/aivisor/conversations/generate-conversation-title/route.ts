import { getMessagesForConversationByPublicIdUserId, updateConversationWithTitle } from "@/lib/db/queries"
import { OpenAIEdgeClient } from "@/lib/features/ai/openai/edge-client"
import { AivisorClient } from "@/lib/utils/aivisor-client"
import {
	processStreamedData,
	readBodyFromStream
} from "@/lib/utils/readRequestBodyStream"
import { auth } from "@clerk/nextjs"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

const createSystemPrompt = (prompt: string, response: string) => {
	return `Create a clever title, preferably a short pun, that fits into an 40 character limit for a conversation with an AI assistant given the following initial prompt:\n\n${prompt}\n and the following response: \n${response}\nConversation title:\n`
}

export async function POST(request: NextRequest) {
	const { userId } = auth()
	if (!userId) return new NextResponse(undefined, { status: 401 })

	const parsedBody = await readBodyFromStream(request)
	console.log("🚀 ~ file: route.ts:23 ~ POST ~ parsedBody:", parsedBody)

	try {
		const safeBody =
			AivisorClient.v2.schemas.getConversationTitleSuggestionRequestBodySchema.parse(
				parsedBody
			)



		const { conversationPublicId } = safeBody

		if (!conversationPublicId) {
			return new NextResponse(undefined, { status: 400 })
		}

		const { messages } =
			await getMessagesForConversationByPublicIdUserId(
				conversationPublicId,
				userId
			)

		if (messages.length < 2) {
			return NextResponse.json({ status: 304 })
		}

		const initialPrompt = messages[0].content
		const initialResponse = messages[1].content

		try {
			const response = await OpenAIEdgeClient.createChatCompletion(
				{
					model: "gpt-3.5-turbo",
					messages: [
						{
							role: "system",
							content: createSystemPrompt(initialPrompt, initialResponse),
						}
					],
					temperature: 1.0,
				},
				
			)

			const stream = OpenAIStream(response, {
				onToken: async (token) => {
					console.log("Token", token)
				},
				onCompletion: async (result) => {
					console.log("NEW TITLE", result)

					await updateConversationWithTitle(
						result,
						userId,
						safeBody.conversationPublicId
					)
				}
			})


			return new StreamingTextResponse(stream)
		} catch (e) {
			console.error(e)
			return new NextResponse(undefined, { status: 500 })
		}
	} catch (e) {
		console.log("🚀 ~ file: route.ts:23 ~ POST ~ e:", e)
		const errorResponse = new Response(String(e), {
			status: 400,
			headers: {
				"content-type": "application/json"
			}
		})

		return errorResponse
	}
}
