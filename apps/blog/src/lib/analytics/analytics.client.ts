"use client";

const KEY = "AnalyticsEventQueue";

import {
  AnalyticsEvent,
  AnalyticsEventWithClientRecordedTimestamp,
} from "@/lib/analytics/types";
import React from "react";
import useInterval from "react-use/lib/useInterval";

async function flushAnalyticsEventQueue() {
  const events = getAnalyticsEventQueue();
  if (events.length === 0) return;

  try {
    console.log("Doing analytics flush");
    await fetch("/api/record-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(events),
    });
    console.log("Done");
    localStorage.setItem(KEY, JSON.stringify([]));
  } catch (err) {
    // Swallow error for now
  }
}

const getAnalyticsEventQueue = () => {
  let maybeAnalyticsEventQueue =
    localStorage.getItem(KEY) &&
    JSON.parse(localStorage.getItem(KEY) as string);

  if (!maybeAnalyticsEventQueue) {
    localStorage.setItem(KEY, JSON.stringify([]));
    maybeAnalyticsEventQueue = [];
  }

  return maybeAnalyticsEventQueue as AnalyticsEventWithClientRecordedTimestamp[];
};

export const enqueueAnalyticsEvent = (event: AnalyticsEvent) => {
  const events = getAnalyticsEventQueue();

  const eventWithClientRecordedTimestamp: AnalyticsEventWithClientRecordedTimestamp =
    {
      ...event,
      clientRecordedAtUtcMillis: Date.now(),
    };

  events.push(eventWithClientRecordedTimestamp);

  localStorage.setItem(KEY, JSON.stringify(events));
};

export const RecordEventOnMount = (props: {
  event: AnalyticsEvent;
}): React.ReactNode => {
  React.useEffect(() => {
    enqueueAnalyticsEvent(props.event);
  }, [props.event]);

  return null;
};

export const CustomAnalytics = () => {
  useInterval(flushAnalyticsEventQueue, 3000);
  return null;
};
