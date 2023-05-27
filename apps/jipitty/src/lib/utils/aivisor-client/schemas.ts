import { z } from "zod"

export const createConversationRequestBodySchema = z.object({
	userId: z.string(),
	message: z.string().optional(),
	systemMessage: z.string().optional()
})

export const createConversationResponseBodySchema = z.object({
	conversationId: z.string()
})

export const sendMessageRequestBodySchema = z.object({
	userId: z.string(),
	message: z.string(),
	conversationPublicId: z.string()
})

export const sendMessageResponseBodySchema = z.object({
	message: z.string(),
	conversationId: z.string()
})

export const getConversationRequestBodySchema = z.object({
	conversationPublicId: z.string()
})

export const getConversationResponseBodySchema = z.object({
	conversationId: z.string(),
	messages: z.array(
		z.object({
			userId: z.string().nullable(),
			conversationId: z.number(),
			id: z.number(),
			createdAt: z.date(),
			publicId: z.string(),
			content: z.string(),
			senderType: z.union([
				z.literal("user"),
				z.literal("system"),
				z.literal("gpt-3.5-turbo")
			])
		})
	)
})

export const getConversationTitleSuggestionRequestBodySchema = z.object({
	conversationPublicId: z.string()
})

export const getConversationTitleSuggestionResponseBodySchema = z.object({
	suggestedTitle: z.string()
})
