import {
  CalendarIcon,
  ChatBubbleBottomCenterIcon,
  Cog6ToothIcon,
  BuildingLibraryIcon,
  PhotoIcon,
  LanguageIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";

export const Routes = {
  HOMEPAGE: "/",
  AIVISOR: "/aivisor",
  LIBRARY: "/library",
  STUDIO: "/studio",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  SETTINGS: "/profile/settings",
  TEAMS: "/teams",
} as const;

export const TOP_LEVEL_NAVIGATION = [
  { name: "Aivisor", href: Routes.AIVISOR, icon: ChatBubbleBottomCenterIcon },
  { name: "Media Library", href: Routes.LIBRARY, icon: BuildingLibraryIcon },
  { name: "Studio", href: Routes.STUDIO, icon: HomeModernIcon },
] as const;

export const TEAMS = [
  {
    id: 1,
    name: "Snorpies",
    href: "/teams/snorpies",
    initial: "S",
    current: false,
  },
  {
    id: 2,
    name: "Global",
    href: "/teams/global",
    initial: "G",
    current: false,
  },
  {
    id: 3,
    name: "Blues",
    href: "/teams/blues",
    initial: "B",
    current: false,
  },
];
