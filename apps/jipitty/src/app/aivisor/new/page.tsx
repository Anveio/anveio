function SuggestionBox(props: React.PropsWithChildren<{}>) {
	return (
		<div className="flex aspect-square items-center justify-center overflow-auto border-2 border-gray-200 bg-zinc-950 p-4">
			{props.children}
		</div>
	)
}

export default async function AivisorNewConversation() {
	return (
		<main>
			<div className="static relative bg-zinc-900">
				<div className="flex h-screen w-full flex-col justify-between">
					<div className="p-3 text-zinc-300">
						<div className="m-auto grid max-w-7xl grid-cols-1 gap-4 p-4 sm:grid-cols-3">
							<SuggestionBox>
								<p>How can I improve my coding skills?</p>
							</SuggestionBox>
							<SuggestionBox>
								<p>Write an article on "The Future of AI".</p>
							</SuggestionBox>
							<SuggestionBox>
								<p>What is the best way to learn data science?</p>
							</SuggestionBox>
							<SuggestionBox>
								<p>Describe the evolution of the internet.</p>
							</SuggestionBox>
							<SuggestionBox>
								<p>
									Generate a short story about a robot who wants to become an
									artist.
								</p>
							</SuggestionBox>
							<SuggestionBox>
								<p>Explain the concept of machine learning.</p>
							</SuggestionBox>
							<SuggestionBox>
								<p>What's the latest development in Quantum Computing?</p>
							</SuggestionBox>
							<SuggestionBox>
								<p>
									Create a resume for a software engineer with 5 years of
									experience.
								</p>
							</SuggestionBox>
							<SuggestionBox>
								<p>What are the differences between AI and Machine Learning?</p>
							</SuggestionBox>
						</div>
					</div>
					<div className="sticky bottom-0 h-16 bg-blue-500 p-4 text-white">
						{/* This is your footer. */}
					</div>
				</div>
			</div>
		</main>
	)
}
