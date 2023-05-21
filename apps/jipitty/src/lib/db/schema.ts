// db.ts
import {
	datetime,
	bigint,
    timestamp,
	mysqlEnum,
	mysqlTable,
	varchar,
	json,
	uniqueIndex
} from "drizzle-orm/mysql-core"

// declaring enum in database
export const users = mysqlTable(
	"users",
	{
		id: bigint("id", { mode: "number" }).primaryKey().notNull().autoincrement(),
		username: varchar("username", { length: 256 }),
		email: varchar("email", { length: 256 }).notNull(),
		email_verified_at: datetime("email_verified_at").notNull(),
		created_at: timestamp("created_at").defaultNow(),
		updated_at: datetime("updated_at").notNull(),
		public_id: varchar("public_id", { length: 12 }).notNull()
	},
	(row) => ({
		emailIndex: uniqueIndex("email").on(row.email)
	})
)

export const conversations = mysqlTable("conversations", {
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	participants: json("participants"),
	admin_id: bigint("admin_id", { mode: "number" }).references(() => users.id),
	title: varchar("title", { length: 256 }),
	visibility: mysqlEnum("visibility", ["private", "public", "url", "shared"]),
	created_at: timestamp("created_at").defaultNow(),
	updated_at: datetime("updated_at"),
	public_id: varchar("public_id", { length: 12 }),
	created_by_user_id: bigint("created_by_user_id", {
		mode: "number"
	}).references(() => users.id)
})

export const messages = mysqlTable("messages", {
	id: bigint("id", { mode: "number" }).primaryKey(),
	conversationId: bigint("conversation_id", { mode: "number" })
		.references(() => conversations.id)
		.notNull(),
	userId: bigint("user_id", { mode: "number" }).references(() => users.id),
	content: varchar("content", { length: 256 }),
    createdAt: timestamp("created_at").defaultNow(),
    publicId: varchar("public_id", { length: 12 }),
    senderType: mysqlEnum("sender_type", ["user", "system", "gpt-3.5-turbo"])
})
