import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NEXT_AUTH_HANDLER_OPTIONS } from "@/lib/features/next-auth";
import { Routes } from "@/lib/constants/routes";
import Link from "next/link";

const secondaryNavigation = [
  { name: "Account", href: Routes.PROFILE, current: true },
  { name: "Settings", href: Routes.SETTINGS, current: false },
];

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(NEXT_AUTH_HANDLER_OPTIONS);

  if (!session) {
    return redirect(Routes.LOGIN);
  }

  return (
    <main className="h-full bg-gray-800">
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
                  className={item.current ? "text-indigo-400" : ""}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {children}
    </main>
  );
}
