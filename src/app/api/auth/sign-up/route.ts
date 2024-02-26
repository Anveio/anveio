import { hashPassword } from '@/lib/auth/argon2';
import { db } from '@/lib/db';
import { emailVerificationTokens, users } from '@/lib/db/schema';
import { generate256BitToken } from '@/lib/utils.server';
import { addDays } from 'date-fns';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSearchParamsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const insertUserSchema = z.object({
  email: z.string().email(),
  passwordHash: z.string(),
  publicId: z.string(),
});

export async function POST(request: Request) {
  const parsedBody = await request.json().catch((e) => {
    return undefined;
  });

  if (parsedBody == undefined) {
    return NextResponse.json(
      {},
      {
        status: 400,
      }
    );
  }

  const emailUnsafe = parsedBody.email;
  const passwordUnsafe = parsedBody.password;

  const parseResult = requestSearchParamsSchema.safeParse({
    email: emailUnsafe,
    password: passwordUnsafe,
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

  const passwordHash = await hashPassword(parseResult.data.password);

  const publicId = nanoid(12);

  const putativeUser = insertUserSchema.parse({
    email: emailUnsafe,
    passwordHash: passwordHash,
    publicId,
  });

  const verificationToken = await generate256BitToken();

  try {
    await createUser(putativeUser, verificationToken);

    // await sendAccountVerificationEmail({
    //   destinationEmailAddress: parseResult.data.email,
    //   verificationToken: verificationToken,
    // });

    return NextResponse.json(
      {
        publicId,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (/AlreadyExists|Duplicate/i.test((error as any)?.body?.message)) {
      console.warn(`User already exists: ${parseResult.data.email}`);
      console.warn(error);
      return NextResponse.json(
        {},
        {
          status: 200,
        }
      );
    }
    console.error(error);

    return NextResponse.json(
      {},
      {
        status: 500,
      }
    );
  }
}

const createUser = (
  row: z.infer<typeof insertUserSchema>,
  verificationToken: string
) => {
  const validatedRow = insertUserSchema.parse(row);
  return db.transaction(async (tx) => {
    const userInsertion = await tx.insert(users).values(validatedRow).execute();

    const currentDate = new Date();

    const expirationDay = addDays(currentDate, 365);

    return tx.insert(emailVerificationTokens).values({
      userId: Number(userInsertion.insertId),
      email: row.email,
      token: verificationToken,
      expiresAt: expirationDay,
    });
  });
};
