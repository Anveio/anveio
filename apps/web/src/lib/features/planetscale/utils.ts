import { z } from "zod";
import { GLOBAL_DATABASE_CONNECTION } from "./planetscale";
import { Transaction } from "@planetscale/database";
import argon2 from "argon2";

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
  const hashedPassword = await argon2.hash(password, {
    salt: Buffer.from(
      "b5108428bd29d1c4a6ec2555e9473db2f381139979b9d9107a16ad83171d3659"
    ),
  });
  return hashedPassword;
};

export const getUserByEmailAddress = async (
  emailAddress: string,
  tx?: Transaction
) => {
  const validatedEmail = z.string().email().parse(emailAddress);
  const { rows } = await (tx || GLOBAL_DATABASE_CONNECTION).execute(
    `SELECT id, username, email FROM users WHERE email = ? LIMIT 1`,
    [validatedEmail]
  );

  return rows[0] as
    | {
        id: string;
        username: string | null;
        email: string;
      }
    | undefined;
};

export const createUserWithOAuthToken = async (
  emailAddress: string | undefined | null,
  oAuthToken: string | undefined | null,
  oAuthProvider: string | undefined | null,
  refresh_token: string | undefined | null
) => {
  const validatedEmail = z

    .string({
      required_error: "Missing email",
    })
    .describe("Email")
    .email({
      message: "Invalid email",
    })

    .parse(emailAddress);
  const validatedOAuthToken = z
    .string()
    .describe("OAuth Token")
    .parse(oAuthToken);
  const validatedOAuthProvider = z
    .string()
    .describe("OAuth Provider")
    .parse(oAuthProvider);
  const validatedRefreshToken = z
    .string()
    .optional()
    .describe("OAuth Refresh Token")
    .parse(refresh_token);

  await GLOBAL_DATABASE_CONNECTION.transaction(async (tx) => {
    const user = await getUserByEmailAddress(validatedEmail, tx);

    if (user) {
      console.log("Found user: ", user);
      const userId = user.id;
      /**
       * Check if this token exists in our DB for this user already
       */
      const maybeExistingTokenQuery = await tx.execute(
        `
        SELECT id, expires_at
        FROM oauth_tokens
        WHERE user_id = ?
        `,
        [Number(userId)]
      );

      const maybeExistingToken = maybeExistingTokenQuery.rows[0] as
        | {
            id: string;
            expiresAt: Date;
          }
        | undefined;

      if (maybeExistingToken) {
        console.log("Found existing token", maybeExistingToken);
        const { id: existingOauthTokenId } = maybeExistingToken;

        /**
         * Expire the user's oauth token
         */
        await tx.execute(
          `UPDATE oauth_tokens SET expires_at = NOW() WHERE id = ?`,
          [Number(existingOauthTokenId)]
        );
      }

      /**
       * Create a new oauthTokenfor the user
       */
      await tx.execute(
        `INSERT INTO oauth_tokens (user_id, oauth_provider_name, access_token, token_type) 
       VALUES (?, ?, ?, 'Bearer') ON DUPLICATE KEY UPDATE access_token = ?;`,
        [
          userId,
          validatedOAuthProvider,
          validatedOAuthToken,
          validatedOAuthToken,
        ]
      );
    } else {
      /**
       * Create the user and the oauth token for them
       */
      console.log("Creating new User");
      await tx.execute(
        `INSERT INTO users (email, password_hash) VALUES (?, NULL)`,
        [validatedEmail]
      );

      console.log("Creating an OAuth token for the user");
      await tx.execute(
        `
        INSERT INTO oauth_tokens (user_id, oauth_provider_name, access_token, refresh_token, token_type)
        VALUES (
          (SELECT id FROM users WHERE email = ?),
          ?,
          ?,
          ?,
          'Bearer'
        )
        `,
        [
          validatedEmail,
          validatedOAuthProvider,
          validatedOAuthToken,
          validatedRefreshToken || null,
        ]
      );
    }
  });
};

export const createOauthTokenForUserByEmail = (
  email: string,
  oauthProviderName: string,
  access_token: string
) => {};

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

  const password_hash = z.string().parse(passwordHashField);

  return argon2.verify(password_hash, password);
};
