export const dynamic = "force-dynamic";
import { db } from "db";
import { sessions } from "db/schema";
import { eq } from "db/drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "edge";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const { get, set } = cookies();

  const sessionToken = get("sessionToken");

  const redirectUrl = new URL(`${requestUrl.origin}/logged-out`);

  if (!sessionToken) {
    redirect(requestUrl.origin);
  }

  await expireSessionForUser(sessionToken.value);
  set("sessionToken", sessionToken.value, {
    expires: new Date(),
  });

  redirect(requestUrl.origin);
}

const expireSessionForUser = async (sessionToken: string) => {
  return db
    .update(sessions)
    .set({
      expiresAt: new Date(),
    })
    .where(eq(sessions.sessionToken, sessionToken));
};
