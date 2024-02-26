import { getUserForSessionToken } from '@/lib/auth/sign-in';
import { geolocation, ipAddress } from '@vercel/edge';
import { add } from 'date-fns';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSearchParamsSchema = z.object({
  sessionToken: z.string(),
});

export const runtime = 'edge';

export async function GET(request: Request) {
  const { set } = cookies();

  const searchParams = new URL(request.url).searchParams;

  const sessionTokenUnsafe = searchParams.get('sessionToken');

  const parseResult = requestSearchParamsSchema.safeParse({
    sessionToken: sessionTokenUnsafe,
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

  const { sessionToken } = parseResult.data;

  const maybeUser = await getUserForSessionToken(sessionToken);

  if (!maybeUser) {
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

  if (!maybeUser) {
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

  const requestUrl = new URL(request.url);

  set(`sessionToken`, sessionToken, {
    /**
     * Best practice would be to pull this from the session token itself but I'm too lazy.
     */
    expires: add(Date.now(), { days: 365 }),
    secure: true,
    domain: requestUrl.hostname,
    sameSite: 'strict',
    httpOnly: true,
    path: '/',
  });

  redirect('/?');
}
