import { OPEN_AI_GLOBAL_SINGLETON } from "@/lib/features/ai/openai/openAi";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { message } = req.body;

  const validatedMessage = z
    .string()
    .max(4096, "Message cannot be more than 4096 characters")
    .nonempty()
    .parse(message);

  if (!validatedMessage) {
    return res.status(400).json({
      message: "message is required",
    });
  }

  const { data } = await OPEN_AI_GLOBAL_SINGLETON.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [],
    temperature: 0.9,
    n: 1,
    max_tokens: 150,
    stream: false,
    stop: ["\n"],
  });

  // const response = data.choices[0].text;

  // const response = "Hello";

  return res.status(200).json({
    message: "success",
    response: data,
  });
};
