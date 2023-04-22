import {
  PrettyFloatingBlob,
  PrettyFloatingBlob2,
} from "@/components/PrettyFloatingBlob";
import { TopNavigationBar } from "@/components/TopNavigationBar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNavigationBar />
      <PrettyFloatingBlob />
      <PrettyFloatingBlob2 />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        {children}
      </div>
    </>
  );
}
