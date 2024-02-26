import { NextRequest, userAgentFromString } from 'next/server';
import { geolocation, ipAddress } from '@vercel/edge';
import { db } from '@/lib/db';
import { events, sessions } from '@/lib/db/schema';
import { z } from 'zod';

import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

/**
 * Set up the expected request JSON schema
 */
const requestBodySchema = z.array(
  z.object({
    eventType: z.enum(
      [
        'view:home',
        'click:vercel_edge_analytics',
        'view:blog:vercel_edge_analytics',
        'view:blog:the-genocide-isnt-complicated-actually',
        'view:blog:algorithmic-loot-generation-sucks',
      ],
      {
        invalid_type_error: 'Invalid event type',
        required_error: 'Event type not provided',
      }
    ),
    clientRecordedAtUtcMillis: z.number(),
    metadata: z.record(z.any()).optional(),
  })
);

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(1, '5 s'),
});

export const POST = async (request: NextRequest) => {
  if (process.env.NODE_ENV === 'development') {
    /**
     * Don't bother recording events in development
     */
    return new Response(undefined, { status: 200 });
  }

  /**
   * Pull the user agent out from the request headers
   */
  const userAgent = request.headers.get('user-agent');

  /**
   * Parse the request JSON
   */
  const json = await request.json();

  const parseResult = requestBodySchema.safeParse(json);

  if (!parseResult.success) {
    /**
     * Return a 200 because the client doesn't necessarily need to know this failed
     * but make sure we log it for our own purposes.
     */
    console.error(`Failed to record event`, parseResult.error);
    return new Response(undefined, { status: 200 });
  }

  const ua = userAgentFromString(userAgent || undefined);
  const geo = geolocation(request);
  const ip = ipAddress(request);

  /**
   * We're making this a batch API so that callers can minimize the amount of
   * times they need to call this and we save ourselves some bandwidth.
   */
  const eventsUnderRateLimit = await Promise.all(
    parseResult.data.filter(async (event) => {
      const redisResponse = ratelimit.limit(`${ip}-${event.eventType}}`);

      /**
       * Ensure that emitting none of these events exceeds the rate limit
       */
      if (!(await redisResponse).success) {
        console.error(
          `Rate limit exceeded for ${ip} for event ${event.eventType}. Ignoring`
        );
        return true;
      } else {
        return false;
      }
    })
  );

  if (eventsUnderRateLimit.length === 0) {
    console.warn(`Rate limit exceeded for all events. Ignoring`);
    return new Response(undefined, { status: 200 });
  } else {
    console.log(`Logging ${eventsUnderRateLimit.length} events`);
  }

  const { get } = cookies();

  const sessionTokenCookie = get('sessionToken');

  const sessionToken = sessionTokenCookie?.value;

  await db.transaction(async (tx) => {
    const [sessionTokenId] = sessionToken
      ? await tx
          .select({ id: sessions.id })
          .from(sessions)
          .where(eq(sessions.sessionToken, sessionToken))
          .limit(1)
          .execute()
      : [null];

    for (const event of eventsUnderRateLimit) {
      /**
       * We can't do concurrent writes so do these writes serially.
       */
      await tx
        .insert(events)
        .values({
          event_type: event.eventType,
          ipAddress: ip,
          city: geo && geo.city ? decodeURIComponent(geo.city) : undefined,
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
          session_id: sessionTokenId?.id ?? null,
        })
        .execute();
    }
  });

  return new Response(undefined, { status: 200 });
};
