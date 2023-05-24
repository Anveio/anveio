import ChatFeed from "@/components/Aivisor/ChatFeed"
import { auth } from "@clerk/nextjs"

export default async function Aivisor() {
	const { userId, user } = auth()

	return (
		<main>
			<div className="flex">
				<div className=" who knows"></div>
				<div className="align-self-end">
					{userId ? (
						<ChatFeed
							profileImageSrc={user?.experimental_imageUrl}
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
