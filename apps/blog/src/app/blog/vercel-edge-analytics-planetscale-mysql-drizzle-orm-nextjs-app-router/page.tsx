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
        <article className="">
          <div className="space-y-3">
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

          <div className="py-12 space-y-8">
            <section className="space-y-6">
              <p>
                Vercel Analytics'{" "}
                <Blink href="https://vercel.com/docs/analytics/limits-and-pricing">
                  free tier
                </Blink>{" "}
                gives you 2,500 events a month, which isn't a lot. Its most
                efficient tier costs $20 per 500k events before you have to pick
                the phone and call for a better price. But you can set up an
                endpoint hosted on Vercel using the new{" "}
                <Blink href="https://nextjs.org/docs/pages/api-reference/edge">
                  Edge Runtime
                </Blink>{" "}
                to get{" "}
                <Blink href="https://vercel.com/docs/functions/edge-functions/usage-and-pricing">
                  half-a-million invocations per-month
                </Blink>{" "}
                for free and use that endpoint to write up to{" "}
                <Blink href="https://planetscale.com/pricing">
                  10 million free analytics events per-month
                </Blink>{" "}
                using Planetscale (I'm not affiliated in any way). The next 40
                million events will cost you $29.
              </p>

              <p>
                You can of course use any database you like but Planetscale is
                the cheapest managed solution. We're also going to be using
                Drizzle ORM in this tutorial because it makes the code simpler,
                safer, compiles down to regular SQL and if you want to bring
                your own database all you' have to do is{" "}
                <span className="italic">delete</span> a line of code. We'll
                also be using Vercel KV to do rate limiting.
              </p>
              <p>
                The geolocation data Vercel provides is impressively precise,
                accurate to within 50 feet in some cases. I had to fake the
                geolocation data for this tutorial to avoid giving out the exact
                building I live in. Quite scary!
              </p>
              <p>
                If you're adding analytics to a project using this exact tech
                stack already I expect it'll take just a few minutes to get this
                set up. If you're starting a project fresh, this entire tutorial
                will likely take just 30 minutes.
              </p>
            </section>
            <section className="space-y-6">
              <h2 className="text-xl font-bold">The high-level components</h2>
              <ol className="list-decimal">
                <li className="list-item">A table for our analytics events</li>
                <li>
                  An edge function deployed on Vercel that collects the user's
                  IP and Geolocation data and writes the data to the table
                </li>
                <li>
                  A lil' frontend app that pings this edge function from the
                  user's browser.
                </li>
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

            <section className="space-y-6">
              <h2 className="text-xl font-bold">1. Install bun</h2>
              <p>
                If you'd rather use npm or yarn you can skip this. Vercel
                supports Bun now so may as well to speed up deployments and
                local development. You can use it alongside npm when Bun has
                some gap in feature parity.
              </p>
              <p>
                Follow the instructions at{" "}
                <Blink href="https://bun.sh/docs/installation">
                  https://bun.sh/docs/installation
                </Blink>{" "}
                to install it.
              </p>
              <p>
                It also helps to have the Vercel CLI to manage environment
                variables automatically, and you can install it with
              </p>
              <Codeblock
                language="shell"
                filename="install-vercel-cli.sh"
                text={"bun install --global vercel"}
              />
              <p>
                But you can choose to copy paste environment variables manually
                if you prefer.
              </p>
            </section>
            <section className="space-y-6">
              <h2 className="text-xl font-bold">2. Create the Next.js app</h2>
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
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">3. Set up the DB</h2>
              <p>
                Ok this section is a lot of boring hooking stuff up and copying
                around credentials but the good thing is you only have to do it
                once. Managing environment variables is the most tedious part of
                programming.
              </p>
              <p>
                To get started create an account on{" "}
                <Blink href="https://auth.planetscale.com/sign-in">
                  Planetscale
                </Blink>{" "}
                and create a table with a branch name of "dev". We'll connect to
                the dev branch for local development and the main branch for
                production.
              </p>
              <div className="flex justify-center">
                <Image
                  src="/blog-assets/vercel-edge-analytics/planetscale-dev-branch.webp"
                  alt="Planetscale UI: Branch name = dev, base branch = main, region = us-east-2 (Ohio)"
                  width={400}
                  height={400}
                />
              </div>
              <p>
                Then, from the overview tab, click connect on the top right and
                then "new password" on the top right of the modal that pops up.
                This will give you a connection string that includes the
                username, password, branch, and URL of the database. It's the
                only credential we need to connect to the DB from our app. Do
                this once for the "main" branch and once for the "dev" branch
                and make sure to copy the DATABASE_URL string for both as you
                won't be able to see it after creation. Next step is to copy
                these into Vercel
              </p>
              <div className="flex justify-center">
                <Image
                  src="/blog-assets/vercel-edge-analytics/planetscale-password.webp"
                  alt="Planetscale UI: Connect button"
                  width={800}
                  height={800}
                />
              </div>
              <p>
                (Skipping past setting up a project in Vercel, using git, and
                pushing to Github...) Navigate to the Environment Variables
                section in your project's settings, Uncheck "Preview" and
                "Development" and paste in the `DATABASE_URL="..."`environment
                variable using the credentials for the "main" branch of your
                Planetscale Database into the text fields and hit save. Do the
                same for the "dev" branch but uncheck "Production" and "Preview"
                before hitting save.
              </p>
              <p>
                Now from a terminal somewhere in your project run the following
                commands to pull in the development environment variables into
                your local filesystem.
              </p>
              <Codeblock
                language="shell"
                filename="link-vercel-and-pull.sh"
                text={`vercel link\nvercel env pull`}
              />
              <p>
                Next, we'll start writing some code. First make files we'll put
                our core DB code in.
              </p>
              <Codeblock
                language="shell"
                filename="create-db-folder.sh"
                text={CreateDbFolderSnippet}
              />
              <p>
                In src/lib/db/db.ts we'll put the core code to initialize our DB
                and export the db connection to the rest of the codebase.
              </p>
              <Codeblock
                language="tsx"
                filename="src/lib/db/db.ts"
                text={ConnectDbSnippet}
              />
              <p>
                In the above codeblock we make sure we have DATABASE_URL set,
                and ensure it throws at build time if it's not. We also set up
                logging while in development mode but you can disable that
                entirely or even enable it in production. We export default a
                config that's read by Drizzle Kit so that it knows where to find
                our schemas to generate migrations and push DB changes.
              </p>
              <p>Next, let's set up the schema for our analytics table:</p>
              <Codeblock
                language="tsx"
                filename="src/lib/db/schemas.ts"
                text={SchemasCodeSnippet}
              />
              <p>
                To be honest, I haven't found "flagEmoji" to be a particularly
                useful column as it seems redundant with the country column, but
                I include it for exhaustiveness. Feel free to remove it for your
                project.
              </p>
              <p>
                The API for our analytics event is that events have an
                "event_type" and "metadata". We can enforce the presence or lack
                of metadata for some events as the API layer and get some
                type-safety at build time with TypeScript.
              </p>
              <p>
                Feel free to play around with the character lengths of these
                columns. I'm using 50 for the event_type column as I plan to
                stuff as much information into a structured event_type string as
                possible, but if you prefer a different approach you can get
                away with a smaller character allocation.
              </p>
            </section>
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

const CreateDbFolderSnippet = `mkdir -p src/lib/db
touch src/lib/db/db.ts src/lib/db/schema.ts
`;

const ConnectDbSnippet = `import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Config } from "drizzle-kit";

import { z } from "zod";

export const DATABASE_URL = z
  .string({
    required_error: "DATABASE_URL missing",
  })
  .parse(process.env.DATABASE_URL);

const connection = connect({
  url: DATABASE_URL,
});

export const db = drizzle(
  connection,
  process.env.NODE_ENV === "development"
    ? {
        logger: {
          logQuery: console.log,
        },
      }
    : undefined
);

export default {
  schema: "./src/lib/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString: DATABASE_URL,
  },
  out: "./src/lib/db/__generated__/migrations",
} satisfies Config;
`;

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
