import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Shovon Hasan",
  description:
    "Engineer at AWS EC2 sharing notes on systems, infrastructure, and making an impact.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>
            <a href="/">Shovon Hasan</a>
          </h1>
          <p>Engineer at AWS EC2, obsessed with reliable systems and their human impact.</p>
          <nav>
            <a href="/">Home</a>
            <a href="/#writing">Writing</a>
            <a href="/#about">About</a>
          </nav>
        </header>
        {children}
        <footer>
          © {new Date().getFullYear()} Shovon Hasan. Built with care in Seattle.
        </footer>
      </body>
    </html>
  )
}
