export type AnalyticsEvent = {
  eventType:
    | `view:home`
    | `view:blog:vercel_edge_analytics`
    | `click:vercel_edge_analytics`;
  metadata?: Partial<EventMeta>;
};

type SerializableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | SerializableValue[]
  | { [key: string]: SerializableValue };

type EventMeta = { [key: string | number]: SerializableValue };
