import "./globals.css"
import type { Metadata, Viewport } from "next"

import { ConvexClientProvider } from "@/components/convex-client-provider"

export const metadata: Metadata = {
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
    <html lang="en">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}
