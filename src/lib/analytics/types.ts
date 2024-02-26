export type AnalyticsEvent = {
  eventType:
    | `view:home`
    | `view:blog:vercel_edge_analytics`
    | `view:blog:algorithmic-loot-generation-sucks`
    | `view:blog:the-genocide-isnt-complicated-actually`
    | `view:blog:how-to-have-good-sex-guide-for-straight-men`
    | `view:blog:language-models-can-use-existing-software`
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
