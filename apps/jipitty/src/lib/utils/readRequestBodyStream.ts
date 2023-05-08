import "@edge-runtime/ponyfill"
import { NextRequest } from "next/server"

export const readStreamedRequestBody = async (request: NextRequest) => {
	if (!request.body) {
		return null
	}

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
	return JSON.parse(body)
}
