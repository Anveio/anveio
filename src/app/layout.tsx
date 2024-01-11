import { UserProvider } from "@/components/custom/Auth/UserProvider";
import { Toaster } from "@/components/ui/toaster";
import { CustomAnalytics } from "@/lib/analytics/analytics.client";
import { getUserForSessionToken } from "@/lib/auth/sign-in";
import "@/lib/toasts/toast-styles.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import Image from "next/image";
import * as React from "react";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Anveio - Shovon Hasan - Blog",
  description:
    "Thoughts on software engineering, culture, and science from Shovon Hasan (Anveio).",
  "view-transition": "same-origin",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");

  const sessionTokenCookie = cookieStore.get("sessionToken")?.value;

  const maybeUser = sessionTokenCookie
    ? await getUserForSessionToken(sessionTokenCookie)
    : undefined;

  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, theme?.value, "dark:text-slate-50")}>
        <Image
          src={"/bghero.webp"}
          priority
          alt=""
          width={1000}
          height={1000}
          className="pointer-events-none absolute left-0 -right-20 h-full w-full select-none md:block"
          style={{ color: "transparent" }}
        />
        <React.Suspense>
          <UserProvider user={maybeUser}>
            <div>{children}</div>
            <Toaster />
            <Analytics />
            <CustomAnalytics />
          </UserProvider>
        </React.Suspense>
      </body>
    </html>
  );
}
