"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { RoomProvider, useOthers, useStatus } from "@/lib/liveblocks.client";
import { ClientSideSuspense } from "@liveblocks/react";

import { LiveMap } from "@liveblocks/client";
interface RoomProps {
  roomId: string;
  currentPageId: string;
}

export const WithRoom = (props: React.PropsWithChildren<RoomProps>) => {
  return (
    <RoomProvider
      id={props.roomId}
      initialPresence={{
        cursor: null,
        currentlyViewedPage: {
          id: "home",
        },
      }}
      initialStorage={{ notes: new LiveMap() }}
    >
      {props.children}
    </RoomProvider>
  );
};
