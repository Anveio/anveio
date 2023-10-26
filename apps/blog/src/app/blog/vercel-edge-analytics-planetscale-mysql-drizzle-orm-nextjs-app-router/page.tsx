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

/**
 * For external links that should open in a new tab and be underlined.
 * @returns
 */
const Blink = (props: React.ComponentProps<typeof Link>) => {
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
            <section className="py-3 space-y-4">
              <p>
                Vercel Analytics'{" "}
                <Blink href="https://vercel.com/docs/analytics/limits-and-pricing">
                  free tier
                </Blink>{" "}
                gives you 2,500 events a month, which is pretty stingy! Its most
                efficient tier costs $20 per 500k events before you they make
                you pick up the phone and call them for a better price. But you
                can set up an endpoint hosted on Vercel using the new{" "}
                <Blink href="https://nextjs.org/docs/pages/api-reference/edge">
                  Edge Runtime
                </Blink>{" "}
                to get{" "}
                <Blink href="https://vercel.com/docs/functions/edge-functions/usage-and-pricing">
                  half-a-million invocations per-month
                </Blink>{" "}
                for free and use that endpoint to write up to{" "}
                <Blink href="https://planetscale.com/pricing">
                  10 million analytics events per-month
                </Blink>{" "}
                for free using Planetscale.
              </p>

              <p>
                You can of course use any database you like but Planetscale is
                as cheap as it gets. We're also going to be using Drizzle ORM in
                this tutorial because it makes the code simpler, safer, compiles
                down to regular SQL so it mostly avoids the classic ORM slowness
                and if you want to bring your own database all you' have to do
                is <span className="italic">delete</span> a line of code.
              </p>
              <p>
                The geolocation data Vercel provides is impressively precise. I
                had to fake the geolocation data for this tutorial to avoid
                accidentally giving out the exact building I live in as it seems
                to, in some cases, be accurate to within 50 feet. Quite scary!
              </p>
              <p>
                If you're adding analytics this way to a project using this
                exact tech stack already I expect it'll take just a few minutes
                to get this set up. If you're starting a project fresh, this
                entire tutorial will likely take just 30 minutes.
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
                <Blink href="https://bun.sh/docs/installation">
                  https://bun.sh/docs/installation
                </Blink>{" "}
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
              <div className="space-y-3">
                <p>
                  Now let's install the dependencies we'll need for the first
                  iteration of our analytics.
                </p>
                <p>
                  @vercel/edge includes the utilities to pull the ip and
                  geolocation from requests.
                </p>
                <p>
                  drizzle-kit wil let us perform migrations and push migrations
                  to the connected database
                </p>
                <p>
                  drizzle-orm will allow us to write typesafe queries and take
                  some boilerpalte out of the picture. It compiles down to SQL
                  so there's no runtime cost to using it.
                </p>
                <p>
                  Zod will allow us to get some type safety on the server and
                  discard invalid requests.
                </p>
                <p>
                  @planetscale/database exports a function that allows drizzle
                  to create a connection to the Planetscale database, it's a set
                  and forget config thing.
                </p>
              </div>
              <div className="py-6">
                <Codeblock
                  language="shell"
                  filename="install-initial-dependencies.sh"
                  text={`bun i @vercel/edge drizzle-kit drizzle-orm zod @planetscale/database`}
                ></Codeblock>
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
