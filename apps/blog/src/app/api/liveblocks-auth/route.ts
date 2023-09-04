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
  const x = auth();
  const { userId, user } = x;

  console.log("userId", userId);
  console.log("s", x);

  if (!userId || !user) {
    const randomId = nanoid();
    console.log("Generated random ID for unauthenticated user", randomId);

    const session = liveblocks.prepareSession(
      randomId,
      {
        userInfo: {
          username: "Anonymous-" + randomId,
        },
      } // Optional
    );

    const { room } = await request.json();
    if (room) {
      session.allow(room, session.READ_ACCESS);
    }

    // Authorize the user and return the result
    const { status, body } = await session.authorize();
    return new Response(body, { status });
  }

  const session = liveblocks.prepareSession(
    userId,
    {
      userInfo: {
        username: user.firstName,
      },
    } // Optional
  );

  // Implement your own security, and give the user access to the room
  const { room } = await request.json();
  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
