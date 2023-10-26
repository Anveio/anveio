"use client";

const KEY = "AnalyticsEventQueue";

import { AnalyticsEvent } from "@/lib/analytics/types";
import React from "react";
import useInterval from "react-use/lib/useInterval";

async function flushAnalyticsEventQueue() {
  const events = getAnalyticsEventQueue();
  if (events.length === 0) return;

  console.log(`FLUSHING EVENTS`, events);

  try {
    await fetch("/api/record-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(events),
    });
    sessionStorage.setItem(KEY, JSON.stringify([]));
  } catch (err) {
    // Swallow error for now
  }
}

const getAnalyticsEventQueue = () => {
  let maybeAnalyticsEventQueue =
    sessionStorage.getItem(KEY) &&
    JSON.parse(sessionStorage.getItem(KEY) as string);

  if (!maybeAnalyticsEventQueue) {
    sessionStorage.setItem(KEY, JSON.stringify([]));
    maybeAnalyticsEventQueue = [];
  }

  return maybeAnalyticsEventQueue as AnalyticsEvent[];
};

export const CustomAnalytics = () => {
  useInterval(flushAnalyticsEventQueue, 3000);
  return <></>;
};

export const enqueueAnalyticsEvent = (event: AnalyticsEvent) => {
  const events = getAnalyticsEventQueue();

  events.push(event);

  sessionStorage.setItem(KEY, JSON.stringify(events));
};

export const RecordEventOnMount = (props: { event: AnalyticsEvent }) => {
  React.useEffect(() => {
    enqueueAnalyticsEvent(props.event);
  }, []);

  return <></>;
};
