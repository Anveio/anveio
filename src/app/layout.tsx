import { UserProvider } from "@/components/custom/Auth/UserProvider";
import { NavBar } from "@/components/custom/Navbar/NavBar";
import { NetworkLayer } from "@/components/custom/NetworkLayer/NetworkLayer";
import { Toaster } from "@/components/ui/toaster";
import { CustomAnalytics } from "@/lib/analytics/analytics.client";
import { getUserForSessionToken } from "@/lib/auth/sign-in";
import { getThemeCookieValue } from "@/lib/theming/theming.server";
import "@/lib/toasts/toast-styles.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import * as React from "react";
import "./globals.css";
import { HtmlElement } from "@/lib/theming/ThemeProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Anveio - Shovon Hasan - Blog",
  description:
    "Thoughts on software engineering, culture, and science from Shovon Hasan (Anveio).",
  "view-transition": "same-origin",
};

const Scene = dynamic(() => import("@/components/custom/3d/Scene"), {
  ssr: false,
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const sessionTokenCookie = cookieStore.get("sessionToken")?.value;

  const maybeUser = sessionTokenCookie
    ? await getUserForSessionToken(sessionTokenCookie)
    : undefined;

  const themeCookieValue = getThemeCookieValue(cookieStore);

  console.log(themeCookieValue);

  return (
    <NetworkLayer>
      <HtmlElement initialTheme={themeCookieValue}>
        <body
          className={cn(
            inter.className,
            "bg-background dark:bg-slate-950 transition-colors duration-500"
          )}
        >
          <React.Suspense>
            <UserProvider user={maybeUser}>
              <NavBar />
              <div>{children}</div>
              <Toaster />
              <Analytics />
              <CustomAnalytics />
            </UserProvider>
          </React.Suspense>
          <Scene />
        </body>
      </HtmlElement>
    </NetworkLayer>
  );
}
