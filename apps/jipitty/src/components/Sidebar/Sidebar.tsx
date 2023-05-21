import { Session } from "next-auth"
import { MobileSidebar } from "./MobileSidebar"
import { SidebarCore } from "./SidebarCore"

interface Props {
	session: Session | null
	conversations: {
		title: string | null
		public_id: string
	}[]
}

export function Sidebar(props: Props) {
	if (props.conversations) {
		console.log("Found ocnversations", props.conversations.length)
	}

	return (
		<div>
			<MobileSidebar>
				<SidebarCore
					session={props.session}
					conversations={props.conversations}
				/>
			</MobileSidebar>
			<SidebarCore
				conversations={props.conversations}
				session={props.session}
				className="hidden lg:flex"
			/>
		</div>
	)
}
