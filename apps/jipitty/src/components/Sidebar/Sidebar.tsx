import { MobileSidebar } from "./MobileSidebar"
import { SidebarCore } from "./SidebarCore"

interface Props {
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
				<SidebarCore conversations={props.conversations} />
			</MobileSidebar>
			<SidebarCore
				conversations={props.conversations}
				className="hidden lg:flex"
			/>
		</div>
	)
}
