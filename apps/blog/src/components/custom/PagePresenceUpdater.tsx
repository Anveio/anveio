"use client";

import { useUpdateMyPresence } from "@/lib/liveblocks.client";
import * as React from "react";

interface Props {
  pageId: string;
}

export const PagePresenceUpdater = (props: Props) => {
  const { pageId: pageId } = props;
  const updateMyPresence = useUpdateMyPresence();

  React.useEffect(() => {
    if (!pageId) {
      updateMyPresence({
        currentlyViewedPage: {
          id: "home",
        },
      });
    }

    updateMyPresence({
      currentlyViewedPage: {
        id: pageId,
      },
    });
  }, [props.pageId]);

  return null;
};
