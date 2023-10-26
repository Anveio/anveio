import { NextRequest, userAgentFromString } from "next/server";
import { geolocation, ipAddress } from "@vercel/edge";
import { db } from "@/lib/db/db";
import { events } from "@/lib/db/schema";
import { z } from "zod";

import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

export const runtime = "edge";

const requestBodySchema = z.array(
  z.object({
    eventType: z.enum(
      [
        "view:home",
        "view:blog:vercel_edge_analytics",
        "click:vercel_edge_analytics",
      ],
      {
        invalid_type_error: "Invalid event type",
        required_error: "Event type not provided",
      }
    ),
    clientRecordedAtUtcMillis: z.number(),
    metadata: z.record(z.any()).optional(),
  })
);

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(1, "5 s"),
});

export const POST = async (request: NextRequest) => {
  const userAgent = request.headers.get("user-agent");

  const json = await request.json();

  const parseResult = requestBodySchema.safeParse(json);

  if (!parseResult.success) {
    console.error(`Failed to record event`, parseResult.error);
    return new Response(undefined, { status: 200 });
  }

  const ua = userAgentFromString(userAgent || undefined);
  const geo = geolocation(request);
  const ip = ipAddress(request) ?? "127.0.0.1";

  const filteredEvents = await Promise.all(
    parseResult.data.filter(async (event) => {
      const redisResponse = ratelimit.limit(`${ip}-${event.eventType}}`);

      if (!(await redisResponse).success) {
        console.error(
          `Rate limit exceeded for ${ipAddress} for eventL ${event.eventType}. Ignoring`
        );
        return true;
      } else {
        return false;
      }
    })
  );

  if (filteredEvents.length === 0) {
    console.error(`Rate limit exceeded for all events. Ignoring`);
    return new Response(undefined, { status: 200 });
  }

  db.transaction(async (db) => {
    const transactions = filteredEvents.map(async (event) => {
      return db
        .insert(events)
        .values({
          event_type: event.eventType,
          ipAddress: ip,
          city: geo?.city,
          country: geo?.country,
          latitude: geo?.latitude,
          longitude: geo?.longitude,
          region: geo?.region,
          countryRegion: geo?.countryRegion,
          flagEmoji: geo?.flag,
          browser_version: ua.browser.version,
          browser_name: ua.browser.name,
          rendering_engine_name: ua.engine.name,
          device_type: ua.device.type,
          device_vendor: ua.device.vendor,
          device_model: ua.device.model,
          metadata: event.metadata,
          client_recorded_at: new Date(event.clientRecordedAtUtcMillis),
        })
        .execute();
    });

    return Promise.all(transactions);
  });

  return new Response(undefined, { status: 200 });
};
