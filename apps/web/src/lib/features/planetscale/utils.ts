import { z } from "zod";
import { GLOBAL_DATABASE_CONNECTION } from "./planetscale";
import { Transaction } from "@planetscale/database";
import { argon2d, hash, verify } from "argon2";

export const getDoesUserAlreadyExist = async (
  email?: string | null,
  tx?: Transaction
) => {
  if (!email) {
    return false;
  }

  const validatedEmail = z
    .string({
      required_error: "Email is required",
    })
    .email()
    .parse(email);

  const userAlreadyExistsQuery = (tx || GLOBAL_DATABASE_CONNECTION).execute(
    `SELECT * FROM users WHERE email = ? LIMIT 1`,
    [validatedEmail]
  );

  const queryResult = await userAlreadyExistsQuery;

  return queryResult.rows.length > 0;
};

const generatePasswordHash = async (password: string) => {
  const hashedPassword = await hash(password, {
    salt: Buffer.from(
      "b5108428bd29d1c4a6ec2555e9473db2f381139979b9d9107a16ad83171d3659"
    ),
  });
  return hashedPassword;
};

export const createUser = async () => {};

export const checkIfPasswordIsValidForUserByEmail = async (
  email: string,
  password: string,
  tx?: Transaction
) => {
  const validatedEmail = z.string().email().parse(email);
  const { rows } = await (tx || GLOBAL_DATABASE_CONNECTION).execute(
    `SELECT password_hash FROM users WHERE email = ? LIMIT 1`,
    [validatedEmail]
  );

  const passwordHashField: unknown = rows[0].at(0) as unknown;

  console.log("passwordHashField", passwordHashField);

  const password_hash = z.string().parse(passwordHashField);

  return verify(password_hash, password);
};

