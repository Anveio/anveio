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
