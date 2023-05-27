import ChatFeed from "@/components/Aivisor/ChatFeed"
import { auth } from "@clerk/nextjs"

export default async function Aivisor() {
	const { userId, user, actor, session } = auth()

	console.log("user", user)
	console.log("actor", actor)
	console.log("session", session)
	console.log("userId", userId)

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
