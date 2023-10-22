import { NextRequest, userAgentFromString } from "next/server";
import { geolocation, ipAddress } from "@vercel/edge";
import { db } from "@/lib/db/db";
import { events } from "@/lib/db/schema";
import { z } from "zod";

const requestBodySchema = z.object({
  pageId: z.string(),
});

export const POST = async (request: NextRequest) => {
  const userAgent = request.headers.get("user-agent");

  const json = await request.json();

  const parseResult = requestBodySchema.safeParse(json);

  if (!parseResult.success) {
    console.error(`Failed to record event`, parseResult.error);
    return Response.json(parseResult.error, { status: 200 });
  }

  const { pageId } = parseResult.data;

  const ua = userAgentFromString(userAgent || undefined);
  const geo = geolocation(request);
  const ip = ipAddress(request);

  await db
    .insert(events)
    .values({
      pageId: pageId,
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
