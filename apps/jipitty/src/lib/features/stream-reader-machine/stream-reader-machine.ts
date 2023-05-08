// streamParser.ts
import {
	createMachine,
	assign,
	sendParent,
	ActorRefFrom,
	spawn,
	Interpreter
} from "xstate"

interface StreamParserContext {
	stream?: ReadableStream
}

type StreamParserEvent =
	| { type: "START"; stream: ReadableStream }
	| { type: "CHUNK"; chunk: Uint8Array }
	| { type: "DONE" }
	| { type: "ERROR"; error: Error }

const streamParserMachine = createMachine<
	StreamParserContext,
	StreamParserEvent
>(
	{
		predictableActionArguments: true,
		id: "streamParser",
		initial: "idle",
		context: {
			stream: undefined
		},
		states: {
			idle: {
				on: {
					START: {
						target: "reading",
						actions: "setStream"
					}
				}
			},
			reading: {
				invoke: {
					id: "readStream",
					src: "readStream",
					onDone: "done",
					onError: {
						target: "error",
						actions: "handleError"
					}
				}
			},
			done: {
				type: "final",
				entry: sendParent("DONE")
			},
			error: {
				type: "final",
				entry: sendParent("ERROR")
			}
		}
	},
	{
		actions: {
			setStream: assign((_, event) => {
				console.log("Setting stream")

				if (event.type !== "START") return {}

				return { stream: event.stream }
			}),
			handleError: sendParent((_, event) => {
				if (event.type !== "ERROR") return { type: "UNKNOWN_ERROR" }

				return { type: "ERROR", error: event.error }
			})
		},
		services: {
			readStream: async (context) => {
				if (!context.stream) throw new Error("Stream is not set.")

				const reader = context.stream.getReader()

				try {
					while (true) {
						const { done, value } = await reader.read()
						if (done) break

						if (value) {
							sendParent({ type: "CHUNK", chunk: value })
						}
					}
				} finally {
					reader.releaseLock()
				}
			}
		}
	}
)

async function processStreamedData(
	defaultReader: ReadableStreamDefaultReader<Uint8Array>,
	onData: (chunk: string) => void
) {
	console.log("Inside processStreamedData")
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

	const resultReader = resultStream.getReader()
	while (true) {
		const { done, value } = await resultReader.read()

		if (done) {
			break
		}
		console.log("Executing onData callback with value", value)
		onData(value)
	}

	return
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

export { streamParserMachine }
