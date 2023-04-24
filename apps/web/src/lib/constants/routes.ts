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
} as const;

export const TOP_LEVEL_NAVIGATION = [
  { name: "Aivisor", href: Routes.AIVISOR, icon: ChatBubbleBottomCenterIcon },
  { name: "Upload", href: Routes.LIBRARY, icon: BuildingLibraryIcon },
  { name: "Create", href: Routes.STUDIO, icon: HomeModernIcon },
] as const;
