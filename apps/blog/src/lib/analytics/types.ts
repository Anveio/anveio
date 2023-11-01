export type AnalyticsEvent = {
  eventType:
    | `view:home`
    | `view:blog:vercel_edge_analytics`
    | `view:blog:algorithmic-loot-generation-sucks`
    | `view:blog:the-genocide-isnt-complicated-actually`
    | `click:vercel_edge_analytics`;
  metadata?: Partial<EventMeta>;
};

export type AnalyticsEventWithClientRecordedTimestamp = AnalyticsEvent & {
  clientRecordedAtUtcMillis: number;
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
