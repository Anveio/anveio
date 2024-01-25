"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { HomeIcon } from "lucide-react";

export function NavBar() {
  return (
    <nav className="flex h-10 w-full shrink-0 items-center px-4 md:px-6 max-w-4xl mx-auto bg-slate-100 dark:bg-slate-950 dark:text-white transition-colors duration-500 backdrop-blur">
      <Link className="mr-6" href="#">
        <HomeIcon className="h-6 w-6" />
        <span className="sr-only">Home</span>
      </Link>
      <nav className="flex w-full justify-center">
        <Link className="mx-2 md:mx-4 lg:mx-6" href="/">
          Blog
        </Link>
        <Link className="mx-2 md:mx-4 lg:mx-6" href="/apps">
          Apps
        </Link>
        <Link className="mx-2 md:mx-4 lg:mx-6" href="/about">
          About
        </Link>
      </nav>
      <div className="ml-auto">
        <ThemeToggleButton />
      </div>
    </nav>
  );
}
