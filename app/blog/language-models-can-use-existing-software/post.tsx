import type { PropsWithChildren } from 'react'
import Link from 'next/link'

import { getPostImage } from '@/lib/images/posts'
import { definePost } from '@/lib/posts/definePost'

const postMeta = {
	slug: 'language-models-can-use-existing-software',
	title: 'Language models can use existing software',
	summary:
		'Teach AI to speak the protocols we already use so it can operate the software we already have.',
	publishedAt: '2025-02-05T00:00:00.000Z',
	tags: ['ai', 'platforms'] as const,
	openGraphImage: {
		type: 'dynamic' as const,
		path: '/api/og/language-models-can-use-existing-software',
		alt: 'Diagram showing language models orchestrating existing software through standard protocols.',
	},
}

const post = definePost({
	meta: postMeta,
	component: function Post() {
		return (
			<Article>
				<BlogHeader
					title={postMeta.title}
					summary={postMeta.summary}
					publishedAt={postMeta.publishedAt}
					heroImageKey="cover"
					heroImageAlt="Illustration representing language models collaborating with existing software"
					heroCaption={`Future generations will look back at our limited view that language models could "only" generate text meant for humans and think: "How could they have missed what was right in front of their eyes?"`}
				/>
				<Section>
					<Section.Header>A Beautiful Future</Section.Header>
					<p>
						The future is going to kick ass, I promise you. Imagine the following pleasant scene because in this post I’m going to provide a blueprint for how we make it real:
					</p>
					<p>
						It’s Saturday and you’re playing your favorite game on the couch. Your significant other sends you a text: “Honey, have you filed our taxes yet?” You groan and realize it’s due in a few hours and you haven’t even started. You speak out loud: “ChatGPT, can you help me file my taxes?”. Your game split screens, the right third is now displaying the UI for AcmeTax, the highest rated app to file taxes. ChatGPT speaks back: “Sure thing. Do I have your permission to access relevant files to provide AcmeTax information about you?”. You respond: “Yep”. ChatGPT takes a few seconds and finally says: “OK, I’m ready to submit your taxes. I also filled out Form 1099-NEC and attached all 192 invoices for contract work you did last year. Would you like to review everything before submitting?”
					</p>
					<p>
						“No”, you say. “I’m sure you’ve got it.” You only now pause your game to text your SO, “Yep, it’s done =]”
					</p>
				</Section>
				<Section>
					<Section.Header>The GPT App Store is Doomed</Section.Header>
					<p>
						This may seem unrelated but hear me out: the GPT App Store is hitting the public this week and I think it’ll flop, just like Plugins and GPTs did. The reason it’ll flop is that OpenAI forgot how to be open and the consequence is that their platforms are filled with toys instead of real apps that solve real problems.
					</p>
					<p>
						OpenAI not actually being open has been a longstanding problem philosophically (though probably for the best, safety-wise) and the tepid response from users to what should have been revolutionary platforms like GPTs and Plugins are a wake up call to the industry that language models can and should evolve beyond insular platforms and capabilities.
					</p>
					<p>
						To understand how, we need to understand the dynamics of software platforms. Platforms are either open or closed. Closed: there’s a review process for devs to submit software, software can be deleted off customers’ devices, and you have to learn some proprietary API or proprietary hardware. Open: you just use it and don’t think about it much.
					</p>
					<p>Pick your favorite spot somewhere on the line:</p>
					<ImageWithCaption
						imageKey="platform-spectrum"
						caption="Your company’s design system and component libraries are way on the left, off the chart."
					/>
					<p>
						If you want a lot of developers on your closed platform you better have a near monopoly on a user base or you better be offering a disgustingly high revenue share. Plugins were highly closed and offered no revenue share so it’s no surprise few were ever developed and that few users found success with them. GPTs are more open but are intentionally hamstrung by OpenAI so they have limited usefulness to users.
					</p>
					<p>
						Platforms are a powerful idea when executed well. The App Store generated $1.1 trillion dollars for businesses just last year and the Web generated who knows how many multiples of that as global GDP growth. With a little bit of creativity AI can be a successful platform too, but companies running models, such as OpenAI, need to learn to let go of control and start establishing standards. It’s what’s best for them, best for companies seeking to build on top of them, and best for you.
					</p>
				</Section>
				<Section>
					<Section.Header>Reading AI-Generated Text is for Chumps</Section.Header>
					<p>
						I’ve read a few million tokens of text generated by ChatGPT in the last year and I don’t know about you but I’m tired of reading. It’d be way better if ChatGPT could generate apps on the fly for when I want to learn a language, plan a trip, journal, or whatever. Apps are way better than text because they are:
					</p>
					<ol className="list-outside space-y-4 list-disc">
						<li className="list-item">Interactive &amp; fun</li>
						<li className="list-item">
							Powerful, can do stuff like open a bank account, file taxes, book tickets
						</li>
						<li className="list-item">Designed for purpose</li>
					</ol>
					<p>
						AI generated apps are today, of course, a pipe dream. Language models cannot write, build, and then execute the client and server code that would be necessary to generate an app on the fly. But millions of these apps already exist: they’re called websites. We just need a way for AI and websites to talk to each other.
					</p>
					<p>
						Fortunately, there’s already a standard way for any device to communicate with websites. You may have heard of it, it's called HTTP. HTTP is just text. Language Model’s generate text. Language Model’s can therefore communicate with websites by outputting HTTP. You of course need to send the string via your computer’s network interface chip across the world and listen for the response but that’s something your browser did about 30 times in under a second when you loaded this web page.
					</p>
					<p>
						OpenAI undoubtedly sees the ravenous hunger for ChatGPT to output JSON, but JSON is just one standard for data interchange, typically over a network. We could just as easily teach ChatGPT to output binary instructions for CPUs, or any number of other standard formats.
					</p>
					<p>
						The downside of apps is that every app has a learning curve, wouldn't it be nice if you could control Excel with natural language instead of asking ChatGPT how to use pivot tables when the real thing you're trying to do is make a pretty chart?
					</p>
					<p>
						This is the key idea the industry is missing: if we have a standard text format that’s understood by both your favorite language model and your favorite software then AI can control software directly. And once AI can control software directly you can control software with natural language.
					</p>
					<p>
						I envision a world where ChatGPT almost never generates raw text. It instead should output command strings (like HTTP) to websites, apps, and your device’s OS to accomplish any task.
					</p>
				</Section>
				<Section>
					<Section.Header>Language Models are an Open Platform Now</Section.Header>
					<p>
						Let's say my vision comes true. ChatGPT (or whichever language model wins) is now the entry point to accomplish any task. No more browser. No more App Stores. Your language model will find and download apps on demand and pin the ones you use frequently to your device’s home screen. If you need to find a file or organize files, you’ll do it through natural language.
					</p>
					<p>
						This means that every developer needs to teach language models how to use their app so that the model can map natural language requests such as “file my taxes” to a sequence of commands. First, perhaps, to your file system to find relevant PDFs, then to log into AcmeTax while proving it can act on your behalf and finally to send one big POST request with all of your info and encoded file blobs.
					</p>
					<p>
						But doing so is simple. The developers at AcmeTax simply describe their API in natural language in a text file hosted at acme-tax.com/mythra.txt (I describe this in more technical detail at{' '}
						<Link href="https://mythra.vercel.app" className="underline">
							https://mythra.vercel.app
						</Link>
						) and language models read those text files during training. For native apps a similar description of available actions can be hosted in a manifest file and app stores scan host a public directory of all apps' manifests somewhere where language models can regularly read them. For executables and apps not distributed through app stores (e.g. Photoshop, 7zip, ) the industry will need to invent some standard to allow AI to "bind" to software.
					</p>
					<p>
						What I’m describing is the ability for any language model to command any application. This is an open platform for both language model developers and app developers while massively scaling the capability and usefulness of both language models and apps.
					</p>
					<p>
						If a website sucks or is malicious it’s omitted from the training set or the app hosting the language model can remotely be configured to display an error if a command string is generated for a website that’s been hacked or changed to be malicious.
					</p>
					<p>
						I call these files that apps use to “teach” language models how to use them AI bindings. The capabilities that AI bindings unlock makes GPTs
					</p>
				</Section>
			</Article>
		)
	},
})

