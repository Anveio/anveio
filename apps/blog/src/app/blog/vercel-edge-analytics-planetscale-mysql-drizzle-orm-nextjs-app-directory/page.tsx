import { RecordEventOnMount } from "@/lib/analytics/analytics.client";
import { Codeblock } from "@/components/custom/Codeblock/Codeblock";
import { AnalyticsEvent } from "@/lib/analytics/types";
import { BLOG_POSTS } from "@/lib/blog/posts";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export const metadata = {
  title:
    "Shovon Hasan - " +
    BLOG_POSTS[
      "vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-directory"
    ].title,
  description:
    "Step by step tutorial on how to implement production ready analytics for large scale applications for free using Vercel, Vercel's Edge Runtime, Planetscale, TypeScript, Next.js App Directory, Drizzle ORM, React, and TypeScript",
};

export default function VercelAnalyticsBlogPost() {
  return (
    <div className="py-3 sm:py-4 px-3 sm:px-3">
      <div className="max-w-4xl m-auto bg-zinc-950">
        <div className="py-4">
          <Link href="/">{"<-"} Home</Link>
        </div>
        <article>
          <div className="space-y-3 pb-6">
            <p className="italic text-center">
              Published{" "}
              {formatDateWithSuffix(
                BLOG_POSTS[
                  "vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-directory"
                ].publishedAt
              )}
            </p>
            <h1 className="text-center text-2xl font-semibold">
              {
                BLOG_POSTS[
                  "vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-directory"
                ].title
              }
            </h1>
            <Image
              alt="Planetscale UI showing some analytics events"
              src={"/blog-assets/vercel-edge-analytics/table.webp"}
              width={1152}
              height={648}
            />
            <p className="italic text-center">
              A glimpse of the analytics table we'll be building
            </p>
          </div>

          <div className="py-12">
            <div></div>
            <section className="py-3">
              <p>
                As of 2023, Vercel Analytics'{" "}
                <Link
                  href="https://vercel.com/docs/analytics/limits-and-pricing"
                  className="text-underline dark:text-blue-400"
                >
                  free tier
                </Link>{" "}
                gives you 2,500 events a nonth, and its most efficient tier
                costs $20 per 500k events before you they make you pick up the
                phone and call them for a better price. But you can set up an
                endpoint hosted on Vercel using the new{" "}
                <Link
                  href="https://nextjs.org/docs/pages/api-reference/edge"
                  className="text-underline dark:text-blue-400"
                >
                  Edge Runtime
                </Link>{" "}
                to get{" "}
                <Link
                  href="https://vercel.com/docs/functions/edge-functions/usage-and-pricing"
                  className="text-underline dark:text-blue-400"
                >
                  half-a-million invocations per-month
                </Link>{" "}
                for free and use that endpoint to write up to{" "}
                <Link
                  href="https://planetscale.com/pricing"
                  className="text-underline dark:text-blue-400"
                >
                  10 million analytics events per-month
                </Link>{" "}
                for free using Planetscale.
              </p>

              <p className="py-4">
                You can of course use any database you like but Planetscale is
                as cheap as it gets. We're also going to be using Drizzle ORM in
                this tutorial because it's fantastic. It makes the code simpler
                and if you want to bring your own database all you' have to do
                is <span className="italic">delete</span> a line of code. That's
                it.
              </p>
              <p>
                From the data I've collected so far it turns out the geolocation
                data Vercel let's you collect is quite impressively precise. I
                had to modify the example data for this tutorial to fake
                latitude and longitudes to avoid accidentally giving out the
                exact building I live in since it's accurate to within 50 feet.
                Quite scary!
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold pt-6 pb-4">
                The high-level approach
              </h2>
              <ol className="list-decimal">
                <li className="list-item">
                  Create a table for our analytics events
                </li>
                <li>
                  Deploy an edge function on Vercel that collects the user's IP
                  and Geolocation data
                </li>
                <li>
                  Create a lil' frontend app that pings this edge function
                </li>
              </ol>

              <p>
                We'll also need to rate limit events per user and per event type
                and batch events on the client so that we minimize the total
                number of edge functio invocations.
              </p>
            </section>
            <Codeblock
              language="tsx"
              filename="src/lib/db/schemas.ts"
              text={SchemasCodeSnippet}
            />
          </div>
        </article>
      </div>
      <RecordEventOnMount event={analyticsEvent} />
    </div>
  );
}

const analyticsEvent: AnalyticsEvent = {
  eventType: "view:blog:vercel_edge_analytics",
} as const;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long", // Date as "October 25, 2023"
});

const formatDateWithSuffix = (date: Date) => {
  return dateFormatter.format(date);
};

const SchemasCodeSnippet = `
export const events = mysqlTable("blog_events", {
  /**
   * autoincrement() is a helper function that adds the \`AUTO_INCREMENT\` keyword
   */
  id: serial("id").primaryKey().autoincrement(),
  event_type: varchar("event_type", { length: 50 }).notNull(),
  /**
   * Start of properties provided by Vercel's Edge Runtime on the request object
   */
  ipAddress: varchar("ip_address", { length: 39 }),
  city: varchar("city", { length: 30 }),
  country: varchar("country", { length: 30 }),
  flagEmoji: varchar("flag", { length: 4 }),
  region: varchar("region", { length: 30 }),
  countryRegion: varchar("country_region", { length: 30 }),
  latitude: varchar("latitude", { length: 30 }),
  longitude: varchar("longitude", { length: 30 }),
  browser_name: varchar("browser_name", { length: 50 }),
  browser_version: varchar("browser_version", { length: 30 }),
  rendering_engine_name: varchar("rendering_engine_name", { length: 30 }),
  device_type: varchar("device_type", { length: 15 }),
  device_vendor: varchar("device_vendor", { length: 50 }),
  device_model: varchar("device_model", { length: 50 }),
  /**
   * End of the properties provided by Vercel's Edge Runtime
   */
  /**
   * There could be weeks between the event happening and it hitting our analytics
   * endpoint and subsequently being written into our database, so the auto-generated
   * created_at timestamp is not sufficient for our needs. We need the client to tell
   * us when the event happened.
   */
  client_recorded_at: timestamp("client_recorded_at").notNull(),
  metadata: json("metadata"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
`;
