import { OpenAIEdgeClient } from "@/lib/features/ai/openai/edge-client";
import { OPEN_AI_SECRET } from "@/lib/features/ai/openai/openAi";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const responseStream = await OpenAIEdgeClient(
    "chat",
    {
      model: "gpt-3.5-turbo",
      messages: [],
      temperature: 0.9,
      n: 1,
      max_tokens: 150,
      stream: true,
      stop: ["\n"],
    },
    {
      apiKey: OPEN_AI_SECRET,
    }
  );

  return responseStream;
};
