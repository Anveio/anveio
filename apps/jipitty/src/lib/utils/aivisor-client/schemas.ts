import { z } from "zod"

export const createConversationRequestBodySchema = z.object({
    email: z.string().email(),
    message: z.string().optional(),
    systemMessage: z.string().optional()
})

export const createConversationResponseBodySchema = z.object({
    conversationId: z.string(),
    publicId: z.string()
})

export const sendMessageRequestBodySchema = z.object({
    email: z.string().email(),
    message: z.string(),
    conversationPublicId: z.string()
})

export const sendMessageResponseBodySchema = z.object({
    message: z.string(),
    conversationId: z.string()
})