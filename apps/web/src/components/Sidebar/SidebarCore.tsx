import { TEAMS, TOP_LEVEL_NAVIGATION } from "@/lib/constants/routes";
import clsx from "clsx";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import CompanyLogoWhite from "../../../public/company-logo-white.svg";
import { WithSessionOnly } from "../WithSessionOnly";
import { AuthButtons } from "./SidebarButtons";
import { SidebarTeamLinks, SidebarTopLevelNavLinks } from "./SidebarNavLink";

interface Props {
  session: Session | null;
  className?: string;
  closeOnNavChange?: boolean;
}

export function SidebarCore(props: Props) {
  return (
    <div
      className={clsx(
        "fixed top-0 z-40 flex h-[100dvh] h-full w-[15rem] flex-col bg-gray-900",
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
              <SidebarTopLevelNavLinks />
            </li>
            <WithSessionOnly session={props.session}>
              <li>
                <div className="text-xs font-semibold leading-6 text-indigo-200">
                  Your teams
                </div>
                <SidebarTeamLinks teams={TEAMS} />
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
