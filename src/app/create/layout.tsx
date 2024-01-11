import { getUserForSessionToken } from "@/lib/auth/sign-in";
import { cookies } from "next/headers";
import Link from "next/link";
import * as React from "react";

export default async function CreateLayout(props: React.PropsWithChildren<{}>) {
  const cookieStore = cookies();

  const sessionTokenCookie = cookieStore.get("sessionToken")?.value;

  const maybeUser = sessionTokenCookie
    ? await getUserForSessionToken(sessionTokenCookie)
    : undefined;

  if (!maybeUser) {
    return (
      <div className="min-w-screen min-h-screen  bg-zinc-950">
        <div className="max-w-4xl m-auto py-3 sm:py-4 ">
          <div className="py-4">
            <Link href="/" scroll={false}>
              {"<-"} Home
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-50">
                You must be signed in to access this page.
              </h1>
              <div className="mt-4">
                <Link href="/auth/sign-in">Sign in</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-screen min-h-screen  bg-zinc-950">
      <div className="max-w-4xl m-auto py-3 sm:py-4 ">
        <div className="py-4">
          <Link href="/" scroll={false}>
            {"<-"} Home
          </Link>
        </div>
        {props.children}
      </div>
    </div>
  );
}
