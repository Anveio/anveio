import { RecordEventOnMount } from "@/lib/analytics/analytics.client";
import { Codeblock } from "@/components/custom/Codeblock/Codeblock";
import { AnalyticsEvent } from "@/lib/analytics/types";
import { BLOG_POSTS } from "@/lib/blog/posts";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

export const metadata = {
  title:
    "Shovon Hasan - " +
    BLOG_POSTS[
      "vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router"
    ].title,
  description:
    "Step by step tutorial on how to implement production ready analytics for large scale applications for free using Vercel, Vercel's Edge Runtime, Planetscale, TypeScript, Next.js App Router, Drizzle ORM, React, and TypeScript",
};

const LiB = (props: React.ComponentProps<typeof Link>) => {
  return (
    <Link
      {...props}
      className={cn(props.className, "text-underline dark:text-blue-400")}
      target="_blank"
      rel="noreferrer"
    >
      {props.children}
    </Link>
  );
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
                  "vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router"
                ].publishedAt
              )}
            </p>
            <h1 className="text-center text-2xl font-semibold">
              {
                BLOG_POSTS[
                  "vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router"
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
                <LiB href="https://vercel.com/docs/analytics/limits-and-pricing">
                  free tier
                </LiB>{" "}
                gives you 2,500 events a nonth, and its most efficient tier
                costs $20 per 500k events before you they make you pick up the
                phone and call them for a better price. But you can set up an
                endpoint hosted on Vercel using the new{" "}
                <LiB href="https://nextjs.org/docs/pages/api-reference/edge">
                  Edge Runtime
                </LiB>{" "}
                to get{" "}
                <LiB href="https://vercel.com/docs/functions/edge-functions/usage-and-pricing">
                  half-a-million invocations per-month
                </LiB>{" "}
                for free and use that endpoint to write up to{" "}
                <LiB href="https://planetscale.com/pricing">
                  10 million analytics events per-month
                </LiB>{" "}
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
                The high-level components
              </h2>
              <ol className="list-decimal">
                <li className="list-item">A table for our analytics events</li>
                <li>
                  An edge function deployed on Vercel that collects the user's
                  IP and Geolocation data
                </li>
                <li>A lil' frontend app that pings this edge function</li>
              </ol>
              <p className="py-3">
                Each of these components can be deployed independently but the
                example code will use a single Next.js app using the new App
                Directory to manage the database, the API, and the frontend.
              </p>
              <p className="py-3">
                To get this production ready wee'll also need to rate limit
                events per user and per event type and batch events on the
                client so that we minimize the total number of edge function
                invocations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold pt-6 pb-4">
                Step 1: Install bun
              </h2>
              <p className="py-3">
                Vercel supports it now so may as well to speed up deployments
                and local development. You can use it alongside npm when Bun has
                some gap in feature parity.
              </p>
              <p>
                Follow the instructions at{" "}
                <LiB href="https://bun.sh/docs/installation">
                  https://bun.sh/docs/installation
                </LiB>{" "}
                so you can follow along with the rest of the tutorial. If you're
                rather not feel free to use npm in place of bun.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold pt-6 pb-4">
                Step 2: Create the Next.js app
              </h2>
              <p className="py-3">
                Run the below command from your command line to create a Next.js
                app using the App Router, Bun, and the{" "}
              </p>
              <div className="py-6">
                <Codeblock
                  language="shell"
                  filename="create-next-app.sh"
                  text={`bunx create-next-app@latest --ts --app --src-dir --use-bun`}
                />
              </div>
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
