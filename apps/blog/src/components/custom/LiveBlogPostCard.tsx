"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AVATAR_ID_TO_DISPLAY_META } from "@/lib/features/avatars.client/avatars";
import { useOthersOnPage } from "@/lib/liveblocks.client";
import { cn, notEmpty } from "@/lib/utils";
import { ClientSideSuspense } from "@liveblocks/react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import Link from "next/link";
import * as React from "react";
import { Button } from "../ui/button";
import { MotionCard } from "./MotionCard";
import Image from "next/image";
import { AnalyticsEvent } from "@/lib/analytics/types";
import { enqueueAnalyticsEvent } from "@/lib/analytics/analytics.client";

type StartsWith<S extends string, T extends string> = T extends `${S}${infer _}`
  ? T
  : never;

interface Props {
  id: string;
  title: string;
  content: string;
  slug: string;
  imageHref: string;
  eventType: StartsWith<"click", AnalyticsEvent["eventType"]>;
  priority?: boolean;
}

let IS_USING_MULTIPLAYER = false;

export const LiveBlogPostCard = (props: Props) => {
  if (!IS_USING_MULTIPLAYER) {
    return <BlogPostCard {...props} />;
  }

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
  const othersOnPage = useOthersOnPage(props.id);

  const nextOthersViewingArticleCount = React.useRef(othersOnPage.length);

  const controls = useAnimation();

  React.useEffect(() => {
    // Check if count has changed
    if (
      othersOnPage.length > 0 &&
      othersOnPage.length !== nextOthersViewingArticleCount.current
    ) {
      // Trigger the bounce animation
      controls.start({
        scale: [1, 1.025, 1],
        transition: {
          duration: 0.15,
        },
      });
    }
    nextOthersViewingArticleCount.current = othersOnPage.length;
  }, [othersOnPage]);

  const otherColors = othersOnPage
    .map((el) => el.presence.avatar)
    .filter(notEmpty)
    .map((avatar) => AVATAR_ID_TO_DISPLAY_META[avatar].iconColor);

  return (
    <Link href={`/articles/${props.slug}`}>
      <AppendRingIfLive
        numberWatchingLive={othersOnPage.length}
        colors={otherColors}
      >
        <CardHeader>
          <CardTitle className="text-2xl lg:py-4">{props.title}</CardTitle>
          <CardDescription className="px-2 md:px-4 text-xl text-center">
            {props.content}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-between align-self-end">
          <div>
            <OtherUsersReadingBlogWidget articleId={props.id} />
          </div>
          <Button
            className="hover:text-black"
            onClick={() => {
              enqueueAnalyticsEvent({
                eventType: props.eventType,
              });
            }}
          >
            Read
          </Button>
        </CardFooter>
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
    <div className="flex flex-col rounded-xl border">
      <div className="py-8 ">
        <Link tabIndex={-1} href={`/blog/${props.slug}`}>
          <h2 className="text-3xl hover:underline text-brand font-semibold sm:text-4xl text-center">
            {props.title}
          </h2>
        </Link>
      </div>
      <Link
        href={`/blog/${props.slug}`}
        className="mx-auto border-t py-8 blog-post-link"
      >
        <div className="flex flex-col sm:flex-row w-full px-8">
          <div className="sm:w-1/2">
            <Image
              src={props.imageHref}
              priority
              alt=""
              width={550}
              height={550}
              className="pointer-events-none select-none rounded-b-xl blog-post-cover-image pt-2 w-full h-full object-cover "
            />
          </div>
          <div className="sm:pl-8 sm:w-1/2 text-slate-300 ">
            <div className="flex flex-col sm:h-full sm:pt-0 pt-8 sm:justify-between sm:space-y-0 space-y-8">
              <p className="md:text-lg text-base text-slate-300">
                {props.content}
              </p>
              <Button
                tabIndex={-1}
                variant={"outline"}
                className="blog-post-button"
                onClick={() => {
                  enqueueAnalyticsEvent({
                    eventType: props.eventType,
                  });
                }}
              >
                <span className="blog-post-button-text">Read</span>
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const OVERLAP_PIXELS = 25;

const OtherUsersReadingBlogWidget = (props: { articleId: string }) => {
  const othersViewingArticle = useOthersOnPage(props.articleId);

  return (
    <div className="grid place-items-center grid-cols-5 grid-gap-[-5px]">
      <AnimatePresence>
        {othersViewingArticle.map((el, index) => {
          const avatarMeta = el.presence.avatar
            ? AVATAR_ID_TO_DISPLAY_META[el.presence.avatar]
            : null;

          const AvatarIcon = avatarMeta ? avatarMeta.iconComponent : null;

          const ringStyle = {
            backgroundColor: "white",
            "--tw-ring-color": avatarMeta?.iconColor,
            marginLeft: `-${OVERLAP_PIXELS * index}px`,
            zIndex: index,
          };

          return (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{
                duration: 0.2,
              }}
              key={el.connectionId}
              className="rounded-full ring-inset ring-2 h-8 w-8 flex items-center justify-center"
              style={ringStyle}
            >
              {AvatarIcon ? (
                <AvatarIcon
                  className="h-5 w-5"
                  stroke={avatarMeta?.iconColor}
                />
              ) : (
                "hi"
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

interface AppendOutlineProps {
  children: React.ReactElement | React.ReactElement[];
  colors: string[];
  numberWatchingLive: number;
}

interface StyleProperties extends React.CSSProperties {
  ["--tw-ring-color"]: string;
}

const AppendRingIfLive: React.FC<AppendOutlineProps> = (props) => {
  const colorToUse = props.colors[0];

  return (
    <>
      {React.Children.map<
        React.ReactNode,
        React.ReactElement<{
          className?: string;
          style: StyleProperties;
        }>
      >(props.children, (child) => {
        if (React.isValidElement(child)) {
          const childProps = child.props;
          // Retrieve existing className
          const existingClassName = childProps.className || "";

          // Create a new className by appending "outline" to the existing one
          const newClassName = `${existingClassName} ${
            props.numberWatchingLive > 0 ? "ring-inset ring-4" : ""
          }`;

          // Clone the element with the new className
          return React.cloneElement(child, {
            className: newClassName,
            style: {
              "--tw-ring-color": colorToUse,
            },
          });
        }
        return child;
      })}
    </>
  );
};
