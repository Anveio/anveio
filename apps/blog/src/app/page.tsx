import { RecordEventOnMount } from "@/lib/analytics/analytics.client";
import { LiveBlogPostCard } from "@/components/custom/LiveBlogPostCard";
import { AnalyticsEvent } from "@/lib/analytics/types";
import { BLOG_POSTS } from "@/lib/blog/posts";

export default function Home() {
  return (
    <>
      <main className="bg-background">
        <div className="lg:pt-36 mx-auto lg:pb-36 py-8 px-2 md:py-4 lg:px-8 max-w-6xl">
          <div className="mx-auto flex flex-col items-center">
            <h1 className="text-white text-center text-4xl md:text-6xl mb-4 font-bold hero-fade-up-enter-active delay-75">
              The Internet should{" "}
              <span className="inline leading-[0] bg-gradient-to-br bg-clip-text text-transparent from-[#FFFF92] to-[#EE8912]">
                feel alive.
              </span>
            </h1>
            <div>
              <p className="text-center font-medium text-base md:text-lg text-[#FFFFFF]/[.48] mb-8"></p>
            </div>
          </div>
          <section className="mx-auto mt-10 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none ">
            <div className="grid grid-cols-1 gap-12">
              {Object.values(BLOG_POSTS)
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
                    />
                  );
                })}
            </div>
          </section>
        </div>
      </main>
      {/* <PagePresenceUpdater pageId="home" /> */}
      <RecordEventOnMount event={analyticsEvent} />
    </>
  );
}

const analyticsEvent: AnalyticsEvent = {
  eventType: "view:home",
} as const;
