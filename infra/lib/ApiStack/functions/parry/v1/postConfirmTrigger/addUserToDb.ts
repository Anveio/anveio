import AWS from "aws-sdk"
const docClient = new AWS.DynamoDB.DocumentClient()
import * as z from "zod"

interface PostConfirmationEvent {
	request: {
		userAttributes: {
			sub: string
			userName: string
			email: string
		}
	}
}

const eventSchema = z.object({
	request: z.object({
		userAttributes: z.object({
			sub: z.string(),
			userName: z.string(),
			email: z.string(),
		}),
	}),
})

const envSchema = z.object({
	TABLENAME: z.string(),
})

async function addUserToDb(__unsafeEvent: PostConfirmationEvent) {
	const event = eventSchema.parse(__unsafeEvent)
	const env = envSchema.parse(process.env)

	//construct the params
	const params = {
		/**
		 * The TABLENAME env variable comes from CDK.
		 */
		/* eslint-disable-next-line turbo/no-undeclared-env-vars */
		TableName: env.TABLENAME,
		Item: {
			id: event.request.userAttributes.sub,
			username: event.request.userAttributes.userName,
			email: event.request.userAttributes.email,
		},
	}

	await docClient.put(params).promise()
	return
}

module.exports = { main: addUserToDb }
