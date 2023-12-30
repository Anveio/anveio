import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Config } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL missing");
}

const config = {
  url: DATABASE_URL,
}

const connection = connect(config);

export const db = drizzle(connection, {});

export default {
  schema: "./schema.ts",
  driver: "mysql2",
  uri: DATABASE_URL,
  out: "./__generated__/migrations",
} as const

export * from './schema'