import { BottomBar } from "@/components/custom/BottomBar";
import { CursorCanvas } from "@/components/custom/Cursors";
import { NavBar } from "@/components/custom/NavBar";
import { WithRoom } from "@/components/custom/Room";
import "@/lib/toasts/toast-styles.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import * as React from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CustomAnalytics } from "@/components/custom/Analytics";

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
    <html lang="en" className="dark">
      <body className={cn(inter.className, theme?.value, "dark:text-slate-50")}>
        <div>{children}</div>
        <Toaster />
        <Analytics />
        <CustomAnalytics />
      </body>
    </html>
  );
}
