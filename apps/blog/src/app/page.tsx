"use client";

import { CollaborativeApp, WithRoom } from "./Room";
import { getSaying } from "@/lib/sayings";

import React, { useId } from "react";

export default function Home() {
  return (
    <main className="min-h-screen antialiased bg-background overflow-hidden relative">
      <div className="pt-28 md:pt-52 pb-10 md:pb-24 px-8 relative z-40">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="z-50 opacity-100">
            <div className="w-full flex justify-center">
              <div className="py-1 flex items-center space-x-2 border rounded-full border-[#8C8C8C]/[0.4] w-fit px-4 bg-gradient-to-b from-[#8C8C8C]/[0.4] to-[#8C8C8C]/[0.25] shadow-[0px_1px_4px_0px_rgba(255,255,255,.12)]) mb-8">
                <span className="text-neutral-200">{getSaying(0)}</span>
              </div>
            </div>
          </div>
          <h1 className="text-white text-center text-3xl md:text-6xl mb-4 font-bold">
            Shovon Hasan
          </h1>
          <div>
            <p className="text-center font-medium text-base md:text-lg text-[#FFFFFF]/[.48] mb-8"></p>
          </div>
        </div>
      </div>
      <WithRoom roomId="blog-home">
        <CollaborativeApp />
      </WithRoom>
    </main>
  );
}
