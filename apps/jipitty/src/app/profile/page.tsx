import { SignIn, SignedIn, SignedOut, UserProfile } from "@clerk/nextjs"

export default async function Profile() {
	return (
		<>
			<SignedIn>
				<UserProfile />
			</SignedIn>
			<SignedOut>
				<SignIn />
			</SignedOut>
		</>
	)
}
