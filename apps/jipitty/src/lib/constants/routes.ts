import {
	CalendarIcon,
	ChatBubbleBottomCenterIcon,
	Cog6ToothIcon,
	BuildingLibraryIcon,
	PhotoIcon,
	LanguageIcon,
	HomeModernIcon
} from "@heroicons/react/24/outline"

export const Routes = {
	HOMEPAGE: "/",
	AIVISOR: "/aivisor",
	LIBRARY: "/library",
	STUDIO: "/studio",
	LOGIN: "/sign-in",
	SIGNUP: "/sign-up",
	PROFILE: "/profile",
	SETTINGS: "/profile/settings",
	TEAMS: "/teams"
} as const

export const TOP_LEVEL_NAVIGATION = [
	{ name: "Media Library", href: Routes.LIBRARY, icon: BuildingLibraryIcon },
	{ name: "Studio", href: Routes.STUDIO, icon: HomeModernIcon }
] as const

export const TEAMS = [
	{
		id: 1,
		name: "Snorpies",
		href: Routes.TEAMS + "/snorpies",
		initial: "S",
		current: false
	},
	{
		id: 2,
		name: "Global",
		href: Routes.TEAMS + "/global",
		initial: "G",
		current: false
	},
	{
		id: 3,
		name: "Blues",
		href: Routes.TEAMS + "/blues",
		initial: "B",
		current: false
	}
]
