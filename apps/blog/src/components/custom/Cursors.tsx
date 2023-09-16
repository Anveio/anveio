"use client";

import * as React from "react";
import {
  useMyPresence,
  useOthers,
  useUpdateMyPresence,
} from "@/lib/liveblocks.client";
import { ClientSideSuspense } from "@liveblocks/react";
import { getContrastingColor } from "@/lib/getContrastingColor";
import { cn } from "@/lib/utils";
import styles from "./Cursor.module.css";

interface Props extends Omit<React.ComponentProps<"div">, "color"> {
  color: string;
  name: string;
  x: number;
  y: number;
}

function Cursor({ x, y, color, name, className, style, ...props }: Props) {
  const textColor = React.useMemo(
    () => (color ? getContrastingColor(color) : undefined),
    [color]
  );

  console.log(`Rendering at position: ${x}, ${y}`);

  return (
    <div
      className={cn(className, styles.cursor)}
      style={{ transform: `translate(${x}px, ${y}px`, zIndex: 51, ...style }}
      {...props}
    >
      <svg
        className={styles.pointer}
        fill="none"
        height="44"
        viewBox="0 0 24 36"
        width="32"
      >
        <path
          d="M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L14.3863 5.68247C15.2271 6.0135 15.2325 7.20148 14.3947 7.54008L9.85984 9.373C9.61167 9.47331 9.41408 9.66891 9.31127 9.91604L7.43907 14.4165C7.09186 15.2511 5.90335 15.2333 5.58136 14.3886L0.928548 2.18278Z"
          fill={color}
          stroke="black" // Add this line for the black outline
          strokeWidth="0.5" // Add this line to specify the outline thickness
        />
      </svg>
    </div>
  );
}

const lerp = (start: number, end: number, alpha: number) => {
  return start * (1 - alpha) + end * alpha;
};

/**
 * This file shows you how to create a reusable live cursors component for your product.
 * The component takes a reference to another element ref `element` and renders
 * cursors according to the location and scroll position of this panel.
 */
function Cursors() {
  /**
   * useMyPresence returns a function to update  the current user's presence.
   * updateMyPresence is different to the setState function returned by the useState hook from React.
   * You don't need to pass the full presence object to update it.
   * See https://liveblocks.io/docs/api-reference/liveblocks-react#useUpdateMyPresence for more information
   */
  const updateMyPresence = useUpdateMyPresence();
  const [myPresence] = useMyPresence();

  /**
   * Return all the other users in the room and their presence (a cursor position in this case)
   */
  const others = useOthers((others) =>
    others.filter(
      (other) =>
        other.presence.currentlyViewedPage.id ===
        myPresence.currentlyViewedPage.id
    )
  );

  const [interpolatedCursors, setInterpolatedCursors] = React.useState<
    Record<string, { x: number; y: number } | null>
  >(
    others.reduce<Record<string, { x: number; y: number } | null>>(
      (acc, cur) => {
        acc[cur.connectionId] = cur.presence.cursor;
        return acc;
      },
      {}
    )
  );

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

  

  React.useEffect(() => {
    const animate = () => {
      const newInterpolatedCursors: Record<string, { x: number; y: number }> =
        {};

      others.forEach(({ connectionId, presence }) => {
        if (!presence || !presence.cursor) return;

        const oldPosition = interpolatedCursors[connectionId] || {
          x: presence.cursor.x,
          y: presence.cursor.y,
        };

        // Linear interpolation for smoothness
        const newX = lerp(oldPosition.x, presence.cursor.x, 0.1);
        const newY = lerp(oldPosition.y, presence.cursor.y, 0.1);

        newInterpolatedCursors[connectionId] = { x: newX, y: newY };
      });

      setInterpolatedCursors(newInterpolatedCursors);
      requestAnimationFrame(animate);
    };

    animate();
  }, [others, interpolatedCursors]);

  return (
    <>
      {
        /**
         * Iterate over other users and display a cursor based on their presence
         */
        others.map(({ connectionId, presence, info }) => {
          if (presence == null || presence.cursor == null) {
            return null;
          }

          const currentPosition = interpolatedCursors[connectionId] || {
            x: presence.cursor.x,
            y: presence.cursor.y,
          };

          return (
            <Cursor
              color={info?.color || "chartreuse"}
              key={`cursor-${connectionId}`}
              // connectionId is an integer that is incremented at every new connections
              // Assigning a color with a modulo makes sure that a specific user has the same colors on every clients
              name={"Anonymous"}
              x={currentPosition.x}
              y={currentPosition.y}
            />
          );
        })
      }
    </>
  );
}

export const CursorCanvas = () => {
  return (
    <ClientSideSuspense fallback={null}>
      {() => {
        return <Cursors />;
      }}
    </ClientSideSuspense>
  );
};
