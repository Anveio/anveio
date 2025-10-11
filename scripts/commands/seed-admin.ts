import process from 'node:process'
import { z } from 'zod'

import { parseFlags } from '../lib/args.ts'
import type { CommandDefinition } from '../lib/cli.ts'
import { bold } from '../lib/colors.ts'
import { runConvexAction } from '../lib/convex.ts'
import { headline, info, success, warn } from '../lib/logging.ts'
import { promptConfirm, promptPassword, promptText } from '../lib/prompts.ts'

const HELP_TEXT = `Options:
  --email <email>       Admin email address (required unless ADMIN_SEED_EMAIL is set)
  --password <password> Admin password (required unless ADMIN_SEED_PASSWORD is set)
  --name <name>         Optional display name for the admin account

Environment fallbacks:
  ADMIN_SEED_EMAIL
  ADMIN_SEED_PASSWORD
  ADMIN_SEED_NAME`

const payloadSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Provide a valid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	name: z
		.string()
		.max(200, 'Name is too long')
		.optional()
		.transform((value) =>
			value && value.trim().length > 0 ? value.trim() : undefined,
		),
})

const summarizePayload = (payload: z.infer<typeof payloadSchema>): void => {
	headline('Seeding admin account with:')
	info(`Email: ${bold(payload.email)}`)
	info(`Password: ${'*'.repeat(Math.max(4, payload.password.length))}`)
	info(`Name: ${payload.name ?? 'Site Admin (default)'}`)
}

const buildPayload = async (
	argv: ReadonlyArray<string>,
): Promise<z.infer<typeof payloadSchema>> => {
	const { flags } = parseFlags(argv)

	const readStringFlag = (key: string): string | undefined => {
		const value = flags[key]
		if (value === undefined) return undefined
		if (typeof value === 'boolean') {
			throw new Error(
				`Flag "--${key}" requires a value. Run with --help for usage details.`,
			)
		}
		return value
	}

	const email = readStringFlag('email') ?? process.env.ADMIN_SEED_EMAIL
	const password = readStringFlag('password') ?? process.env.ADMIN_SEED_PASSWORD
	const name = readStringFlag('name') ?? process.env.ADMIN_SEED_NAME

	if (!process.stdout.isTTY) {
		if (!email || !password) {
			throw new Error(
				'Non-interactive mode detected. Provide --email and --password flags (or set ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD).',
			)
		}
	}

	const ensureEmail = async (): Promise<string> =>
		email ??
		(await promptText({
			message: 'Admin email address',
			validate: (value) =>
				value.trim().length > 0 || 'Email is required to seed the admin user.',
		}))

	const ensurePassword = async (): Promise<string> =>
		password ??
		(await promptPassword({
			message: 'Admin password',
			validate: (value) =>
				value.trim().length >= 8 || 'Password must be at least 8 characters.',
		}))

	const ensureName = async (): Promise<string | undefined> =>
		name ??
		(await promptText({
			message: 'Display name (optional)',
			defaultValue: 'Site Admin',
		}))

	const payload = {
		email: await ensureEmail(),
		password: await ensurePassword(),
		name: await ensureName(),
	}

	return payloadSchema.parse(payload)
}

export const seedAdminCommand: CommandDefinition = {
	name: 'seed-admin',
	summary: 'Provision or reset the Better Auth admin account via Convex.',
	usage:
		'node scripts/index.ts seed-admin --email <email> --password <password> [--name <name>]',
	description:
		'Creates or resets the admin user by calling the Convex internal action. Existing sessions are re-synced to include admin privileges.',
	help: HELP_TEXT,
	run: async ({ argv }) => {
		const payload = await buildPayload(argv)

		summarizePayload(payload)

		if (process.stdout.isTTY) {
			const confirmed = await promptConfirm({
				message: 'Proceed with seeding the admin account?',
				defaultValue: true,
			})

			if (!confirmed) {
				warn('Aborted at operator request. No changes were made.')
				return
			}
		} else {
			info('Proceeding without confirmation (non-interactive environment).')
		}

		await runConvexAction({
			action: 'dev:seedAdmin',
			payload,
		})

		success('Admin account seeded successfully.')
	},
}
