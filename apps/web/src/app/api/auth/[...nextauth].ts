import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { z } from "zod";

const GITHUB_ID = z.string().parse(process.env.GITHUB_ID);
const GITHUB_SECRET = z.string().parse(process.env.GITHUB_SECRET);

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  ],
});

export { handler as GET, handler as POST };
