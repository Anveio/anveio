"use client"
import * as React from "react"

async function* readerToGenerator(
	reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<Uint8Array> {
	while (true) {
		const { done, value } = await reader.read()

		if (done) {
			break
		}

		yield value
	}
}

export function ChatWindow() {
	const [chatResponse, setChatResponse] = React.useState<string>("")

	async function processStreamedData(
		defaultReader: ReadableStreamDefaultReader<Uint8Array>
	): Promise<string> {
		const readableStream = new ReadableStream<Uint8Array>({
			async start(controller) {
				for await (const chunk of readerToGenerator(defaultReader)) {
					controller.enqueue(chunk)
				}
				controller.close()
			}
		})

		const textDecoderStream = new TextDecoderStream()
		const resultStream = readableStream.pipeThrough(textDecoderStream)

		let result = ""

		const resultReader = resultStream.getReader()
		while (true) {
			const { done, value } = await resultReader.read()

			if (done) {
				break
			}
			setChatResponse((prev) => {
				return prev + value
			})

			result += value
		}

		return result
	}

	return (
		<form
			action="/api/v1/aivisor/send-message"
			onSubmit={(e) => {
				e.preventDefault()
				console.log(e.target)
				fetch("/api/v1/aivisor/send-message", {
					method: "POST",
					body: JSON.stringify(new FormData(e.target as HTMLFormElement))
				})
					.then((response) => response.body)
					.then((rb) => {
						if (!rb) {
							throw new Error("No Response Body")
						}

						const reader = rb.getReader()

						return processStreamedData(reader)
					})
					.then((result) => {
						// Do things with result
						console.log(result)
					})
			}}
		>
			<input
				type="text"
				id="message"
				name="message"
				placeholder="Type your message to the chat bot"
			/>
			<button type="submit"> Send Message </button>
			<div>{chatResponse && <pre>{chatResponse}</pre>}</div>
		</form>
	)
}
