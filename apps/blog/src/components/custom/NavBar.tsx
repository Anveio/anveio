import Link from "next/link";
import * as React from "react";
import { Button } from "../ui/button";
import { ManageAccountMenu } from "../ManageAccountMenu";
import styles from "./NavBar.module.css";
import { cn } from "@/lib/utils";

export const NavBar = () => {
  let session = {
    userId: "s",
  };
  return (
    <nav className="sticky top-0 flex px-3 h-[62px] left-0 right-0 ">
      <div className={cn(styles.glass, "absolute")}>
        <div className="flex justify-between items-center">
          <Link
            className="flex items-center space-x-2 flex-shrink-0 relative"
            href="/"
          >
            <svg
              fill="currentColor"
              version="1.1"
              width={20}
              height={20}
              className="text-amber-500"
              viewBox="0 0 230 230"
              xmlSpace="preserve"
            >
              <g strokeWidth="0"></g>
              <g strokeLinecap="round" strokeLinejoin="round"></g>
              <g>
                <path d="M172.069,179.817l9.392-4.251l-17.772-39.262h9.194v5.154h11.453v-21.763h-11.453v5.154h-14.379l-15.296-33.79h6.653V63.27 h-3.827c2.132-4.47,3.328-9.467,3.328-14.74c0-16.995-12.406-31.14-28.636-33.875V0h-11.453v14.655 C93.044,17.39,80.638,31.535,80.638,48.53c0,5.273,1.196,10.271,3.328,14.74h-3.827v27.79h6.653l-15.296,33.79H57.117v-5.154H45.664 v21.763h11.453v-5.154h9.194l-17.772,39.262l9.392,4.252L38.026,223.79L51.743,230l19.903-43.974l4.321,1.956l23.394-51.678h9.912 v5.154h11.453v-5.154h9.912l23.393,51.678l4.321-1.956L178.257,230l13.717-6.21L172.069,179.817z M97.481,63.27 c-3.36-3.987-5.391-9.13-5.391-14.74c0-10.654,7.313-19.633,17.183-22.182V63.27H97.481z M120.727,124.85v-5.154h-11.453v5.154 h-4.727L115,101.758l10.454,23.092H120.727z M132.519,63.27h-11.792V26.348c9.87,2.549,17.183,11.528,17.183,22.182 C137.909,54.14,135.879,59.283,132.519,63.27z"></path>{" "}
              </g>
            </svg>

            <span className="text-white font-medium">Home</span>
          </Link>
          <div className="hidden xs:block flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 py-2 space-x-6 rounded-full bg-[#25272C] border border-[#FFFFFF]/[0.05] text-sm items-center justify-center px-6 font-medium overflow-hidden">
            <Link
              className="relative group bg-transparent hover:text-white/[0.64] transition duration-200"
              href="/pricing"
            >
              Blog
            </Link>
            <Link
              target="__blank"
              rel="noopener noreferrer"
              href="https://github.com/getcursor/cursor"
              className="relative group bg-transparent hover:text-white/[0.64] transition duration-200"
            >
              Projects
            </Link>
            <Link
              target="__blank"
              rel="noopener noreferrer"
              href="https://discord.com/invite/PJEgRywgRy"
              className="relative group bg-transparent hover:text-white/[0.64] transition duration-200"
            >
              About Me
            </Link>
          </div>
          <div className="hidden xs:block flex space-x-4 items-center">
            <Link
              href="/api/auth/login"
              className="text-sm font-medium text-[#FFFFFF]/[0.64]"
            >
              WIP
            </Link>
            <button className="group relative rounded-full p-px text-[0.8125rem] font-semibold leading-6 shadow-xl shadow-zinc-950 text-white">
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="relative rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 py-1 px-4 ring-1 ring-white/10 flex items-center space-x-2">
                <span>Download</span>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-toR from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
            </button>
          </div>
          <div className="xs:hidden block">
            {!session.userId ? (
              <div className="flex space-x-3">
                <Link href={"/sign-in"}>
                  <Button variant="outline">Sign In</Button>
                </Link>
              </div>
            ) : (
              <ManageAccountMenu userId={session.userId} />
            )}
          </div>
        </div>
      </div>
      <div className={cn(styles.glassEdge, "absolute l-0 r-0")}></div>
    </nav>
  );
};
