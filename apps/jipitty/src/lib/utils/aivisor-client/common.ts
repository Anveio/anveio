import {
	createAssistantMessage,
	createUserMessage,
	getMessagesForConversationByPublicIdUserId
} from "@/lib/db/queries"
import { OpenAIEdgeClient } from "@/lib/features/ai/openai/edge-client"
import { Message, OpenAIStream, StreamingTextResponse } from "ai"
import { ChatCompletionRequestMessageRoleEnum } from "openai-edge"

export const handleCreateChatCompletion = async (
	userId: string,
	conversationPublicId: string,
	message: string
) => {
	const { conversation, messages } =
		await getMessagesForConversationByPublicIdUserId(
			conversationPublicId,
			userId
		)

	const responseStream = await OpenAIEdgeClient.createChatCompletion({
		model: "gpt-4",
		stream: true,
		messages: messages
			.map((el) => {
				return {
					content: el.content,
					role:
						el.senderType === "user"
							? ChatCompletionRequestMessageRoleEnum.User
							: ChatCompletionRequestMessageRoleEnum.Assistant
				}
			})
			.concat([
				{
					content: message,
					role: ChatCompletionRequestMessageRoleEnum.User
				}
			])
	})

	const stream = OpenAIStream(responseStream, {
		onStart: async () => {
			await createUserMessage(message, conversation.id, userId)
		},
		onCompletion: async (result) => {
			await createAssistantMessage(result, conversation.id)
		}
	})

	return new StreamingTextResponse(stream)
}

