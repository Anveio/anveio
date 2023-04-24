"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { Session } from "next-auth";
import { useMobileNavStore } from "@/lib/features/mobile-nav/state";

export function MobileNavMenuOpener() {
  const { open } = useMobileNavStore();
  return (
    <button
      type="button"
      onClick={open}
      className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
    >
      <span className="sr-only">Open sidebar</span>
      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
}
