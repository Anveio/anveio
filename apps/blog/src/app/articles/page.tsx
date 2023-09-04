import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";

export default function ArticlesPage() {
  return (
    <main className="min-h-screen antialiased bg-background overflow-hidden relative">
      <div className="pt-12 md:pt-52 pb-10 md:pb-24 px-8 relative z-40">
        <h1 className="text-white text-center text-3xl md:text-6xl mb-4 font-bold">
          Work in progress - come back soon
        </h1>
        <div className="flex items-center justify-center">
          <Link href="/">
            <Button size={"lg"} variant={"outline"}>
              Go back
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
