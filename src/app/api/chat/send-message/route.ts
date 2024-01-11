import type { Message } from "ai";
import { AnveioInngestClient } from "@/lib/inngest";

export const runtime = "edge";

export async function POST(req: Request) {
  // if no requestId is provided we generate one
  const body = await req.json();
  const { messages } = body;

  // const requestId = nanoid();

  await AnveioInngestClient.send({
    name: "chat/global.message-send",
    data: {
      messages: messages as Message[],
      requestId: "",
    },
  });

  return new Response("" as string, { status: 200 });
}
