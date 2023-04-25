import { OpenAIEdgeClient } from "@/lib/features/ai/openai/edge-client";
import { OPEN_AI_SECRET } from "@/lib/features/ai/openai/openAi";
import { NEXT_AUTH_HANDLER_OPTIONS } from "@/lib/features/next-auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const session = await getServerSession(NEXT_AUTH_HANDLER_OPTIONS);

    if (!session) {
      return new NextResponse(new ReadableStream());
    }

    const responseStream = await OpenAIEdgeClient(
      "chat",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            content:
              "How do I Parse a ReadableStream in a request body in nodeJS without using a package?",
            role: "user",
          },
        ],
      },
      {
        apiKey: OPEN_AI_SECRET,
      }
    );

    return new NextResponse(responseStream);
  } catch (e) {
    console.error("ERROR", e);
    return new NextResponse(new ReadableStream());
  }
};
