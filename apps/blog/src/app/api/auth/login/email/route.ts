import { doesPasswordMatchHash } from "@/lib/auth/argon2";
import { createSessionForUser } from "@/lib/auth/sign-in";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { users } from '@/lib/db/schema'

const requestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();

  const { set } = cookies();

  const emailUnsafe = String(formData.get("email"));
  const passwordUnsafe = String(formData.get("password"));

  const parseResult = requestSchema.safeParse({
    email: emailUnsafe,
    password: passwordUnsafe,
  });

  if (!parseResult.success) {
    console.log(
      `BadRequest: ${JSON.stringify(
        {
          email: emailUnsafe,
          password: passwordUnsafe,
        },
        null,
        2
      )}`
    );
    return NextResponse.json(
      {
        error: parseResult.error,
      },
      {
        status: 400,
      }
    );
  }


  const user = await getPasswordHashForUserByEmailAddress(parseResult.data.email);

  if (!user) {
    return NextResponse.json(
      {
        error: {
          email: "No user found with that email address",
        },
      },
      {
        status: 401,
      }
    );
  }

  const { email, passwordHash, publicId } = user

  if (!passwordHash) {
    return NextResponse.json(
      {
        error: {
          password: "Incorrect password",
        },
      },
      {
        status: 401,
      }
    );
  }

  const doesPasswordMatch = await doesPasswordMatchHash(
    passwordHash,
    parseResult.data.password
  );

  if (!doesPasswordMatch) {
    return NextResponse.json(
      {
        error: {
          password: "Incorrect password",
        },
      },
      {
        status: 401,
      }
    );
  }

  /**
   * Generate a session token.
   */
  const session = await createSessionForUser(email, request);

  const requestUrl = new URL(request.url);

  set("sessionToken", session.token, {
    expires: session.expirationDate,
    secure: true,
    domain: requestUrl.hostname,
    sameSite: "strict",
    httpOnly: true,
    path: "/",
  });

  return NextResponse.json({
    email,
    id: publicId,
  });
};

const getPasswordHashForUserByEmailAddress = async (emailAddress: string) => {
  const results = await db
    .select({
      passwordHash: users.passwordHash,
      email: users.email,
      publicId: users.publicId,
    })
    .from(users)
    .where(
      eq(users.email, emailAddress)
    )
    .limit(1)
    .execute();

  const firstRow = results[0];

  return firstRow
};
