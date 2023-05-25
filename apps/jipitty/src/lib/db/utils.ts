import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { z } from "zod"
import { db } from "./db"
import { conversations, messages } from "./schema"
import { ConversationRow, MessageRow } from "./types"

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

export const getAllConversationsForUserByUserId = async (userId: string) => {
	const validatedUserId = z.string().parse(userId)

	return db
		.select({
			admin_id: conversations.adminId,
			title: conversations.title,
			visibility: conversations.visibility,
			created_at: conversations.createdAt,
			updated_at: conversations.updatedAt,
			public_id: conversations.publicId,
			created_by_user_id: conversations.createdbyUserId
		})
		.from(conversations)
		.where(eq(conversations.createdbyUserId, validatedUserId))
}

function doesUserBelongToConversation(
	userId: string,
	conversation: ConversationRow
): boolean {
	return (
		userId === conversation.createdbyUserId || userId === conversation.adminId
	)
}

export const createConversationForUserId = async (
	userId: string,
	visibility: "private" | "public" | "url" | "shared"
) => {
	const validatedUserId = z.string().parse(userId)
	const validatedVisibility = z
		.enum(["private", "public", "url", "shared"])
		.parse(visibility)

	const publicId = nanoid(12)

	const result = await db
		.insert(conversations)
		.values({
			adminId: validatedUserId,
			publicId: publicId,
			visibility: validatedVisibility,
			createdbyUserId: validatedUserId
		})
		.execute()

	return { conversationId: result.insertId, publicId }
}

export const getMessagesForConversationByPublicIdUserId = async (
	conversationPublicId: string,
	userId: string
) => {
	const validatedPublicId = z.string().parse(conversationPublicId)
	const validatedUserId = z.string().parse(userId)

	return db.transaction(async (tx) => {
		const conversationQueryResult = await tx
			.select()
			.from(conversations)
			.where(eq(conversations.publicId, validatedPublicId))
			.limit(1)
			.execute()

		const conversation = conversationQueryResult[0]

		if (!conversation) {
			throw new Error(
				"No conversation found for public id: " + validatedPublicId
			)
		}

		const userBelongsToConversation = doesUserBelongToConversation(
			validatedUserId,
			conversation
		)

		if (!userBelongsToConversation) {
			throw new Error(
				"User does not belong to conversation with public id: " +
					validatedPublicId
			)
		}

		const m = await tx
			.select()
			.from(messages)
			.where(eq(messages.conversationId, conversation.id))

		return { conversation, messages: m }
	})
}

export const createSystemMessage = (
	message: string,
	conversationId: number
) => {
	const validatedMessage = z.string().parse(message)
	const validatedConversationId = z.string().parse(conversationId)

	return db
		.insert(messages)
		.values({
			senderType: "system",
			content: validatedMessage,
			conversationId: Number(validatedConversationId),
			publicId: nanoid(12)
		})
		.execute()
}

export const createUserMessage = (
	message: string,
	conversationId: number,
	userId: string
) => {
	const validatedMessage = z.string().parse(message)
	const validatedConversationId = z.number().parse(conversationId)
	const validatedSenderUserId = z.string().parse(userId)

	return db.insert(messages).values({
		senderType: "user",
		content: validatedMessage,
		conversationId: validatedConversationId,
		userId: validatedSenderUserId,
		publicId: nanoid(12)
	})
}

export const createAssistantMessage = (
	message: string,
	conversationId: number
) => {
	const validatedMessage = z.string().parse(message)
	const validatedConversationId = z.number().parse(conversationId)

	return db.insert(messages).values({
		senderType: "gpt-3.5-turbo",
		content: validatedMessage,
		conversationId: validatedConversationId,
		publicId: nanoid(12)
	})
}
