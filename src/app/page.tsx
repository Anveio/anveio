import { RecordEventOnMount } from "@/lib/analytics/analytics.client";
import { LiveBlogPostCard } from "@/components/custom/LiveBlogPostCard";
import { AnalyticsEvent } from "@/lib/analytics/types";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { FeaturedBlogPost } from "@/components/custom/Home";

export default function Home() {
  const featuredPost = BLOG_POSTS["language-models-can-use-existing-software"];

  return (
    <>
      <main className="">
        <div className="max-w-4xl mx-auto sm:px-0 px-1">
          <FeaturedBlogPost
            title={featuredPost.title}
            description={featuredPost.content}
            imageHref={featuredPost.imageHref}
            slug={featuredPost.slug}
          ></FeaturedBlogPost>
        </div>
      </main>
      <RecordEventOnMount event={analyticsEvent} />
    </>
  );
}

const analyticsEvent: AnalyticsEvent = {
  eventType: "view:home",
} as const;
