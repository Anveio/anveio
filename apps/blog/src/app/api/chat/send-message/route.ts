import { inngest } from "@/lib/inngest/client";
import type { Message } from "ai";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
);

export const runtime = "edge";

export async function POST(req: Request) {
  // if no requestId is provided we generate one
  const body = await req.json();
  const { messages } = body;

  const requestId = nanoid();

  await inngest.send({
    name: "chat/global.message-send",
    data: {
      messages: messages as Message[],
      requestId,
    },
  });

  return new Response(requestId as string, { status: 200 });
}
