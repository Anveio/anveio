import ChatFeed from "@/components/Aivisor/ChatFeed"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function Aivisor() {
	const { userId, user } = auth()

	if (!userId) {
		return redirect("/")
	}

	return (
		<main>
			<div className="flex">
				<div className=" who knows"></div>
				<div className="align-self-end">
					<ChatFeed
						profileImageSrc={user?.experimental_imageUrl}
						userId={userId}
						initialMessages={[]}
						conversatioPublicId={null}
					/>
				</div>
			</div>
		</main>
	)
}
