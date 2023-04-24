import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";
import { createDatabaseConnection } from "../planetscale/planetscale";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  checkIfPasswordIsValidForUserByEmail,
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
  callbacks: {
    async session(args) {
      console.log("Executing session callback");
      return args.session;
    },
    async signIn(options) {
      try {
        await createDatabaseConnection().transaction(async (tx) => {
          const userAlreadyExists = await getDoesUserAlreadyExist(
            options.user.email,
            tx
          );

          if (userAlreadyExists) {
            console.log("Skipping user creation -- already exists");
            return true;
          }
          /**
           * SQL string to insert into the users table
           */
          const createdUser = await tx.execute(
            `INSERT INTO users (username, email) VALUES (?, ?)`,
            [options.user.name, options.user.email]
          );
          console.log("IN HERE", createdUser);
          return [userAlreadyExists, createdUser];
        });
        return true;
      } catch (error) {
        console.error("ERROR", error);
        return false;
      }
    },
  },
};

export const nextAuthHandler = NextAuth(NEXT_AUTH_HANDLER_OPTIONS);
