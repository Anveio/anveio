import { SettingsSecondaryNavigation } from "@/components/Settings/SettingsSecondaryNavigation";
import { Routes } from "@/lib/constants/routes";
import { NEXT_AUTH_HANDLER_OPTIONS } from "@/lib/features/next-auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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
      <header className="border-b border-white/5 px-6 py-3">
        <SettingsSecondaryNavigation />
      </header>
      {children}
    </main>
  );
}
