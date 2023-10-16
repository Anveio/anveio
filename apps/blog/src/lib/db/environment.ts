import { z } from "zod";

export const DATABASE_HOST = z
  .string({
    required_error: "DATABASE_HOST missing",
  })
  .parse(process.env.DATABASE_HOST);
export const DATABASE_USERNAME = z
  .string({
    required_error: "DATABASE_USERNAME missing",
  })
  .parse(process.env.DATABASE_USERNAME);

export const DATABASE_PASSWORD = z
  .string({
    required_error: "DATABASE_PASSWORD missing",
  })
  .parse(process.env.DATABASE_PASSWORD);
