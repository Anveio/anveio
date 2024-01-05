import { BLOG_POSTS, formatDateWithSuffix } from "@/lib/blog/posts";
import Image from "next/image";
import React from "react";

export const Article = (props: React.PropsWithChildren) => {
  return <article className="space-y-36 text-lg">{props.children}</article>;
};

interface BlogHeaderProps {
  postId: keyof typeof BLOG_POSTS;
  publicAssetPath: string;
}

export const BlogHeader = (props: BlogHeaderProps) => {
  return (
    <div className="space-y-3">
      <p className="italic text-center">
        Published {formatDateWithSuffix(BLOG_POSTS[props.postId].publishedAt)}
      </p>
      <h1 className="text-center text-2xl font-semibold">
        {BLOG_POSTS[props.postId].title}
      </h1>
      <Image
        alt="Decorative box art of an imaginary RPG game"
        src={`/blog-assets/${props.publicAssetPath}/cover.webp`}
        className="blog-post-cover-image"
        width={896}
        height={896}
        priority
      />
      <p className="italic text-center">
        Hamas is bad. But not just because they're a religious fundamentalist
        terror group. It's because they make a non-violent end to Israel's
        genocide in Gaza impossible so long as they exist.
      </p>
    </div>
  );
};
