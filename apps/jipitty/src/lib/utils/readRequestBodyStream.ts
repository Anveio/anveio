import "@edge-runtime/ponyfill"
import { NextRequest } from "next/server"

export const readStreamedRequestBody = async (request: NextRequest) => {
	if (!request.body) {
		return {}
	}

	console.log("READING REQUEST BODY", request.body)

	const reader = request.body.getReader()
	const decoder = new TextDecoder()
	let body = ""

	while (true) {
		const { done, value } = await reader.read()
		if (done) {
			break
		}
		body += decoder.decode(value, { stream: true })
	}

	body += decoder.decode() // Flush the remaining bytes

	if (!body) {
		return {}
	}

	return JSON.parse(body)
}

export async function* readerToGenerator(
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

export async function processStreamedData(
	rootStream: ReadableStream<Uint8Array>
) {
	const reader = rootStream.getReader()
	const textDecoderStreamRef = new TextDecoderStream()

	const readableStream = new ReadableStream<Uint8Array>({
		async start(controller) {
			for await (const chunk of readerToGenerator(reader)) {
				controller.enqueue(chunk)
			}
			controller.close()
		}
	})

	let finalResult = ""

	const resultStream = readableStream.pipeThrough(textDecoderStreamRef)
	const resultReader = resultStream.getReader()

	while (true) {
		const { done, value } = await resultReader.read()
		if (done) break

		if (value) {
			finalResult += value
		}
	}

	return finalResult
}
