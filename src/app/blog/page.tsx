import { RecordEventOnMount } from '@/lib/analytics/analytics.client';
import { LiveBlogPostCard } from '@/components/custom/LiveBlogPostCard';
import { AnalyticsEvent } from '@/lib/analytics/types';
import { BLOG_POSTS } from '@/lib/blog/posts';

const posts = Object.values(BLOG_POSTS);

const postsToRender = posts
  .filter((post) => {
    if (process.env.NODE_ENV === 'development') {
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
        eventType='click:vercel_edge_analytics'
        priority={index === 0 ? true : undefined}
        publishedAt={post.publishedAt}
      />
    );
  });

export default function PageIndex() {
  return (
    <>
      <main className='space-y-2 mt-8'>
        <h1 className='text-center font-extralight dark:text-gray-400 text-gray-700'>
          Blog
        </h1>
        <div className='max-w-xl mx-auto sm:px-0 px-6 space-y-8'>
          {postsToRender}
        </div>
      </main>
      <RecordEventOnMount event={analyticsEvent} />
    </>
  );
}

const analyticsEvent: AnalyticsEvent = {
  eventType: 'view:home',
} as const;
