import { RecordEventOnMount } from "@/lib/analytics/analytics.client";
import { LiveBlogPostCard } from "@/components/custom/LiveBlogPostCard";
import { AnalyticsEvent } from "@/lib/analytics/types";
import { BLOG_POSTS } from "@/lib/blog/posts";

const posts = Object.values(BLOG_POSTS);

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
        <div className="h-44"></div>
        <div className="max-w-xl mx-auto sm:px-0 px-1 space-y-8">
          {postsToRender}
        </div>
      </main>
      <RecordEventOnMount event={analyticsEvent} />
    </>
  );
}

const analyticsEvent: AnalyticsEvent = {
  eventType: "view:home",
} as const;
