import { Hero } from "@/components/Hero"
import { UserButton } from "@clerk/nextjs"

export default async function Home() {
	return (
		<main>
			<Hero />
		</main>
	)
}
