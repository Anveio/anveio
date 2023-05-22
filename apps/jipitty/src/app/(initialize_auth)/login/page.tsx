/* eslint-disable react/no-unescaped-entities */
import {
	SignInWithGitHubButton,
	SignInWithGoogleButton
} from "@/components/Sidebar/SidebarButtons"
import Link from "next/link"
import React from "react"

export const metadata = {
	title: "Jipitty - Log In"
}

export default async function LoginPage() {
	return (
		<>
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-6xl font-bold tracking-tight text-gray-900">
					Log in to Jipitty
				</h2>
			</div>

			
		</>
	)
}
