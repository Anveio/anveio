import { z } from "zod"
import { db } from "./db"
import { Transaction } from "@planetscale/database"
import { nanoid } from "nanoid"
import { ConversationRow, MessageRow, UserRow } from "./types"
import { eq } from "drizzle-orm"
import { users } from "./schema"
import { AdapterUser, DefaultAdapter } from "next-auth/adapters"

export const getDoesUserAlreadyExistByEmail = async (
	email: string,
	tx?: Parameters<Parameters<typeof db.transaction>[0]>[0]
) => {
	const validatedEmail = z
		.string({
			required_error: "Email is required"
		})
		.email()
		.parse(email)

	const userAlreadyExistsQuery = (tx || db)
		.select()
		.from(users)
		.where(eq(users.email, validatedEmail))
		.limit(1)

	const queryResult = await userAlreadyExistsQuery

	return queryResult.length > 0
}

export const getUserByEmailAddress = async (emailAddress: string) => {
	const validatedEmail = z.string().email().parse(emailAddress)

	const result = await db
		.select({
			id: users.id,
			username: users.username,
			email: users.email
		})
		.from(users)
		.where(eq(users.email, validatedEmail))
		.limit(1)
		.execute()

	return result[0]
}

export const createUserFromAdapterUser: DefaultAdapter["createUser"] = async (
	user
) => {
	const validatedEmail = z.string().email().parse(user.email)
	const validatedUsername = z.string().nullable().parse(user.name)

	const idForUser = await db.transaction(async (tx) => {
		const userAlreadyExists = await getDoesUserAlreadyExistByEmail(
			validatedEmail,
			tx
		)

		if (userAlreadyExists) {
			throw new Error("User already exists")
		}

		const newUser = await tx.insert(users).values({
			email: validatedEmail,
			username: validatedUsername,
			
		})

		return newUser.insertId
	})

	return { id: idForUser, email: validatedEmail, emailVerified: user.emailVerified }
}

export const createUserWithOAuthToken = async (
	emailAddress: string | undefined | null,
	oAuthToken: string | undefined | null,
	oAuthProvider: string | undefined | null,
	refresh_token: string | undefined | null
) => {
	const validatedEmail = z

		.string({
			required_error: "Missing email"
		})
		.describe("Email")
		.email({
			message: "Invalid email"
		})

		.parse(emailAddress)
	const validatedOAuthToken = z
		.string()
		.describe("OAuth Token")
		.parse(oAuthToken)
	const validatedOAuthProvider = z
		.string()
		.describe("OAuth Provider")
		.parse(oAuthProvider)
	const validatedRefreshToken = z
		.string()
		.optional()
		.describe("OAuth Refresh Token")
		.parse(refresh_token)

	await db.transaction(async (tx) => {
		const user = await getUserByEmailAddress(validatedEmail, tx)

		if (user) {
			console.log("Found user: ", user)
			const userId = user.id
			/**
			 * Check if this token exists in our DB for this user already
			 */
			const maybeExistingTokenQuery = await tx.execute(
				`
        SELECT id, expires_at
        FROM oauth_tokens
        WHERE user_id = ?
        AND (expires_at IS NULL OR expires_at > NOW())
        ORDER BY expires_at DESC
        LIMIT 1
        `,
				[Number(userId)]
			)

			const maybeExistingToken = maybeExistingTokenQuery.rows[0] as
				| {
						id: string
						expiresAt: Date
				  }
				| undefined

			if (maybeExistingToken) {
				console.log("Found existing token", maybeExistingToken)
				const { id: existingOauthTokenId } = maybeExistingToken

				/**
				 * Expire the user's oauth token
				 */
				await tx.execute(
					`UPDATE oauth_tokens SET expires_at = NOW() WHERE id = ?`,
					[Number(existingOauthTokenId)]
				)
			}

			/**
			 * Create a new oauthTokenfor the user
			 */
			await tx.execute(
				`INSERT INTO oauth_tokens (user_id, oauth_provider_name, access_token, token_type) 
       VALUES (?, ?, ?, 'Bearer') ON DUPLICATE KEY UPDATE access_token = ?;`,
				[
					userId,
					validatedOAuthProvider,
					validatedOAuthToken,
					validatedOAuthToken
				]
			)
		} else {
			/**
			 * Create the user and the oauth token for them
			 */
			console.log("Creating new User")
			await tx.execute(
				`INSERT INTO users (email, password_hash) VALUES (?, NULL)`,
				[validatedEmail]
			)

			console.log("Creating an OAuth token for the user")
			await tx.execute(
				`
        INSERT INTO oauth_tokens (user_id, oauth_provider_name, access_token, refresh_token, token_type)
        VALUES (
          (SELECT id FROM users WHERE email = ?),
          ?,
          ?,
          ?,
          'Bearer'
        )
        `,
				[
					validatedEmail,
					validatedOAuthProvider,
					validatedOAuthToken,
					validatedRefreshToken || null
				]
			)
		}
	})
}

