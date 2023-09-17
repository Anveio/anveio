"use client";

import { AVATAR_ID_TO_DISPLAY_META } from "@/lib/features/avatars.client/avatars";
import {
  useMyPresence,
  useOthersOnPage,
  useUpdateMyPresence,
} from "@/lib/liveblocks.client";
import { cn } from "@/lib/utils";
import { ClientSideSuspense } from "@liveblocks/react";
import * as React from "react";
import styles from "./Cursor.module.css";
import { MousePointer2 } from "lucide-react";

interface Props extends Omit<React.ComponentProps<"div">, "color"> {
  color: string;
  name: string;
  x: number;
  y: number;
}

function Cursor({ x, y, color, name, className, style, ...props }: Props) {
  return (
    <div
      className={cn(className, styles.cursor)}
      style={{ transform: `translate(${x}px, ${y}px`, zIndex: 51, ...style }}
      {...props}
    >
      <MousePointer2
        className={styles.pointer}
        color={color}
        stroke={"black"}
        strokeWidth={1}
        fill={color}
        height="44"
        viewBox="0 0 24 36"
        width="32"
      />
    </div>
  );
}

/**
 * This file shows you how to create a reusable live cursors component for your product.
 * The component takes a reference to another element ref `element` and renders
 * cursors according to the location and scroll position of this panel.
 */
const Cursors = React.memo((props: { currentlyViewedPageId: string }) => {
  const otherPresences = useOthersOnPage(props.currentlyViewedPageId);

  return (
    <>
      {
        /**
         * Iterate over other users and display a cursor based on their presence
         */
        otherPresences.map((other, i) => {
          const cursor = other.presence.cursor;
          const avatar = other.presence.avatar;

          if (!cursor) {
            return null;
          }

          const cursorColor = avatar
            ? AVATAR_ID_TO_DISPLAY_META[avatar].iconColor
            : "chartreuse";

          return (
            <Cursor
              color={cursorColor}
              key={`cursor-${i}`}
              // connectionId is an integer that is incremented at every new connections
              // Assigning a color with a modulo makes sure that a specific user has the same colors on every clients
              name={"Anonymous"}
              x={cursor.x}
              y={cursor.y}
            />
          );
        })
      }
    </>
  );
});

export const CursorCanvas = () => {
  return (
    <ClientSideSuspense fallback={null}>
      {() => {
        return <CursorCanvasWithLiveBlocksLoaded />;
      }}
    </ClientSideSuspense>
  );
};

const CursorCanvasWithLiveBlocksLoaded = () => {
  const [myPresence] = useMyPresence();

  useUpdateMyCursor();

  return <Cursors currentlyViewedPageId={myPresence.currentlyViewedPage.id} />;
};

export const useUpdateMyCursor = () => {
  /**
   * useMyPresence returns a function to update  the current user's presence.
   * updateMyPresence is different to the setState function returned by the useState hook from React.
   * You don't need to pass the full presence object to update it.
   * See https://liveblocks.io/docs/api-reference/liveblocks-react#useUpdateMyPresence for more information
   */
  const updateMyPresence = useUpdateMyPresence();
  React.useEffect(() => {
    // If element, add live cursor listeners
    const updateCursor = (event: PointerEvent) => {
      const rootElement = globalThis.window.document.body;

      const { top, left } = rootElement.getBoundingClientRect();

      const x = event.clientX - left + rootElement.scrollLeft;
      const y = event.clientY - top + rootElement.scrollTop;

      updateMyPresence({
        cursor: {
          x: Math.round(x),
          y: Math.round(y),
        },
      });
    };

    const removeCursor = () => {
      updateMyPresence({
        cursor: null,
      });
    };

    globalThis.window.document.body.addEventListener(
      "pointermove",
      updateCursor
    );
    globalThis.window.document.body.addEventListener(
      "pointerleave",
      removeCursor
    );

    // Clean up event listeners
    return () => {
      globalThis.window.document.body.removeEventListener(
        "pointermove",
        updateCursor
      );
      globalThis.window.document.body.removeEventListener(
        "pointerleave",
        removeCursor
      );
    };
  }, [updateMyPresence]);
};
