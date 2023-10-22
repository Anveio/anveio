"use client";

import React from "react";

export const EventRecorder = (props: { pageId: string }) => {
  React.useEffect(() => {
    fetch(`/api/record-event`, {
      method: "post",
      body: JSON.stringify({ pageId: props.pageId }),
    });
  }, [props.pageId]);

  return null;
};
