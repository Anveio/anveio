import type * as Party from "partykit/server";
import { z } from "zod";

export type User = {
  id: string;
  email: string;
};

const userParser = z.object({
  id: z.string(),
  email: z.string().email(),
});

/**
 * Authenticate the user against the NextAuth API of the server that proxied the request
 */
export const getNextAuthSession = async (proxiedRequest: Party.Request) => {
  const headers = proxiedRequest.headers;
  const origin = headers.get("origin") ?? "";
  const cookie = headers.get("cookie") ?? "";

  const url = `${origin}/api/auth/session-cookie-to-user`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Cookie: cookie,
    },
  });

  if (res.ok) {
    const session = await res.json();

    const parseResult = userParser.safeParse(session.user);

    if (!parseResult.success) {
      console.error(
        "Problem in response from API when exchanging session cookie for user object",
        parseResult.error
      );
      return null;
    }

    return parseResult.data;
  } else {
    console.error("Failed to authenticate user", await res.text());
  }

  return null;
};
