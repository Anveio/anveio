import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { TopNavigationBarMenu } from "./client/Menu";
import { SearchField } from "./client/SearchField";
import { Session } from "next-auth";
import Link from "next/link";
import { Routes } from "@/lib/constants/routes";
import { WithSessionOnly } from "../WithSessionOnly";

interface Props {
  session: Session | null;
}

export function TopNavigationBar(props: Props) {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:w-full lg:px-8">
      <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <SearchField />
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <WithSessionOnly session={props.session}>
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </WithSessionOnly>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
            aria-hidden="true"
          />

          {/* Profile dropdown */}
          {!props.session ? (
            <div className="grid grid-cols-2 gap-3">
              <Link
                className="rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                href={Routes.LOGIN}
              >
                Log in
              </Link>
              <Link
                href={Routes.SIGNUP}
                className="rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <TopNavigationBarMenu session={props.session} />
          )}
        </div>
      </div>
    </div>
  );
}
