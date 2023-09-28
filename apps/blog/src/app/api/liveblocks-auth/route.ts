import { auth } from "@clerk/nextjs";
import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const LIVEBLOCKS_SECRET = process.env.LIVEBLOCKS_SECRET_KEY;

if (!LIVEBLOCKS_SECRET) {
  throw new Error("Missing LIVEBLOCKS_SECRET_KEY environment variable");
}

const liveblocks = new Liveblocks({
  secret: LIVEBLOCKS_SECRET,
});

export async function POST(request: NextRequest) {
  const requestSession = auth();
  const { userId } = requestSession;

  if (!userId) {
    return new Response(undefined, { status: 403 });
  }

  const session = liveblocks.prepareSession(userId);

  // Implement your own security, and give the user access to the room
  const { room } = await request.json();
  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
