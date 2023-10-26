import { RecordEventOnMount } from "@/components/custom/Analytics";
import { Codeblock } from "@/components/custom/Codeblock/Codeblock";
import { AnalyticsEvent } from "@/lib/analytics/types";
import { BLOG_POSTS } from "@/lib/blog/posts";
import Link from "next/link";
import * as React from "react";

const SchemasCodeSnippet = `export const events = mysqlTable("blog_events", {
  id: serial("id").primaryKey(),
  event_type: varchar("event_type", { length: 50 }).notNull(),
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
  created_at: timestamp("created_at").notNull().defaultNow(),
});`;

export default function VercelAnalyticsBlogPost() {
  return (
    <div className="py-3 sm:py-4 px-3 sm:px-3">
      <div className="max-w-4xl m-auto bg-zinc-950">
        <div className="py-4">
          <Link href="/">{"<-"} Home</Link>
        </div>
        <h1 className="text-center text-2xl">
          {
            BLOG_POSTS[
              "vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-directory"
            ].title
          }
        </h1>
        <div className="py-12">
          <p>Stuff placeholder</p>
          <Codeblock
            language="tsx"
            filename="schemas.ts"
            text={SchemasCodeSnippet}
          />
        </div>
      </div>
      <RecordEventOnMount event={analyticsEvent} />
    </div>
  );
}

const analyticsEvent: AnalyticsEvent = {
  eventType: "view:blog:vercel_edge_analytics",
} as const;
