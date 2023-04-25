"use client";

import { usePathname } from "next/navigation";

import { Routes } from "@/lib/constants/routes";
import { signOut } from "next-auth/react";

const secondaryNavigation = [
  { name: "Account", href: Routes.PROFILE, current: true },
  { name: "Settings", href: Routes.SETTINGS, current: false },
];

export function SettingsSecondaryNavigation() {
  const pathname = usePathname();

  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
          {pathname === Routes.SETTINGS ? "Settings" : "Account"}
        </h2>
      </div>
      <div className="mt-4 flex md:ml-4 md:mt-0">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
          onClick={() => {
            signOut();
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
