import { BLOG_POSTS, formatDateWithSuffix } from "@/lib/blog/posts";
import Image from "next/image";
import React from "react";

export const Article = (props: React.PropsWithChildren) => {
  return (
    <article className="space-y-36 text-base leading-8">
      {props.children}
    </article>
  );
};

interface BlogHeaderProps {
  postId: keyof typeof BLOG_POSTS;
  publicAssetPath: string;
  imageCaption: string;
}

export const BlogHeader = (props: React.PropsWithChildren<BlogHeaderProps>) => {
  return (
    <div className="space-y-3">
      <p className="italic text-center">
        Published {formatDateWithSuffix(BLOG_POSTS[props.postId].publishedAt)}
      </p>
      <h1 className="text-center text-2xl font-semibold">
        {BLOG_POSTS[props.postId].title}
      </h1>
      <Image
        alt=""
        src={`/blog-assets/${props.publicAssetPath}/cover.webp`}
        className="blog-post-cover-image"
        width={896}
        height={896}
        priority
      />
      <p className="italic text-center">{props.imageCaption}</p>
    </div>
  );
};

export const Section = (props: React.PropsWithChildren) => {
  return <section className="space-y-12">{props.children}</section>;
};

Section.Header = (props: React.PropsWithChildren) => {
  return <h2 className="text-2xl font-semibold">{props.children}</h2>;
};
