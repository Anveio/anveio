import "./globals.css"
import type { Metadata, Viewport } from "next"

import { ConvexClientProvider } from "@/components/convex-client-provider"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://shovonhasan.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Shovon Hasan",
  description:
    "Engineer at AWS EC2 sharing notes on systems, infrastructure, and making an impact.",
  other: {
    "color-scheme": "light dark",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className="[color-scheme:light_dark] [font-synthesis:none] [text-rendering:optimizeLegibility]"
    >
      <body className="m-0 flex min-h-screen justify-center bg-slate-50 text-slate-900 [font-feature-settings:'kern','liga'] leading-[1.6] dark:bg-slate-950 dark:text-slate-200">
        <div className="flex min-h-screen w-full max-w-[72ch] flex-col px-[clamp(1.75rem,5vw,3.5rem)] py-0">
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </div>
      </body>
    </html>
  )
}
