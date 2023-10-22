"use client";

import React from "react";

export const EventRecorder = (pageId: string) => {
  React.useEffect(() => {
    fetch(`/api/record-event`, {
      method: "post",
      body: JSON.stringify({ pageId }),
    });
  }, [pageId]);
};
