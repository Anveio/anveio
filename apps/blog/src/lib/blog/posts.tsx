export const BLOG_POSTS = {
  "vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router": {
    slug: "vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router",
    content: `Free analytics for up to 10 million events a month and you can query your own data however you like with SQL. It turns out you can use Vercel to beat Vercel. Thanks Vercel! `,
    title: `Saving $400/month on Vercel Analytics by using Edge Runtime and Planetscale's free tier instead`,
    imageHref: `/blog-assets/vercel-edge-analytics/cover.webp`,
    publishedAt: new Date("2023-10-27"),
    majorUpdateDates: [],
  },
  "algorithmic-loot-generation-sucks": {
    slug: "algorithmic-loot-generation-sucks",
    content:
      "Loot we find in games are foundational to the stories we form of our time playing them. Who decided this needed to automated?",
    title: `What did we gain from algorithmic loot generation? More than we lost.`,
    imageHref: `/blog-assets/algorithmic-loot-generation-sucks/cover.webp`,
    publishedAt: new Date("2023-10-28"),
    majorUpdateDates: [],
  },
} as const;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long", // Date as "October 25, 2023"
});

export const formatDateWithSuffix = (date: Date) => {
  return dateFormatter.format(date);
};
