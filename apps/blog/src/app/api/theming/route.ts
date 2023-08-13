import { readStreamedRequestBody } from "@/lib/utils.edge";
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = await readStreamedRequestBody(req);
  const { theme } = body;

  console.log("Incoming theme", theme);

  const cookieStore = cookies();

  cookieStore.set("theme", theme, { secure: true, sameSite: "strict" });

  return NextResponse.json({ theme });
};
