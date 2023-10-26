"use client";

import React from "react";

export const EventRecorderOnPropsChange = (props: { event_type: string }) => {
  React.useEffect(() => {
    fetch(`/api/record-event`, {
      method: "post",
      body: JSON.stringify({ event_type: props.event_type }),
    });
  }, [props.event_type]);

  return null;
};
