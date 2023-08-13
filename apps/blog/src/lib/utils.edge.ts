import "@edge-runtime/ponyfill";
import { NextRequest } from "next/server";
import { NextApiRequest } from "next";

export const readStreamedRequestBody = async (
  request: NextRequest | NextApiRequest
) => {
  if (!request.body) {
    return {};
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    body += decoder.decode(value, { stream: true });
  }

  body += decoder.decode(); // Flush the remaining bytes

  if (!body) {
    return {};
  }

  return JSON.parse(body);
};
