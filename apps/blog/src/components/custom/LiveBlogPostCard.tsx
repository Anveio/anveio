"use client";

import Link from "next/link";
import * as React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClientSideSuspense } from "@liveblocks/react";
import { Button } from "../ui/button";
import { useOthers } from "@/lib/liveblocks.client";

interface Props {
  id: string;
  title: string;
  content: string;
}

export const LiveBlogPostCard = (props: Props) => {
  return (
    <ClientSideSuspense
      fallback={
        <BlogPostCard {...props}>
          <div />
        </BlogPostCard>
      }
    >
      {() => {
        return (
          <BlogPostCard {...props}>
            <div>
              <OtherUsersReadingBlogWidget articleId={props.id} />
            </div>
          </BlogPostCard>
        );
      }}
    </ClientSideSuspense>
  );
};

const BlogPostCard = (props: React.PropsWithChildren<Props>) => {
  return (
    <Link href={`/articles/${props.id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
          <CardDescription>{props.content}</CardDescription>
        </CardHeader>
        <CardFooter className="justify-between align-self-end">
          {props.children}
          <Button>Read</Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

const OtherUsersReadingBlogWidget = (props: { articleId: string }) => {
  const othersViewingArticle = useOthers((others) =>
    others.filter((other) => {
      return other.presence.currentlyViewedPage?.id === props.articleId;
    })
  );

  return (
    <div className="flex items-center justify-center">
      {othersViewingArticle.length}
    </div>
  );
};
