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
import { Presence, useOthers } from "@/lib/liveblocks.client";
import { User, BaseUserMeta } from "@liveblocks/client";
import { motion, useAnimation } from "framer-motion";
import { MotionCard } from "./MotionCard";

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
      {() => <BlogPostCardWithWidget {...props} />}
    </ClientSideSuspense>
  );
};

const BlogPostCardWithWidget = (props: Props) => {
  const othersViewingArticleCount = useOthers(
    (others) =>
      others.filter((other) => {
        return other.presence.currentlyViewedPage?.id === props.id;
      }).length
  );

  const nextOthersViewingArticleCount = React.useRef(othersViewingArticleCount);

  const controls = useAnimation();

  React.useEffect(() => {
    // Check if count has changed
    if (
      othersViewingArticleCount > 0 &&
      othersViewingArticleCount !== nextOthersViewingArticleCount.current
    ) {
      // Trigger the bounce animation
      controls.start({
        scale: [1, 1.025, 1],
        transition: {
          duration: 0.15,
        },
      });
    }
    nextOthersViewingArticleCount.current = othersViewingArticleCount;
  }, [othersViewingArticleCount]);

  return (
    <Link href={`/articles/${props.id}`}>
      <AppendRingIfLive numberWatchingLive={othersViewingArticleCount}>
        <MotionCard animate={controls}>
          <CardHeader>
            <CardTitle>{props.title}</CardTitle>
            <CardDescription>{props.content}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-between align-self-end">
            <div>
              <OtherUsersReadingBlogWidget articleId={props.id} />
            </div>
            <Button>Read</Button>
          </CardFooter>
        </MotionCard>
      </AppendRingIfLive>
    </Link>
  );
};

const BlogPostCard = (
  props: React.PropsWithChildren<
    Props & {
      className?: React.ComponentProps<typeof Card>["className"];
      animate?: React.ComponentProps<typeof motion.a>["animate"];
    }
  >
) => {
  return (
    <Link href={`/articles/${props.id}`}>
      <Card className={props.className}>
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
  const othersViewingArticleCount = useOthers(
    (others) =>
      others.filter((other) => {
        return other.presence.currentlyViewedPage?.id === props.articleId;
      }).length
  );

  return (
    <div className="flex items-center justify-center">
      {othersViewingArticleCount}
    </div>
  );
};

interface AppendOutlineProps {
  children: React.ReactElement | React.ReactElement[];
  numberWatchingLive: number;
}

const AppendRingIfLive: React.FC<AppendOutlineProps> = (props) => {
  return (
    <>
      {React.Children.map<
        React.ReactNode,
        React.ReactElement<{
          className?: string;
        }>
      >(props.children, (child) => {
        if (React.isValidElement(child)) {
          const childProps = child.props;
          // Retrieve existing className
          const existingClassName = childProps.className || "";

          // Create a new className by appending "outline" to the existing one
          const newClassName = `${existingClassName} ${
            props.numberWatchingLive > 0
              ? "ring-inset ring-4 ring-emerald-400"
              : ""
          }`;

          // Clone the element with the new className
          return React.cloneElement(child, { className: newClassName });
        }
        return child;
      })}
    </>
  );
};
