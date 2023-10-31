import { add, isPast } from "date-fns";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "../db/db";
import { emailVerificationTokens, sessions, users } from "../db/schema";
import { generate256BitToken } from "../utils.server";

/**
 * Returns a user in exchange for a session token.
 *
 * If the session token is expired, returns undefined.
 * @param sessionToken
 * @returns
 */
export const getUserForSessionToken = async (sessionToken: string) => {
  return db.transaction(async (tx) => {
    const sessionTokenQueryResult = await tx
      .select({
        userId: sessions.userId,
        sessionToken: sessions.sessionToken,
        expiresAt: sessions.expiresAt,
      })
      .from(sessions)
      .where(eq(sessions.sessionToken, sessionToken))
      .limit(1)
      .execute();

    const dbSessionToken = sessionTokenQueryResult[0];

    if (dbSessionToken == undefined) {
      console.log(`Invalid session token used to attempt to authenticate.`);
      return undefined;
    }

    if (isPast(dbSessionToken.expiresAt)) {
      console.log(
        `Expired session token starting with ${sessionToken.slice(
          0,
          5
        )} used for login`
      );
      return undefined;
    }

    const userQueryResult = await tx
      .select({
        id: users.publicId,
        email: users.email,
        emailVerifiedAt: users.emailVerifiedAt,
      })
      .from(users)
      .where(eq(users.id, dbSessionToken.userId))
      .limit(1)
      .execute();

    const user = userQueryResult[0];

    if (user == undefined) {
      console.error(
        `User not found for session token ${sessionToken} when querying for id: ${dbSessionToken.userId}`
      );
    }

    return user;
  });
};

export const validateSessionToken = async (
  sessionToken: string
): Promise<boolean> => {
  return db.transaction(async (tx) => {
    const sessionTokenQueryResult = await tx
      .select({
        userId: sessions.userId,
        sessionToken: sessions.sessionToken,
        expiresAt: sessions.expiresAt,
      })
      .from(sessions)
      .where(eq(sessions.sessionToken, sessionToken))
      .limit(1)
      .execute();

    const dbSessionToken = sessionTokenQueryResult[0];

    if (dbSessionToken == undefined) {
      console.log(`Invalid session token used to attempt to authenticate.`);
      return false;
    }

    if (isPast(dbSessionToken.expiresAt)) {
      console.log(
        `Expired session token starting with ${sessionToken.slice(
          0,
          5
        )} used for login`
      );
      return false;
    }

    return true;
  });
};

export const expireSessionToken = async (sessionToken: string) => {
  return db.transaction(async (tx) => {
    tx.update(sessions)
      .set({
        expiresAt: new Date(),
      })
      .where(eq(sessions.sessionToken, sessionToken));
  });
};

export const createSessionForUser = async (
  emailAddress: string,
  request: NextRequest
) => {
  /**
   * Generate a session token for the user
   */
  const sessionToken = await generate256BitToken();

  return db.transaction(async (tx) => {
    const currentDate = new Date();

    /**
     * Sadly, we need the ID of the user to create a session token for them
     * but Drizzle ORM doesn't support getting back the full row that was updated
     * for MySQL: https://orm.drizzle.team/docs/update
     *
     * So we make an additional query for the user we just updated. Sigh.
     */

    const userIdQuery = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, emailAddress))
      .limit(1)
      .execute();

    const userId = userIdQuery[0]?.id;

    if (!userId) {
      throw new Error(
        `Failed to find user while verifying email: ${emailAddress}. This should never happen.`
      );
    }

    const expirationDate = add(currentDate, { days: 365 });

    /**
     * Create a session token in the database
     */
    const sessionInsertion = await tx
      .insert(sessions)
      .values({
        expiresAt: expirationDate,
        sessionToken: sessionToken,
        userId: Number(userId),
        createdAt: new Date(),
      })
      .execute();

    return {
      token: sessionToken,
      expirationDate,
    };
  });
};

export const verifyEmailAndGenerateSessionToken = async (
  tokenId: number,
  emailAddress: string
) => {
  /**
   * Generate a session token for the user
   */
  const sessionToken = await generate256BitToken();
  return db.transaction(async (tx) => {
    /**
     * Expire the verification token.
     */
    const tokenExpirationResult = await tx
      .update(emailVerificationTokens)
      .set({
        expiresAt: new Date(),
      })
      .where(eq(emailVerificationTokens.id, tokenId))
      .execute();

    if (tokenExpirationResult.rowsAffected === 0) {
      throw new Error("Token not found");
    }

    const currentDate = new Date();

    /**
     * Update the user's emailVerifiedAt timestamp.
     */
    await tx
      .update(users)
      .set({
        emailVerifiedAt: currentDate,
      })
      .where(eq(users.email, emailAddress))
      .execute();

    /**
     * Sadly, we need the ID of the user to create a session token for them
     * but Drizzle ORM doesn't support getting back the full row that was updated
     * for MySQL: https://orm.drizzle.team/docs/update
     *
     * So we make an additional query for the user we just updated. Sigh.
     */

    const userIdQuery = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, emailAddress))
      .limit(1)
      .execute();

    const userId = userIdQuery[0]?.id;

    if (!userId) {
      throw new Error(
        `Failed to find user while verifying email: ${emailAddress}. This should never happen.`
      );
    }

    const expirationDate = add(currentDate, { days: 365 });

    /**
     * Create a session token in the database
     */
    await tx
      .insert(sessions)
      .values({
        expiresAt: expirationDate,
        sessionToken: sessionToken,
        userId: Number(userId),
        createdAt: new Date(),
      })
      .execute();

    return {
      token: sessionToken,
      expirationDate,
    };
  });
};
