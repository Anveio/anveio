import { SignIn, SignedIn, SignedOut, UserProfile } from "@clerk/nextjs"

export default async function Profile() {
	return (
		<>
			<SignedIn>
				<div className="lg:py-10">
					<UserProfile
						appearance={{
							elements: {
								pageScrollBox: {
									overflowY: "auto"
								},
								navbarMobileMenuRow: {
									display: "none"
								},
								navbarMobileMenuButton: {
									display: "none"
								},
								navbar: {
									display: "none"
								}
							}
						}}
					/>
				</div>
			</SignedIn>
			<SignedOut>
				<SignIn />
			</SignedOut>
		</>
	)
}
