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
  SETTINGS: "/protile/settings",
  TEAMS: "/teams",
} as const;

export const TOP_LEVEL_NAVIGATION = [
  { name: "Aivisor", href: Routes.AIVISOR, icon: ChatBubbleBottomCenterIcon },
  { name: "Upload", href: Routes.LIBRARY, icon: BuildingLibraryIcon },
  { name: "Create", href: Routes.STUDIO, icon: HomeModernIcon },
] as const;

export const TEAMS = [
  {
    id: 1,
    name: "Snorpies",
    href: "/teams/snorpies",
    initial: "H",
    current: false,
  },
  {
    id: 2,
    name: "Global",
    href: "/teams/global",
    initial: "T",
    current: false,
  },
  {
    id: 3,
    name: "Workcation",
    href: "/teams/workcation",
    initial: "W",
    current: false,
  },
];