import { createSessionForUser } from '@/lib/auth/sign-in';
import { isPast } from 'date-fns';
import { db } from '@/lib/db';
import { emailVerificationTokens, users } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSearchParamsSchema = z.object({
  email: z.string().email(),
  verificationToken: z.string(),
});

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { set } = cookies();

  const searchParams = new URL(request.url).searchParams;

  const emailUnsafe = searchParams.get('email');

  const verficationTokenUnsafe = new URL(request.url).searchParams.get('token');

  const parseResult = requestSearchParamsSchema.safeParse({
    email: emailUnsafe,
    verificationToken: verficationTokenUnsafe,
  });

  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: parseResult.error,
      },
      {
        status: 400,
      }
    );
  }

  const { email, verificationToken } = parseResult.data;

  console.log(`Attempting to verify: ${email}`);

  const token = await getVerificationTokenForEmail(email, verificationToken);

  const isTokenPresent = !!token;

  if (!isTokenPresent) {
    /**
     * Early check so we don't attempt to read a property of an undefined value.
     */
    return NextResponse.json(
      {
        error: {
          verificationToken: 'Invalid verification token',
        },
      },
      {
        status: 400,
      }
    );
  }

  const isTokenExpired = isPast(token.expiresAt);
  const isTokenMatching = token.verificationToken === verificationToken;

  if (!isTokenMatching) {
    return NextResponse.json(
      {
        error: {
          verificationToken: 'Invalid verification token',
        },
      },
      {
        status: 400,
      }
    );
  }

  if (isTokenExpired) {
    return NextResponse.json(
      {
        error: {
          verificationToken: 'Expired verification token',
        },
      },
      {
        status: 400,
      }
    );
  }

  console.log(`Verifying email: ${email}`);

  /**
   * At this point, we know that the token is valid and we should verify the user's email.
   */
  await verifyEmail(token.id, email);

  const session = await createSessionForUser(email, request);

  console.log(`Email verified: ${email}`);

  const requestUrl = new URL(request.url);

  set(`sessionToken`, session.token, {
    expires: session.expirationDate,
    secure: true,
    domain: requestUrl.hostname,
    sameSite: 'strict',
    httpOnly: true,
    path: '/',
  });

  return Response.redirect(requestUrl.origin);
}

const getVerificationTokenForEmail = async (
  email: string,
  verificationToken: string
) => {
  const results = await db
    .select({
      id: emailVerificationTokens.id,
      expiresAt: emailVerificationTokens.expiresAt,
      verificationToken: emailVerificationTokens.token,
      email: emailVerificationTokens.email,
    })
    .from(emailVerificationTokens)
    .where(
      and(
        eq(emailVerificationTokens.email, email),
        eq(emailVerificationTokens.token, verificationToken)
      )
    )
    .limit(1)
    .execute();

  return results[0];
};

const verifyEmail = async (tokenId: number, emailAddress: string) => {
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
      throw new Error('Token not found');
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
      .select({ id: users.id, emailAddress: users.email })
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

    return userIdQuery[0];
  });
};

async function generate256BitToken(): Promise<string> {
  if (!crypto || !crypto.subtle) {
    throw new Error('Crypto API is not available in this environment.');
  }

  // Generate random values
  const randomValues = new Uint8Array(32); // 32 bytes (256 bits) for strong randomness
  crypto.getRandomValues(randomValues);

  // Convert the random values to a hex string for easier storage and handling
  const token = Array.from(randomValues)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return token;
}
