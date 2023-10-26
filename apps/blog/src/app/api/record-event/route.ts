import { NextRequest, userAgentFromString } from "next/server";
import { geolocation, ipAddress } from "@vercel/edge";
import { db } from "@/lib/db/db";
import { events } from "@/lib/db/schema";
import { z } from "zod";

import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

export const runtime = "edge";

const requestBodySchema = z.object({
  event_type: z.string(),
});

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

  const { event_type } = parseResult.data;

  const ua = userAgentFromString(userAgent || undefined);
  const geo = geolocation(request);
  const ip = ipAddress(request) ?? "127.0.0.1";

  const { success } = await ratelimit.limit(`${ip}-${event_type}}`);

  if (!success) {
    console.error(
      `Rate limit exceeded for ${ipAddress} on page ${event_type}. Ignoring`
    );
    return new Response(undefined, { status: 200 });
  }

  await db
    .insert(events)
    .values({
      event_type: event_type,
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
    })
    .execute();

  return new Response(undefined, { status: 200 });
};
