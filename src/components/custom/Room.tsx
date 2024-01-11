"use client";

import { RoomProvider } from "@/lib/liveblocks.client";
import * as React from "react";

import { AVATAR_POINTER } from "@/lib/constants/avatars";
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
        avatar: AVATAR_POINTER,
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
