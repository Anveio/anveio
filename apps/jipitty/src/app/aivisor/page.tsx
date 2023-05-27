import ChatFeed from "@/components/Aivisor/ChatFeed"
import { auth } from "@clerk/nextjs"

export default async function Aivisor() {
	const { userId, user, actor, session } = auth()

	return (
		<main>
			<div className="flex">
				<div className="align-self-end">
					{userId ? (
						<ChatFeed
							profileImageSrc={user?.profileImageUrl}
							userId={userId}
							initialMessages={[]}
							conversatioPublicId={null}
						/>
					) : null}
				</div>
			</div>
		</main>
	)
}
