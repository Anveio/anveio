import {
	CognitoIdentityProviderClient,
	SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider"
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda"

import * as z from "zod"

const eventSchema = z.object({
	body: z.object({
		username: z.string(),
		password: z.string(),
		email: z.string(),
	}),
})

const envSchema = z.object({
	CLIENT_ID: z.string(),
	REGION: z.string(),
})

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
async function signupUser(
	event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> {
	const parsedEvent = eventSchema.safeParse(event)

	if (!parsedEvent.success) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Bad request",
				errors: parsedEvent.error.issues,
			}),
		}
	}

	const parsedEnv = envSchema.parse(process.env)

	/**
	 * These come from CDK
	 */
	/* eslint-disable turbo/no-undeclared-env-vars */
	const { CLIENT_ID, REGION } = parsedEnv

	const client = new CognitoIdentityProviderClient({
		region: REGION,
	})

	const { username, password, email } = parsedEvent.data.body

	const command = new SignUpCommand({
		ClientId: CLIENT_ID,
		Username: username,
		Password: password,
		UserAttributes: [{ Name: "email", Value: email }],
	})

	try {
		const result = await client.send(command)
		return {
			statusCode: 200,
			body: String(result.UserConfirmed),
		}
	} catch (e) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Bad request",
				errors: e,
			}),
		}
	}
}

module.exports = { main: signupUser }
