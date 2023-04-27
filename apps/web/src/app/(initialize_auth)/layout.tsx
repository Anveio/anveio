import {
  PrettyFloatingBlob,
  PrettyFloatingBlob2,
} from "@/components/PrettyFloatingBlob";
import { NEXT_AUTH_HANDLER_OPTIONS } from "@/lib/features/next-auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(NEXT_AUTH_HANDLER_OPTIONS);

  if (session) {
    return redirect("/");
  }

  return (
    <>
      <PrettyFloatingBlob />
      <PrettyFloatingBlob2 />
      <div className="flex flex-1 flex-col justify-center px-6 py-8 lg:px-8">
        {children}
      </div>
    </>
  );
}
