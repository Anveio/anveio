import { Article, BlogHeader, Section } from "@/components/custom/Blog";
import { Blink } from "@/components/custom/ExternalInlineLink";
import { RecordEventOnMount } from "@/lib/analytics/analytics.client";
import { AnalyticsEvent } from "@/lib/analytics/types";
import { BLOG_POSTS, formatDateWithSuffix } from "@/lib/blog/posts";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: BLOG_POSTS["the-genocide-isnt-complicated-actually"].title,
  description:
    "An essay on how the Palestinian people can achieve peace within the next 10 years.",
  openGraph: {
    title: BLOG_POSTS["the-genocide-isnt-complicated-actually"].title,
    description:
      "An essay on how the Palestinian people can achieve peace within the next 10 years.",
    url: "https://anveio.com",
    siteName: "Anveio",
    images: [
      {
        url: "https://anveio.com/blog-assets/the-genocide-isnt-complicated-actually/opengraph.png",
        width: 871,
        height: 408,
      },
      {
        url: "https://anveio.com/blog-assets/the-genocide-isnt-complicated-actually/1953.webp",
        width: 800,
        height: 555,
        alt: "",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://anveio.com"),
};

export default function Post() {
  return (
    <Article>
      <BlogHeader
        postId="text-is-water"
        publicAssetPath="text-is-water"
        imageCaption={`Future generations will look back at us thinking LLMs could only generate text meant for humans and think: "How could they have missed what was right in front of their eyes?"`}
      ></BlogHeader>
      <Section>
        <Section.Header>
          Reading LLM-generated text is for chumps
        </Section.Header>
        <p>
          The GPT App Store will be generally available this week and I think it's gonna flop, here's why.
        </p>
      </Section>
      <RecordEventOnMount event={analyticsEvent} />
    </Article>
  );
}

const analyticsEvent: AnalyticsEvent = {
  eventType: "view:blog:the-genocide-isnt-complicated-actually",
} as const;
