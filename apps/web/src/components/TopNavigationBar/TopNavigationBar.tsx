import Image from "next/image";
import Link from "next/link";
import CompanyLogo from "../../../public/company-logo.svg";
import { TOP_LEVEL_NAVIGATION_TARGETS } from "./constants";
import MobileNavMenu from "./MobileNavMenu";

export function TopNavigationBar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Image src={CompanyLogo} alt="" />
          </Link>
        </div>
        <MobileNavMenu />
        <div className="hidden lg:flex lg:gap-x-12">
          {TOP_LEVEL_NAVIGATION_TARGETS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            href="/auth"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
