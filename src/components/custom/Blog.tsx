import { BLOG_POSTS, formatDateWithSuffix } from "@/lib/blog/posts";
import Image from "next/image";
import React from "react";

export const Article = (props: React.PropsWithChildren) => {
  return (
    <article className="py-3 sm:py-4 px-6 space-y-24 text-base dark:text-gray-300 text-gray-800 leading-8">
      {props.children}
    </article>
  );
};

interface BlogHeaderProps {
  postId: keyof typeof BLOG_POSTS;
  imageCaption: string;
  imageWidth?: number;
  imageHeight?: number;
}

export const BlogHeader = (props: React.PropsWithChildren<BlogHeaderProps>) => {
  return (
    <div className="space-y-6">
      <p className="italic text-sm text-center font-extralight dark:text-gray-400 text-gray-700">
        Published {formatDateWithSuffix(BLOG_POSTS[props.postId].publishedAt)}
      </p>
      <h1 className="text-center text-xl font-normal dark:text-gray-200 text-gray-950">
        {BLOG_POSTS[props.postId].title}
      </h1>
      <Image
        alt=""
        src={`/blog-assets/${
          BLOG_POSTS[props.postId].publicAssetPath
        }/cover.webp`}
        className="blog-post-cover-image mx-auto"
        width={props.imageWidth ?? 896}
        height={props.imageHeight ?? 896}
        priority
      />
      <p className="italic text-center text-sm leading-6">
        {props.imageCaption}
      </p>
    </div>
  );
};

export const Section = (props: React.PropsWithChildren) => {
  return <section className="space-y-10">{props.children}</section>;
};

Section.Header = (props: React.PropsWithChildren) => {
  return <h2 className="text-xl font-semibold">{props.children}</h2>;
};

interface ImageWithCaptionProps {
  postId: keyof typeof BLOG_POSTS;
  fileName: string;
  imageCaption: string;
  imageWidth?: number;
  imageHeight?: number;
}

export const ImageWithCaption = (
  props: React.PropsWithChildren<ImageWithCaptionProps>
) => {
  return (
    <figure className="flex flex-col justify-center items-center py-8">
      <Image
        src={`/blog-assets/${BLOG_POSTS[props.postId].publicAssetPath}/${
          props.fileName
        }.webp`}
        alt=""
        width={props.imageWidth ?? 800}
        height={props.imageHeight ?? 800}
      />
      <figcaption className="text-sm text-center py-4">
        {props.imageCaption}
      </figcaption>
    </figure>
  );
};
