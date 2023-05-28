// db.ts
import {
	bigint,
	mysqlEnum,
	mysqlTable,
	text,
	timestamp,
	varchar
} from "drizzle-orm/mysql-core"

export const conversations = mysqlTable("conversations", {
	id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
	createdbyUserId: varchar("created_by_user_id", { length: 64 }).notNull(),
	adminId: varchar("admin_id", { length: 64 }).notNull().notNull(),
	title: varchar("title", { length: 256 }),
	visibility: mysqlEnum("visibility", [
		"private",
		"public",
		"url",
		"shared"
	]).default("private"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	publicId: varchar("public_id", { length: 12 }).notNull()
})

export const messages = mysqlTable("messages", {
	id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
	conversationId: bigint("conversation_id", { mode: "number" })
		.references(() => conversations.id)
		.notNull(),
	userId: varchar("user_id", { length: 64 }),
	content: text("content").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	publicId: varchar("public_id", { length: 12 }).notNull(),
	senderType: mysqlEnum("sender_type", [
		"user",
		"system",
		"gpt-3.5-turbo"
	]).notNull()
})