export const postDefinition = post

const Article = ({ children }: PropsWithChildren) => (
	<article className="prose prose-slate mx-auto max-w-3xl dark:prose-invert">{children}</article>
)

const SectionBase = ({ children }: PropsWithChildren) => (
	<section className="space-y-6">{children}</section>
)

const SectionHeader = ({ children }: PropsWithChildren) => (
	<h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{children}</h2>
)

const Section = Object.assign(SectionBase, {
	Header: SectionHeader,
})

const BlogHeader = ({
	title,
	summary,
	publishedAt,
	heroCaption,
	heroImageKey,
	heroImageAlt,
}: {
	title: string
	summary: string
	publishedAt: string
	heroCaption?: string
	heroImageKey?: string
	heroImageAlt?: string
}) => {
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(new Date(publishedAt))

	return (
		<header className="space-y-4">
			<p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
				Published {formattedDate}
			</p>
			<h1 className="text-center text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
				{title}
			</h1>
			<p className="text-center text-base text-slate-600 dark:text-slate-300">{summary}</p>
			{heroImageKey ? (
				<div className="mx-auto max-w-3xl">
					<ResponsiveImage
						postSlug={postMeta.slug}
						imageKey={heroImageKey}
						alt={heroImageAlt ?? summary}
						sizes="(min-width: 1024px) 768px, 100vw"
						className="mx-auto rounded-2xl"
					/>
				</div>
			) : null}
			{heroCaption ? (
				<p className="text-center text-sm italic text-slate-500 dark:text-slate-400">{heroCaption}</p>
			) : null}
		</header>
	)
}

const ImageWithCaption = ({
	imageKey,
	caption,
	alt,
	sizes = '(min-width: 768px) 640px, 100vw',
}: {
	imageKey: string
	caption: string
	alt?: string
	sizes?: string
}) => (
	<figure className="my-10 space-y-4 text-center">
		<ResponsiveImage
			postSlug={postMeta.slug}
			imageKey={imageKey}
			alt={alt ?? caption}
			sizes={sizes}
			className="mx-auto rounded-xl"
		/>
		<figcaption className="text-sm italic text-slate-500 dark:text-slate-400">{caption}</figcaption>
	</figure>
)

const ResponsiveImage = ({
	postSlug,
	imageKey,
	alt,
	sizes,
	className,
}: {
	postSlug: string
	imageKey: string
	alt: string
	sizes: string
	className?: string
}) => {
	const data = getPostImage(postSlug, imageKey)
	return (
		<picture>
			<source srcSet={data.srcSet} type="image/webp" sizes={sizes} />
			<img
				src={data.src}
				alt={alt}
				width={data.width}
				height={data.height}
				sizes={sizes}
				srcSet={data.srcSet}
				className={className}
				loading="lazy"
				decoding="async"
				style={{ backgroundImage: `url(${data.placeholder})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
			/>
		</picture>
	)
}
