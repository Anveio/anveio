import * as React from "react";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { NavbarLink } from "./NavbarLink";

export function NavBar() {
  return (
    <div className="sm:px-2">
      <div className="border-b border-b-gray-500 dark:border-b-gray-400 max-w-6xl mx-auto py-0">
        <nav className="flex h-8 text-xs w-full shrink-0 items-center   dark:text-gray-400 transition-colors duration-500 backdrop-blur">
          <NavbarLink
            activeClassName="dark:text-white "
            className="mr-6 px-2 sm:px-0"
            href="/"
          >
            <span>Anveio</span>
          </NavbarLink>
          <nav className="flex w-full space-x-4 justify-center">
            <NavbarLink activeClassName="dark:text-white" href="/blog">
              Blog
            </NavbarLink>
            <NavbarLink activeClassName="dark:text-white" href="/apps">
              Apps
            </NavbarLink>
            <NavbarLink activeClassName="dark:text-white" href="/about">
              About
            </NavbarLink>
          </nav>
          <div className="ml-auto">
            <ThemeToggleButton />
          </div>
        </nav>
      </div>
    </div>
  );
}
