import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Config } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL missing");
}

const connection = connect({
  url: DATABASE_URL,
});

export const db = drizzle(connection, {});

export default {
  schema: "./schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: DATABASE_URL,
  },
  out: "./__generated__/migrations",
} satisfies Config;

export * from './schema'
export * from './drizzle-orm'