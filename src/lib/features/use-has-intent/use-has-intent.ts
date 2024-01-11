import * as React from "react";
import { useHoverDirty } from "react-use";

export const useHasIntent = (ref: React.RefObject<HTMLElement>): boolean => {
  const [isPressed, setIsPressed] = React.useState(false);
  const elementIsBeingHovered = useHoverDirty(ref);

  const handleTouchStart = React.useCallback(() => {
    setIsPressed(true);
  }, []);

  const handleTouchEnd = React.useCallback(() => {
    setIsPressed(false);
  }, []);

  React.useEffect(() => {
    const element = ref.current;

    // Attach event listeners
    element?.addEventListener("touchstart", handleTouchStart);
    element?.addEventListener("touchend", handleTouchEnd);

    // Cleanup function
    return () => {
      element?.removeEventListener("touchstart", handleTouchStart);
      element?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [ref, handleTouchStart, handleTouchEnd]);

  return isPressed || elementIsBeingHovered;
};
