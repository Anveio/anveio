/* eslint-disable no-console */
import "@edge-runtime/ponyfill"
import { Configuration, OpenAIApi } from "openai-edge"

const OPENAI_SECRET = process.env.OPENAI_SECRET

if (!OPENAI_SECRET) {
	throw new Error("OPENAI_SECRET missing")
}
const config = new Configuration({
	apiKey: OPENAI_SECRET
})

/**
 * OpenAI Edge client.
 *
 * Create a new completion stream. Stream of strings by default, set `mode:
 * 'raw'` for the raw stream of JSON objects.
 */
export const OpenAIEdgeClient = new OpenAIApi(config)
