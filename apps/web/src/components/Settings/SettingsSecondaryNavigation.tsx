"use client";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Routes } from "@/lib/constants/routes";
import Link from "next/link";
import { useRouter } from "next/router";

const secondaryNavigation = [
  { name: "Account", href: Routes.PROFILE, current: true },
  { name: "Settings", href: Routes.SETTINGS, current: false },
];

export function SettingsSecondaryNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useRouter();

  return (
    <header className="border-b border-white/5">
      {/* Secondary navigation */}
      <nav className="flex overflow-x-auto py-4">
        <ul
          role="list"
          className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
        >
          {secondaryNavigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={
                  location.pathname.startsWith(item.href)
                    ? "text-indigo-400"
                    : ""
                }
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
