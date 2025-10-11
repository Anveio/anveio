import { defineSchema } from 'convex/server'
import { accountTables } from './schema/account'
import { contentTables } from './schema/content'
import { sessionTables } from './schema/session'
import { userTables } from './schema/user'

/**
 * The ONLY thing that should ever be exported from this file
 */
export default defineSchema({
  ...userTables,
  ...sessionTables,
  ...accountTables,
  ...contentTables,
})
