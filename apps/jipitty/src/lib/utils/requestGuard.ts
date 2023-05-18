import { decode } from "next-auth/jwt"
import { NextRequest } from "next/server"
import { readStreamedRequestBody } from "./readRequestBodyStream"
import { z } from "zod"

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

if (!NEXTAUTH_SECRET) {
	throw new Error("NEXTAUTH_SECRET missing")
}

export const parseSession =  async (sessionToken: string) => {
	const session = await decode({
		token: sessionToken,
		secret: NEXTAUTH_SECRET
	})

	return session
}

export const ensureRequestIsAuthenticated = async <T extends z.ZodType>(
	request: NextRequest,
	schema: T
) => {
	/**
	 * Have to do this the manual way since nextauth doesn't support edge yet.
	 */
	const requestSessionTokenCookie = request.cookies.get(
		"next-auth.session-token"
	)

	if (!requestSessionTokenCookie) {
		return {
			errorResponse: new Response(
				JSON.stringify({
					error: "Missing session token cookie"
				}),
				{
					status: 400,
					headers: {
						"content-type": "application/json"
					}
				}
			)
		}
	}

	const session = await decode({
		token: requestSessionTokenCookie.value,
		secret: NEXTAUTH_SECRET
	})

	/**
	 * Handle case where the request is made with an invalid session token
	 */
	if (!session) {
		return {
			errorResponse: new Response(
				JSON.stringify({
					error: "Session token is missing an email"
				}),
				{
					status: 400,
					headers: {
						"content-type": "application/json"
					}
				}
			)
		}
	}

	/**
	 * Handle case where the request is made with a a session token but there's
	 * no email asssociated with the session token.
	 */
	if (!session.email) {
		return {
			errorResponse: new Response(
				JSON.stringify({
					error: "Session token is missing an email"
				}),
				{
					status: 400,
					headers: {
						"content-type": "application/json"
					}
				}
			)
		}
	}

	const requestBody = await readStreamedRequestBody(request)

	/**
	 * Handle case where the request is made without a request body.
	 */
	if (!requestBody) {
		return {
			errorResponse: new Response(
				JSON.stringify({
					error: "Missing request body."
				}),
				{
					status: 400,
					headers: {
						"content-type": "application/json"
					}
				}
			)
		}
	}

	const parsedRequestBody = schema.safeParse(requestBody)

	/**
	 * Handle case where the request is made without a valid email field in the
	 * request body.
	 */
	if (parsedRequestBody.success === false) {
		return {
			errorResponse: new Response(
				JSON.stringify({
					error: parsedRequestBody.error
				}),
				{
					status: 400,
					headers: {
						"content-type": "application/json"
					}
				}
			)
		}
	}

	/**
	 * Handle case where the request is made but the email they claim to be is
	 * not the same as the email associated with the session token.
	 */
	if (parsedRequestBody.data.email !== session.email) {
		return {
			errorResponse: new Response(
				JSON.stringify({
					error: "Email in request body does not match email in session token."
				}),
				{
					status: 400,
					headers: {
						"content-type": "application/json"
					}
				}
			)
		}
	}

	return {
		successResponse: parsedRequestBody.data as z.infer<T> & { email: string }
	}
}
