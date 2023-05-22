import { InferModel } from "drizzle-orm"
import { conversations, users } from "./schema"

export type ConversationRow = InferModel<typeof conversations, "select">

export type UserRow = InferModel<typeof users, "select">

export type MessageRow = InferModel<typeof conversations, "messages">
