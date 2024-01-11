import { readStreamedRequestBody } from "@/lib/utils.edge.server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const body = await readStreamedRequestBody(req);
  const { theme } = body;

  const cookieStore = cookies();

  cookieStore.set("theme", theme, { secure: true, sameSite: "strict" });

  return NextResponse.json({ theme });
};
