import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Config } from "drizzle-kit";

import { z } from "zod";

export const DATABASE_URL = z
  .string({
    required_error: "DATABASE_URL missing",
  })
  .parse(process.env.DATABASE_URL);

const connection = connect({
  url: DATABASE_URL,
});

export const db = drizzle(connection, {});

export default {
  schema: "./src/lib/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: DATABASE_URL,
  },
  out: "./src/lib/db/__generated__/migrations",
} satisfies Config;
