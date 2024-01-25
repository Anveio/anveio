import * as React from "react";
import Link from "next/link";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { HomeIcon } from "lucide-react";

export function NavBar() {
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 max-w-4xl mx-auto">
      <Link className="mr-6" href="#">
        <HomeIcon className="h-6 w-6" />
        <span className="sr-only">Home</span>
      </Link>
      <nav className="flex w-full justify-center">
        <Link className="mx-2 md:mx-4 lg:mx-6" href="#">
          Blog
        </Link>
        <Link className="mx-2 md:mx-4 lg:mx-6" href="#">
          Apps
        </Link>
        <Link className="mx-2 md:mx-4 lg:mx-6" href="#">
          About
        </Link>
      </nav>
      <div className="ml-auto">
        <ThemeToggleButton />
      </div>
    </header>
  );
}

function MoonIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}
