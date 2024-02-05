"use client";

import { RecordEventOnMount } from "@/lib/analytics/analytics.client";
import { LiveBlogPostCard } from "@/components/custom/LiveBlogPostCard";
import { AnalyticsEvent } from "@/lib/analytics/types";
import { BLOG_POSTS } from "@/lib/blog/posts";
import dynamic from "next/dynamic";

const posts = Object.values(BLOG_POSTS);

const Scene = dynamic(() => import("@/components/3d/Scene"), { ssr: false });

const View = dynamic(
  () => import("@react-three/drei").then((mod) => mod.View),
  {
    ssr: false,
    loading: () => (
      <div className="dark:text-white flex h-96 w-full flex-col items-center justify-center">
        <svg
          style={{ width: 40, height: 40 }}
          className="animate-spin "
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    ),
  }
);

const HeroScene = dynamic(
  () => import("@/components/3d/Core/HeroScene").then((mod) => mod.HeroScene),
  {
    ssr: false,
  }
);

const postsToRender = posts
  .filter((post) => {
    if (process.env.NODE_ENV === "development") {
      return true;
    }

    return post.readyForProduction;
  })
  .sort((a, b) => Number(b.publishedAt) - Number(a.publishedAt))
  .map((post, index) => {
    return (
      <LiveBlogPostCard
        key={post.slug}
        content={post.content}
        title={post.title}
        id={post.slug}
        slug={post.slug}
        imageHref={post.imageHref}
        eventType="click:vercel_edge_analytics"
        priority={index === 0 ? true : undefined}
        publishedAt={post.publishedAt}
      />
    );
  });

export default function Home() {
  return (
    <>
      <main className="">
        <div className="h-96">
          {" "}
          <Scene>{/* @ts-expect-error */}</Scene>
          <View>
            <HeroScene />
          </View>
        </div>
        <section className="space-y-4">
          <h1 className="text-center dark:text-gray-400 text-gray-700">
            Featured Essay
          </h1>
          <div className="max-w-xl mx-auto sm:px-0 px-6 space-y-8">
            {postsToRender[0]}
          </div>
        </section>
      </main>
      <RecordEventOnMount event={analyticsEvent} />
    </>
  );
}

const analyticsEvent: AnalyticsEvent = {
  eventType: "view:home",
} as const;
