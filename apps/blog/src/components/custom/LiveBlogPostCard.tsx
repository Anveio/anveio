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
import { Presence, useOthers, useOthersOnPage } from "@/lib/liveblocks.client";
import { User, BaseUserMeta } from "@liveblocks/client";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { MotionCard } from "./MotionCard";
import { notEmpty } from "@/lib/utils";
import { AVATAR_ID_TO_DISPLAY_META } from "@/lib/features/avatars.client/avatars";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

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
    <Link href={`/articles/${props.id}`}>
      <AppendRingIfLive
        numberWatchingLive={othersOnPage.length}
        colors={otherColors}
      >
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
