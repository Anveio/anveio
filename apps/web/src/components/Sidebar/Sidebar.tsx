import { Routes, TEAMS, TOP_LEVEL_NAVIGATION } from "@/lib/constants/routes";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import CompanyLogoWhite from "../../../public/company-logo-white.svg";
import { MobileSidebar } from "./MobileSidebar";
import { WithSessionOnly } from "../WithSessionOnly";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

export function Sidebar(props: Props) {
  return (
    <>
      <MobileSidebar />
      <div className="hidden lg:flex lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/">
              <Image className="h-8 w-auto" src={CompanyLogoWhite} alt="" />
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {TOP_LEVEL_NAVIGATION.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={clsx(
                          "text-gray-400 hover:bg-gray-800 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )}
                      >
                        <item.icon
                          className={clsx("h-6 w-6 shrink-0")}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <WithSessionOnly session={props.session}>
                <li>
                  <div className="text-xs font-semibold leading-6 text-indigo-200">
                    Your teams
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {TEAMS.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={clsx(
                            team.current
                              ? "bg-indigo-700 text-white"
                              : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                          )}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </WithSessionOnly>
              <li className="mt-auto">
                <Link
                  href={Routes.SETTINGS}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                >
                  <Cog6ToothIcon
                    className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                    aria-hidden="true"
                  />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
