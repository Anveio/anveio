import { Routes } from "@/lib/constants/routes";
import { NEXT_AUTH_HANDLER_OPTIONS } from "@/lib/features/next-auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProfileSettings() {
  return (
    <>
      <main className="px-10 py-10">
        <h1 className="text mt-6 text-4xl font-bold leading-9 tracking-tight text-white">
          Settings Coming Soon
        </h1>
      </main>
    </>
  );
}
