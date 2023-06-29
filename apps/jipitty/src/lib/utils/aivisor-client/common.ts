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
		model: "gpt-3.5-turbo",
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

export const convertDbMessageToVercelAiMessage = (
	message: Awaited<
		ReturnType<typeof getMessagesForConversationByPublicIdUserId>
	>["messages"][number]
): Message => {
	return {
		createdAt: new Date(message.createdAt),
		id: message.publicId,
		role: message.senderType === "user" ? "user" : "assistant",
		content: message.content
	}
}