export const getAllConversationsForUserByEmailAddress = async (
	emailAddress: string
) => {
	const validatedEmailAddress = z.string().email().parse(emailAddress)

	const conversations = await db.transaction(async (tx) => {
		const user = await getUserByEmailAddress(validatedEmailAddress, tx)

		if (!user) {
			throw new Error(
				"User not found for email address: " + validatedEmailAddress
			)
		}

		const conversations = await tx.execute(
			`
		SELECT participants, admin_id, title, visibility, created_at, updated_at, public_id, created_by_user_id
		FROM conversations
		WHERE created_by_user_id = ?
		`,
			[user.id]
		)

		return conversations.rows as Pick<
			ConversationRow,
			| "participants"
			| "admin_id"
			| "title"
			| "visibility"
			| "created_at"
			| "updated_at"
			| "public_id"
			| "created_by_user_id"
		>[]
	})

	return conversations
}

function doesUserBelongToConversation(
	user: UserRow,
	conversation: ConversationRow
): boolean {
	switch (conversation.visibility) {
		case "public":
		case "url":
			return true

		case "shared":
			if (
				user.id === conversation.admin_id ||
				user.id === conversation.created_by_user_id
			) {
				return true
			}

			const participantEmails = JSON.parse(conversation.participants)
			const validatedParticipantEmails = z
				.array(z.string().email())
				.parse(participantEmails)

			if (
				validatedParticipantEmails.includes(user.email) ||
				user.id === conversation.admin_id ||
				user.id === conversation.created_by_user_id
			) {
				return true
			} else {
				return false
			}

		case "private":
			if (user.id === conversation.created_by_user_id) {
				return true
			} else {
				return false
			}

		default:
			return false
	}
}

export const checkIfUserBelongsToConversation = async (
	userId: string,
	conversationId: string
) => {
	const validatedUserId = z.string().parse(userId)
	const validatedConversationId = z.string().parse(conversationId)

	const conversations = await db.execute(
		`
		SELECT EXISTS (
		SELECT 1
		FROM user_conversations
		WHERE conversation_id = ${validatedConversationId}
			AND user_id = ${validatedUserId}
		) AS is_created_by_user
  `
	)

	return conversations.rows
}

export const createMessageRowForUserByEmailAddress = async (
	emailAddress: string,
	conversationPublicId: string | null
) => {
	await db.transaction(async (tx) => {
		const user = await getUserByEmailAddress(emailAddress, tx)

		if (!user) {
			throw new Error(
				"User not found for user with email address: " + emailAddress
			)
		}

		const { id: userId } = user

		await tx.execute(
			`
    IF @provided_conversation_id IS NOT NULL THEN
        -- Use the provided conversation ID
        SET @conversation_id = @provided_conversation_id;
    ELSE
        -- Create a new conversation
        INSERT INTO conversations (
            created_at,
            updated_at
        ) VALUES (
            NOW(),
            NOW()
        );
        SET @conversation_id = LAST_INSERT_ID();
        
        -- Create a row in user_conversations for the user
        INSERT INTO user_conversations (
            user_id,
            conversation_id
        ) VALUES (
            (SELECT id FROM users WHERE email = @user_email),
            @conversation_id
        );
    END IF;
    `
		)
	})
}

