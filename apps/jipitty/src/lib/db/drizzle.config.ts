import type { Config } from "drizzle-kit"
import { DATABASE_HOST, DATABASE_PASSWORD, DATABASE_USERNAME,  } from "./environment"

export default {
	schema: "./schema.ts",
	dbCredentials: {
		url: DATABASE_URL
		user: DATABASE_USERNAME,
		password: DATABASE_PASSWORD,
		host: DATABASE_HOST,
	}
} satisfies Config
