"use client"

import { streamParserMachine } from "@/lib/features/stream-reader-machine"
import { Session } from "next-auth"
import { DoneInvokeEvent, assign, createMachine, sendTo } from "xstate"
import { send } from "xstate/lib/actionTypes"
import { sendParent } from "xstate/lib/actions"

interface ChatMachineContext {
	previousMessages: {
		senderName: string
		message: string
	}[]
	messageDraft: string
	session: Session
	responseStream: ReadableStream<Uint8Array> | null
	streamedReplyFromAi: string
}

const States = {
	IDLE: "idle",
	SENDING_MESSAGE: "sendingMessage",
	RECEIVING_STREAM: "receivingStream",
	ERROR: "error"
} as const

const Events = {
	SEND_CHAT_MESSAGE: "sendChatMessage",
	CHUNK_UPDATE: "chunkUpdate",
	RETRY: "retry",
	UPDATE_DRAFT_MESSAGE: "updateDraftMessage",
	MESSAGE_RESPONSE_RECEIVED: "messageResponseReceived"
} as const

type ChatMachineStateSchema = {
	value: (typeof States)[keyof typeof States]
	context: ChatMachineContext
}

type ChatMachineEvent =
	| ChatMachineChunkUpdateEvent
	| ChatMachineRetryEvent
	| ChatMachineSendMessageEvent
	| ChatMachineUpdateDraftMessage
	| ChatMachineMessageSentResponseEvent

type ChatMachineSendMessageEvent = {
	type: typeof Events.SEND_CHAT_MESSAGE
}

type ChatMachineChunkUpdateEvent = {
	type: typeof Events.CHUNK_UPDATE
	chunk: string
}

type ChatMachineRetryEvent = {
	type: typeof Events.RETRY
}

type ChatMachineUpdateDraftMessage = {
	type: typeof Events.UPDATE_DRAFT_MESSAGE
	message: string
}

type ChatMachineMessageSentResponseEvent = {
	type: typeof Events.MESSAGE_RESPONSE_RECEIVED
	response: Response
}

const MACHINE_ID = "open-ai-chat-machine"

export const streamedChatMachine = (
	session: Session,
	previousMessages: ChatMachineContext["previousMessages"]
) =>
	{ const x =  createMachine<ChatMachineContext, ChatMachineEvent, ChatMachineStateSchema>({
		id: MACHINE_ID,
		context: {
			previousMessages,
			session,
			messageDraft: "Please reply with 2 sentences of lorem ipsum.",
			responseStream: null,
			streamedReplyFromAi: ""
		},
		initial: States.IDLE,
		on: {
			updateDraftMessage: {
				actions: assign({
					messageDraft: (_, event) => {
						console.log(event.message, "Updated")
						return event.message
					}
				})
			},
			[Events.SEND_CHAT_MESSAGE]: {
				target: States.SENDING_MESSAGE
			},
			[Events.CHUNK_UPDATE]: {
				actions: assign({
					streamedReplyFromAi: (context, event) => {
						console.log("Updating response", event.chunk)
						return context.streamedReplyFromAi + event.chunk
					}
				})
			}
		},
		states: {
			idle: {
				entry: assign({
					responseStream: null
				})
			},
			sendingMessage: {
				invoke: {
					id: States.SENDING_MESSAGE,
					src: async (context) => {
						const response = await fetch("/api/v1/aivisor/send-message", {
							method: "POST",
							body: JSON.stringify({
								email: context.session.user?.email,
								message: context.messageDraft
							})
						})

						if (!response.body) {
							throw new Error("No Response Body")
						}

						if (!response.ok) {
							throw new Error("Response not ok")
						}

						return {
							type: Events.MESSAGE_RESPONSE_RECEIVED,
							response
						}
					},
					onDone: {
						target: States.RECEIVING_STREAM,
						actions: assign({
							responseStream: (
								_,
								event: DoneInvokeEvent<ChatMachineMessageSentResponseEvent>
							) => {
								console.log("Updating fetch response", event.data)
								return event.data.response.body
							}
						})
					},
					onError: {
						target: States.ERROR
					}
				}
			},
			[States.RECEIVING_STREAM]: {
				on: {
					[Events.CHUNK_UPDATE]: {
						actions: assign({
							streamedReplyFromAi: (context, event) => {
								console.log("Updating response", event.chunk)
								return context.streamedReplyFromAi + event.chunk
							}
						})
					}
				},
				invoke: {
					id: "parsingStream",
					src: async (context) => {
						console.log("Invoking parsingStream")
						if (!context.responseStream) throw new Error("Stream is not set.")
						console.log("getting reader")
						const reader = context.responseStream.getReader()

						try {
							while (true) {
								const { done, value } = await reader.read()
								console.log("Reading", !done)
								if (done) break

								if (value) {
									console.log("Sending message to parent;")
									sendTo(MACHINE_ID, { type: Events.CHUNK_UPDATE, chunk: value })
								}
							}
						} finally {
							reader.releaseLock()
						}
					},
					onDone: {
						target: States.IDLE,
						actions: assign({
							previousMessages: (context) => {
								console.log(
									"Updating previous messages",
									context.responseStream
								)
								return [
									...context.previousMessages,
									{
										message: context.messageDraft,
										senderName: session.user?.name || "You"
									},
									{
										message: context.streamedReplyFromAi,
										senderName: "AI Assistant"
									}
								]
							}
						})
					},
					onError: {
						target: "error"
					}
				}
			},
			error: {
				entry: [
					() => console.log("ERROR"),
					console.log,
					assign({
						responseStream: null,
						streamedReplyFromAi: ""
					})
				],
				on: {
					retry: {
						target: States.SENDING_MESSAGE
					}
				}
			}
		},
		predictableActionArguments: true
	})

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
