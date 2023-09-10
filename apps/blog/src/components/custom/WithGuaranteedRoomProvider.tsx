import { useRoom } from "@/lib/liveblocks.client";
import * as React from "react";

export const WithGuaranteedRoomProvider = (props: React.PropsWithChildren) => {
  try {
    const room = useRoom();

    if (room) {
      return <>{props.children}</>;
    } else {
      return null;
    }
  } catch (e) {
    console.log("DIDNT FIND ROOM");
    return null;
  }
};
