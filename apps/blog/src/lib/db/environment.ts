import { z } from "zod";

export const DATABASE_URL = z
  .string({
    required_error: "DATABASE_URL missing",
  })
  .parse(process.env.DATABASE_URL);
