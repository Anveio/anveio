import { getAllConversationsForUserByUserId } from "@/lib/db/utils"
import { MobileSidebar } from "./MobileSidebar"
import { SidebarCore } from "./SidebarCore"

interface Props {
	conversations: Awaited<ReturnType<typeof getAllConversationsForUserByUserId>>
}

export function Sidebar(props: Props) {
	if (props.conversations.length) {
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
