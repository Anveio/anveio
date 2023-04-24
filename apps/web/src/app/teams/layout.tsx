import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NEXT_AUTH_HANDLER_OPTIONS } from "@/lib/features/next-auth";
import { Routes } from "@/lib/constants/routes";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(NEXT_AUTH_HANDLER_OPTIONS);

  if (!session) {
    return redirect(Routes.LOGIN);
  }

  return <>{children}</>;
}
