import { getUserForSessionToken } from "@/lib/auth/sign-in";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const cookieStore = cookies();

  const sessionTokenCookie = cookieStore.get("sessionToken")?.value;

  if (!sessionTokenCookie) {
    return NextResponse.json({
      error: "No session token",
    });
  }

  const maybeUser = sessionTokenCookie
    ? await getUserForSessionToken(sessionTokenCookie)
    : undefined;

  if (!maybeUser) {
    return NextResponse.json({
      error: "Invalid session token",
    });
  }

  return NextResponse.json({
    user: maybeUser,
  });
};
