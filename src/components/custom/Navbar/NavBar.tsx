import * as React from "react";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { NavbarLink } from "./NavbarLink";

export function NavBar() {
  return (
    <div className="sm:px-2 fixed top-0 z-20 w-full backdrop-opacity-10 backdrop-blur">
      <div className="border-b border-b-gray-500 dark:border-b-gray-400 max-w-6xl mx-auto py-0">
        <nav className="flex items-center justify-between h-8 w-full text-xs dark:text-gray-400 transition-colors duration-500">
          <NavbarLink
            activeClassName="dark:text-white "
            className="font-semibold px-2 sm:px-0"
            href="/"
          >
            <span>Anveio</span>
          </NavbarLink>
          <nav className="flex-grow flex justify-center items-center space-x-4">
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