export const createConversationFromScratch = async (
	emailAddress: string,
	visibility: "private" | "public" | "url" | "shared"
) => {
	const validatedEmailAddress = z.string().email().parse(emailAddress)
	const validatedVisibility = z
		.enum(["private", "public", "url", "shared"])
		.parse(visibility)

	const publicId = nanoid(12)

	const result = await db.transaction(async (tx) => {
		const user = await getUserByEmailAddress(validatedEmailAddress, tx)

		if (!user) {
			throw new Error(
				"Failed to find user with email: " + validatedEmailAddress
			)
		}
		const conversation = await tx.execute(
			`INSERT INTO conversations (
				public_id,
				admin_id,
				visibility,
				created_by_user_id,
				participants
				) VALUES (
				?,
				?,
				?,
				?,
				?
			)`,
			[
				publicId,
				user.id,
				validatedVisibility,
				user.id,
				JSON.stringify([validatedEmailAddress])
			]
		)

		const conversationId = conversation.insertId

		await tx.execute(`INSERT INTO user_conversations (
      user_id,
      conversation_id
    ) VALUES (
      ${user.id},
      ${conversationId}
    )`)

		return { conversationId, publicId }
	})

	return result
}

export const getMessagesForConversationByPublicIdAndUserEmail = async (
	publicId: string,
	emailAddress: string
) => {
	const validatedPublicId = z.string().parse(publicId)
	const validatedEmailAddress = z.string().email().parse(emailAddress)

	const messages = await db.transaction(async (tx) => {
		const user = await getUserByEmailAddress(validatedEmailAddress, tx)

		if (!user) {
			throw new Error(
				"No user found for email address: " + validatedEmailAddress
			)
		}

		const conversations = await db.execute(
			`
				SELECT conversations.*
				FROM conversations
				WHERE conversations.public_id = ?
			`,
			[validatedPublicId]
		)

		const conversation = conversations.rows[0] as undefined | ConversationRow

		if (!conversation) {
			throw new Error(
				"No conversation found for public id: " + validatedPublicId
			)
		}

		const userBelongsToConversation = doesUserBelongToConversation(
			user,
			conversation
		)

		if (!userBelongsToConversation) {
			throw new Error(
				"User does not belong to conversation with public id: " +
					validatedPublicId
			)
		}

		const messages = await tx.execute(
			`
			SELECT messages.*
			FROM messages
			WHERE messages.conversation_id = ?
			ORDER BY messages.created_at DESC
		`,
			[conversation.id]
		)

		return messages.rows as MessageRow[]
	})

	return messages
}

export const getAllMessagesForConversation = async (
	conversationPublicId: string
) => {
	const validatedConversationId = z.string().parse(conversationPublicId)

	const result = await db.transaction(async (tx) => {
		const conversation = (
			await tx.execute(
				`
			SELECT conversations.*
			FROM conversations
			WHERE conversations.public_id = ?
			LIMIT 1
			`,
				[validatedConversationId]
			)
		).rows[0] as undefined | ConversationRow

		if (!conversation) {
			throw new Error(
				"No conversation found for public id: " + validatedConversationId
			)
		}

		const messages = await db.execute(
			`
			SELECT messages.*
			FROM messages
			WHERE messages.conversation_id = ?
			ORDER BY messages.created_at DESC
		`,
			[conversation.id]
		)

		return {
			messages: messages.rows as MessageRow[],
			conversation
		}
	})

	return result
}

export const createSystemMessage = (
	message: string,
	conversationId: string
) => {
	const validatedMessage = z.string().parse(message)
	const validatedConversationId = z.string().parse(conversationId)

	return db.execute(
		`
	INSERT INTO messages (
		sender_type,
		content,
		conversation_id,
		public_id,
	) VALUES (?, ?, ?, ?, ?)
	`,
		["system", validatedMessage, validatedConversationId, nanoid(12)]
	)
}

export const createUserMessage = (
	message: string,
	conversationId: string,
	senderEmailAddress: string
) => {
	const validatedMessage = z.string().parse(message)
	const validatedConversationId = z.string().parse(conversationId)
	const validatedSenderEmailAddress = z.string().parse(senderEmailAddress)

	return db.transaction(async (tx) => {
		const user = await getUserByEmailAddress(validatedSenderEmailAddress, tx)

		if (!user) {
			throw new Error(
				"User not found for email address: " + validatedSenderEmailAddress
			)
		}

		return tx.execute(
			`
		INSERT INTO messages (
			sender_type,
			content,
			conversation_id,
			user_id,
			public_id
		) VALUES ('user', ?, ?, ?, ?)
		`,
			[validatedMessage, validatedConversationId, user.id, nanoid(12)]
		)
	})
}
