"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";
import * as React from "react";

type MotionCardProps = HTMLMotionProps<"div"> &
  React.HTMLAttributes<HTMLDivElement>;

export const MotionCard = React.forwardRef<HTMLDivElement, MotionCardProps>(
  ({ className, ...props }, ref) => {
    console.log(`animate, props.animate`, props.animate);
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
          className
        )}
        animate={props.animate}
        {...props}
      />
    );
  }
);
