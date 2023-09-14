import { ManageAccountMenu } from "@/components/ManageAccountMenu";
import { Button } from "@/components/ui/button";
import "@/lib/toasts/toast-styles.css";
import { cn } from "@/lib/utils";
import { ClerkProvider, auth } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import Link from "next/link";
import * as React from "react";
import "./globals.css";
import { WithRoom } from "@/components/custom/Room";
import { BottomBar } from "@/components/custom/BottomBar";
import { NavBar } from "@/components/custom/NavBar";

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
      <html lang="en">
        <WithRoom roomId="blog-home" currentPageId="/">
          <body
            className={cn(
              inter.className,
              theme?.value,
              "text-white",
              "flex flex-col h-screen"
            )}
          >
            <div className="fixed top-2 left-0 right-0 z-50">
              <div className="flex justify-center">
                <NavBar />
              </div>
            </div>

            <div className="flex-grow py-16">{children}</div>
            <div className="fixed bottom-0 left-0 right-0 ">
              <BottomBar />
            </div>
          </body>
        </WithRoom>
      </html>
    </ClerkProvider>
  );
}
