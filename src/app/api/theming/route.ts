import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: NextRequest, res: NextResponse) => {
  if (!req.body) {
    return NextResponse.json(
      {
        error: "No body found in request",
      },
      {
        status: 400,
      }
    );
  }

  const body = await req.json()
  const { theme } = body;

  const cookieStore = cookies();

  cookieStore.set("theme", theme, { secure: true, sameSite: "strict" });

  return NextResponse.json({ theme });
};
