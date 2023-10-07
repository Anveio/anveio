import { BottomBar } from "@/components/custom/BottomBar";
import { CursorCanvas } from "@/components/custom/Cursors";
import { NavBar } from "@/components/custom/NavBar";
import { WithRoom } from "@/components/custom/Room";
import "@/lib/toasts/toast-styles.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { cookies } from "next/headers";
import * as React from "react";
import "./globals.css";
import { extractRouterConfig } from "uploadthing/server";
import { uploadThingFileRouter } from "@/lib/uploadthing-integ";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shovon Hasan - Blog",
  description: "Thoughts on software ngineering culture, and science",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");

  return (
    <ClerkProvider>
      <NextSSRPlugin
        routerConfig={extractRouterConfig(uploadThingFileRouter)}
      />
      <html lang="en">
        <WithRoom roomId="blog-home" currentPageId="/">
          <body className={cn(inter.className, theme?.value, "text-white")}>
            <NavBar />

            <div className="">
              <CursorCanvas />
              {children}
            </div>

            <BottomBar />
            <Analytics />
          </body>
        </WithRoom>
      </html>
    </ClerkProvider>
  );
}
