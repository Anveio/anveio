import { Routes } from "@/lib/constants/routes";
import { NEXT_AUTH_HANDLER_OPTIONS } from "@/lib/features/next-auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProfileSettings() {
  const session = await getServerSession(NEXT_AUTH_HANDLER_OPTIONS);

  if (!session) {
    return redirect(Routes.LOGIN);
  }

  return (
    <>
      <main className="py-10">
        <h1 className="mt-6 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">
          Profile Settings Coming Soon
        </h1>
      </main>
    </>
  );
}
