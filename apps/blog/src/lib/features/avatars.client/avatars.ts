import { useOthers, useOthersOnPage } from "@/lib/liveblocks.client";
import * as React from "react";
import {
  Bird,
  Bone,
  Fish,
  PawPrint,
  Rabbit,
  Snail,
  Turtle,
  Cat,
  Dog,
} from "lucide-react";

/**
 * The Avatar object needs to be JSON serializable. Client needs to map
 * the avatarId to the right icon.
 */
export const AVATAR_ID_TO_JSX_ICON = {
  bird: Bird,
  bone: Bone,
  fish: Fish,
  pawprint: PawPrint,
  rabbit: Rabbit,
  snail: Snail,
  turtle: Turtle,
  cat: Cat,
  dog: Dog,
} as const;

export const AVATAR_ID_TO_DISPLAY_META = {
  bird: {
    label: "Bird",
    iconComponent: Bird,
    iconColor: "oklch(50% 0.8 30)",
    selectedBackgroundColor: "oklch(50% 0.8 30 / 30%)",
  },
  bone: {
    label: "Bone",
    iconComponent: Bone,
    iconColor: "oklch(50% 0.9 100)",
    selectedBackgroundColor: "oklch(50% 0.9 100 / 30%)",
  },
  fish: {
    label: "Fish",
    iconComponent: Fish,
    iconColor: "oklch(60% 0.7 270)",
    selectedBackgroundColor: "oklch(60% 0.35 270 / 30%)",
  },
  pawprint: {
    label: "Paw Print",
    iconComponent: PawPrint,
    iconColor: "oklch(77.3% 0.183 182.12)",
    selectedBackgroundColor: "oklch(40% 0.3 160 / 30%)",
  },
  rabbit: {
    label: "Rabbit",
    iconComponent: Rabbit,
    iconColor: "oklch(55% 0.5 220)",
    selectedBackgroundColor: "oklch(55% 0.25 220 / 30%)",
  },
  snail: {
    label: "Snail",
    iconComponent: Snail,
    iconColor: "oklch(70% 0.7 90)",
    selectedBackgroundColor: "oklch(70% 0.35 90 / 30%)",
  },
  turtle: {
    label: "Turtle",
    iconComponent: Turtle,
    iconColor: "oklch(45% 0.9 180)",
    selectedBackgroundColor: "oklch(45% 0.45 180 / 30%)",
  },
  cat: {
    label: "Cat",
    iconComponent: Cat,
    iconColor: "oklch(76.6% 0.279 332.2)",
    selectedBackgroundColor: "oklch(65% 0.4 45 / 30%)",
  },
  dog: {
    label: "Dog",
    iconComponent: Dog,
    iconColor: "oklch(77.3% 0.18 95.29)",
    selectedBackgroundColor: "oklch(50% 0.45 75 / 30%)",
  },
};

export const useOtherAvatars = (pageId: string) => {
  const others = useOthersOnPage(pageId);

  const otherAvatars = React.useMemo(() => {
    return others.map((el) => el.presence.avatar);
  }, [others]);

  return otherAvatars;
};
