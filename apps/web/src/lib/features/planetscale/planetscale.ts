import { Client } from "@planetscale/database";
import { z } from "zod";

const DATABASE_HOST = z
  .string({
    required_error: "DATABASE_HOST missing",
  })
  .parse(process.env.DATABASE_HOST);
const DATABASE_USERNAME = z
  .string({
    required_error: "DATABASE_USERNAME missing",
  })
  .parse(process.env.DATABASE_USERNAME);

const DATABASE_PASSWORD = z
  .string({
    required_error: "DATABASE_PASSWORD missing",
  })
  .parse(process.env.DATABASE_PASSWORD);

const config = {
  host: DATABASE_HOST,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
};

export const GLOBAL_DATABASE_CONNECTION = new Client(config).connection();

export const createDatabaseConnection = () => {
  const connection = new Client(config).connection();
  return connection;
};
