export const BLOG_POSTS = {
  "vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router": {
    slug: "vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router",
    content: `Free analytics for up to 10 million events a month and you can query your own data however you like with SQL. It turns out you can use Vercel to beat Vercel. Thanks Vercel! `,
    title: `Saving $400/month on Vercel Analytics by using Edge Runtime and Planetscale's free tier instead`,
    imageHref: `/blog-assets/vercel-edge-analytics/cover.webp`,
    publishedAt: new Date("2023-10-27"),
    majorUpdateDates: [],
    readyForProduction: true,
  },
  "algorithmic-loot-generation-sucks": {
    slug: "algorithmic-loot-generation-sucks",
    content:
      "Loot we find in games are foundational to the stories we form of our time playing them. Who decided this needed to automated?",
    title: `What Did we Gain from Algorithmic Loot Generation? More than we Lost.`,
    imageHref: `/blog-assets/algorithmic-loot-generation-sucks/cover.webp`,
    publishedAt: new Date("2023-10-28"),
    majorUpdateDates: [],
    readyForProduction: true,
  },
  "the-genocide-isnt-complicated-actually": {
    slug: "the-genocide-isnt-complicated-actually",
    content:
      "The perpetrators of genocide never think they're doing something evil, they'll always point to some violence done by their victims to justify continuing the death and suffering and its morally okay, in my view, to ignore the noise in favor of pursuing an end to the violence in its totality. So let's talk solutions",
    imageHref: `/blog-assets/the-genocide-isnt-complicated-actually/cover.webp`,
    title: "The Genocide Isn't Complicated, Actually",
    publishedAt: new Date("2023-10-31"),
    majorUpdateDates: [],
    readyForProduction: false,
  },
} as const;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long", // Date as "October 25, 2023"
});

export const formatDateWithSuffix = (date: Date) => {
  return dateFormatter.format(date);
};
