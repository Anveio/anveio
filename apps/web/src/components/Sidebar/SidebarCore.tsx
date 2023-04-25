import { TEAMS, TOP_LEVEL_NAVIGATION } from "@/lib/constants/routes";
import clsx from "clsx";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import CompanyLogoWhite from "../../../public/company-logo-white.svg";
import { WithSessionOnly } from "../WithSessionOnly";
import { AuthButtons } from "./SidebarButtons";

interface Props {
  session: Session | null;
  className?: string;
}

export function SidebarCore(props: Props) {
  return (
    <div
      className={clsx(
        "fixed top-0 z-40 flex h-full h-screen w-[15rem] flex-col bg-gray-900",
        props.className
      )}
    >
      <div className="flex grow flex-col gap-y-5 overflow-y-auto  px-6 pb-4 ring-1 ring-white/10">
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
                        "group flex gap-x-3 rounded-md p-2 text-lg font-semibold leading-6 lg:text-sm"
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
                      <Link
                        href={team.href}
                        className={clsx(
                          team.current
                            ? "bg-indigo-700 text-white"
                            : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-lg font-semibold leading-6 lg:text-sm"
                        )}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                          {team.initial}
                        </span>
                        <span className="truncate">{team.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </WithSessionOnly>
          </ul>
        </nav>
      </div>

      <div className="mt-auto grid gap-3 bg-inherit">
        <AuthButtons session={props.session} />
      </div>
    </div>
  );
}
