import { z } from 'zod'

const envSchema = z.object({
	BETTER_AUTH_SECRET: z
		.string({ message: 'BETTER_AUTH_SECRET is required' })
		.min(1, 'BETTER_AUTH_SECRET must be non-empty'),
	RESEND_API_KEY: z
		.string({ message: 'RESEND_API_KEY is required' })
		.min(1, 'RESEND_API_KEY must be non-empty'),
})

const parsed = envSchema.safeParse({
	BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
	RESEND_API_KEY: process.env.RESEND_API_KEY,
})

if (!parsed.success) {
	const formatted = parsed.error.issues
		.map((issue) => `• ${issue.path.join('.')}: ${issue.message}`)
		.join('\n')
	throw new Error(
		`Missing or invalid environment configuration for server-side variables:\n${formatted}`,
	)
}

const data = parsed.data

export const SecretEnvironmentVariables = {
	secret: data.BETTER_AUTH_SECRET,
	resendApiKey: data.RESEND_API_KEY,
}
