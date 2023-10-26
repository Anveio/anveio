import { RecordEventOnMount } from "@/components/custom/Analytics";
import { LiveBlogPostCard } from "@/components/custom/LiveBlogPostCard";
import { AnalyticsEvent } from "@/lib/analytics/types";
import { BLOG_POSTS } from "@/lib/blog/posts";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="bg-background">
        <Image
          src={"/bghero.webp"}
          priority
          alt=""
          width={1000}
          height={1000}
          className="pointer-events-none absolute z-10 left-0 -right-20 h-full w-full select-none md:block"
          style={{ color: "transparent" }}
        />
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
            <div className="grid grid-cols-1 gap-4">
              {Object.values(BLOG_POSTS).map((post) => {
                return (
                  <LiveBlogPostCard
                    key={post.slug}
                    content={post.content}
                    title={post.title}
                    id={post.slug}
                    slug={post.slug}
                    imageHref={post.imageHref}
                    eventType="click:vercel_edge_analytics"
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
