import { z } from "zod"
import { createConversationResponseBodySchema, createConversationRequestBodySchema, sendMessageRequestBodySchema, sendMessageResponseBodySchema } from "./schemas"

export const createConversation = async (body: z.infer<typeof createConversationRequestBodySchema>) => {
    
    const safeBody = createConversationRequestBodySchema.parse(body)
    
    const response = await fetch("/api/v1/aivisor/conversations/create-conversation", {
        method: "POST",
        body: JSON.stringify(safeBody)
    })

    const json = await response.json()

    const safeJson = createConversationResponseBodySchema.parse(json)

    return safeJson
}

const textDecoderStreamRef = new TextDecoderStream()

export const createMessageInConversation = async (body: z.infer<typeof sendMessageRequestBodySchema>) => {
        
        const safeBody = sendMessageRequestBodySchema.parse(body)
        
        const response = await fetch("/api/v1/aivisor/send-message", {
            method: "POST",
            body: JSON.stringify(safeBody)
        })

        if (!response.body) {
			throw new Error("No Response Body")
		}

		if (!response.ok) {
			throw new Error("Response not ok")
		}

    
        const reader = response.body.getReader()

		const readableStream = new ReadableStream<Uint8Array>({
			async start(controller) {
				for await (const chunk of readerToGenerator(reader)) {
					controller.enqueue(chunk)
				}
				controller.close()
			}
		})

        const resultStream = readableStream.pipeThrough(textDecoderStreamRef)
        const resultReader = resultStream.getReader()

        return resultReader
}

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
