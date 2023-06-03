import { getAllConversationsForUserByUserId } from "@/lib/db/queries"
import { MobileSidebar } from "./MobileSidebar"
import { SidebarCore } from "./SidebarCore"

interface Props {
	conversations: Awaited<ReturnType<typeof getAllConversationsForUserByUserId>>
}

export function Sidebar(props: Props) {
	return (
		<div>
			<MobileSidebar>
				<SidebarCore
					conversations={props.conversations}
					shouldGenerateConversationTitles={false}
				/>
			</MobileSidebar>
			<SidebarCore
				shouldGenerateConversationTitles={true}
				conversations={props.conversations}
				className="hidden lg:flex"
			/>
		</div>
	)
}
