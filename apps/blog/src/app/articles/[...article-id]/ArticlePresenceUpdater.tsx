"use client";

import { useUpdateMyPresence } from "@/lib/liveblocks.client";
import * as React from "react";

interface Props {
  articleId: string;
}

export const ArticlePresenceUpdater = (props: Props) => {
  const { articleId } = props;
  const updateMyPresence = useUpdateMyPresence();

  React.useEffect(() => {
    if (!articleId) {
      return;
    }

    updateMyPresence({
      currentlyViewedPage: {
        id: articleId,
      },
    });
  }, [props.articleId]);

  return null;
};
