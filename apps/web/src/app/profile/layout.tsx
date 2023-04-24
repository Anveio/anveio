import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NEXT_AUTH_HANDLER_OPTIONS } from "@/lib/features/next-auth";
import { Routes } from "@/lib/constants/routes";
import Link from "next/link";
import { SettingsSecondaryNavigation } from "@/components/Settings/SettingsSecondaryNavigation";

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
        <SettingsSecondaryNavigation />
      </header>
      {children}
    </main>
  );
}
