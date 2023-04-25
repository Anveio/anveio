import { Configuration, OpenAIApi } from "openai";
import { z } from "zod";

const OPEN_AI_SECRET = z
  .string({
    required_error: "OPEN_AI_SECRET missing",
  })
  .parse(process.env.OPENAI_SECRET);

const configuration = new Configuration({
  organization: "org-Ove5In1nqMWm1R9OrtIpY9mP",
  apiKey: OPEN_AI_SECRET,
});

export const OPEN_AI_GLOBAL_SINGLETON = new OpenAIApi(configuration);
