import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { DATABASE_URL } from "./environment";

const connection = connect({
  url: DATABASE_URL,
});

export const db = drizzle(
  connection,
  process.env.NODE_ENV === "development"
    ? {
        logger: {
          logQuery: console.log,
        },
      }
    : undefined
);
