"use client";

import * as React from "react";
import { Cursor } from "./Cursor";
import { useOthers, useUpdateMyPresence } from "@/lib/liveblocks.client";

/**
 * This file shows you how to create a reusable live cursors component for your product.
 * The component takes a reference to another element ref `element` and renders
 * cursors according to the location and scroll position of this panel.
 */
export function Cursors() {
  /**
   * useMyPresence returns a function to update  the current user's presence.
   * updateMyPresence is different to the setState function returned by the useState hook from React.
   * You don't need to pass the full presence object to update it.
   * See https://liveblocks.io/docs/api-reference/liveblocks-react#useUpdateMyPresence for more information
   */
  const updateMyPresence = useUpdateMyPresence();

  /**
   * Return all the other users in the room and their presence (a cursor position in this case)
   */
  const others = useOthers();

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

          return (
            <Cursor
              color={info?.color || "chartreuse"}
              key={`cursor-${connectionId}`}
              // connectionId is an integer that is incremented at every new connections
              // Assigning a color with a modulo makes sure that a specific user has the same colors on every clients
              name={"Anonymous"}
              x={presence.cursor.x}
              y={presence.cursor.y}
            />
          );
        })
      }
    </>
  );
}
