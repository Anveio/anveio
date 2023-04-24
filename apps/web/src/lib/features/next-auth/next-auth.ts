import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";
import { createDatabaseConnection } from "../planetscale/planetscale";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  checkIfPasswordIsValidForUserByEmail,
  createUserWithOAuthToken,
  getDoesUserAlreadyExist,
} from "../planetscale/utils";

const GITHUB_CLIENT_ID = z
  .string({
    required_error: "GITHUB_SECRET missing",
  })
  .parse(process.env.GITHUB_CLIENT_ID);
const GITHUB_SECRET = z
  .string({
    required_error: "GITHUB_SECRET missing",
  })
  .parse(process.env.GITHUB_SECRET);

const GOOGLE_CLIENT_ID = z
  .string({
    required_error: "GITHUB_SECRET missing",
  })
  .parse(process.env.GOOGLE_CLIENT_ID);

const GOOGLE_SECRET = z
  .string({
    required_error: "GOOGLE_SECRET missing",
  })
  .parse(process.env.GOOGLE_SECRET);

const NEXTAUTH_SECRET = z
  .string({
    required_error: "NEXTAUTH_SECRET missing",
  })
  .parse(process.env.NEXTAUTH_SECRET);

export const NEXT_AUTH_HANDLER_OPTIONS: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_SECRET,
    }),
  ],
  secret: NEXTAUTH_SECRET,
  logger: {
    debug: console.log,
    error: console.error,
    warn: console.warn,
  },
  callbacks: {
    async session(args) {
      console.log(args.session);
      return args.session;
    },
    async signIn(options) {
      try {
        await createUserWithOAuthToken(
          options.user.email,
          options.account?.access_token,
          "github"
        );
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
};

export const nextAuthHandler = NextAuth(NEXT_AUTH_HANDLER_OPTIONS);
