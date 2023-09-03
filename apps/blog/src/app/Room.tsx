"use client";

import * as React from "react";
import { RoomProvider, useOthers, useStatus } from "@/lib/liveblocks.client";
import { ClientSideSuspense } from "@liveblocks/react";

interface RoomProps {
  roomId: string;
}

export const WithRoom = (props: React.PropsWithChildren<RoomProps>) => {
  return (
    <RoomProvider id={props.roomId} initialPresence={{}}>
      <div className="text-white fixed z-50 right-2 bottom-0">
        <div className="inline-flex items-center rounded-t-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-t border-x border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
          <div className="flex items-center justify-center justify-between min-w-[100px]">
            <LiveStatusIndicator />
            <div className="grid grid-cols-2 space-x-2 items-center translate-x-2">
              <svg
                viewBox="0 0 24 24"
                width={20}
                height={20}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2 12C2 13.6394 2.42496 14.1915 3.27489 15.2957C4.97196 17.5004 7.81811 20 12 20C16.1819 20 19.028 17.5004 20.7251 15.2957C21.575 14.1915 22 13.6394 22 12C22 10.3606 21.575 9.80853 20.7251 8.70433C19.028 6.49956 16.1819 4 12 4C7.81811 4 4.97196 6.49956 3.27489 8.70433C2.42496 9.80853 2 10.3606 2 12ZM12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25Z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
              <ClientSideSuspense fallback={<span>-</span>}>
                {() => props.children}
              </ClientSideSuspense>
            </div>
          </div>
        </div>
      </div>
    </RoomProvider>
  );
};

export const CollaborativeApp = () => {
  return <UserCount></UserCount>;
};

const LiveStatusIndicator = () => {
  const liveStatus = useStatus();
  console.log(
    "🚀 ~ file: Room.tsx:38 ~ LiveStatusIndicator ~ liveStatus:",
    liveStatus
  );

  let colorIndicator: string;

  switch (liveStatus) {
    case "disconnected":
    case "reconnecting":
      colorIndicator = "yellow";
    case "connected":
      colorIndicator = "red";
      break;
    case "connecting":
    case "initial":
    default:
      colorIndicator = "gray";
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width={10}
      height={10}
      fill={colorIndicator}
      color={colorIndicator}
      className={liveStatus === "connected" ? "animate-pulse" : ""}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <circle cx="12" cy="12" r="12" />
      </g>
    </svg>
  );
};

const UserCount = () => {
  const others = useOthers();
  const userCount = others.length;
  return <span>{userCount}</span>;
};
