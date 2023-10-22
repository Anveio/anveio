import type { Config } from "drizzle-kit";
import { DATABASE_URL } from "./environment";

export default {
  schema: "./src/lib/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString: DATABASE_URL,
  },
  out: "./src/lib/db/__generated__/migrations",
} satisfies Config;
