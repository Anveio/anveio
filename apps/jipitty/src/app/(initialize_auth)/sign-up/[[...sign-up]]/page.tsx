"use client"
import { SignUp } from "@clerk/nextjs"

export default function Page() {
	return (
		<>
			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
				<div className="bg-white">
					<SignUp />
				</div>
			</div>
		</>
	)
}
