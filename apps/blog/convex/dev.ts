import { internalAction } from './_generated/server'
import { api, internal } from './_generated/api'

import type { Id } from './_generated/dataModel'

import { v } from 'convex/values'

import { PublicEnvironmentVariables } from '../lib/public-env'

const normalizeEmail = (email: string): string => email.trim().toLowerCase()

const resolveSiteUrl = (): string =>
	PublicEnvironmentVariables.convexSiteUrl.replace(/\/+$/, '')

const ADMIN_ROLES = ['user', 'admin'] as const
type SeedAdminArgs = {
	email: string
	password: string
	name?: string
}

type SeedAdminResult = {
	status: 'ok'
	email: string
	removedExistingAccount: boolean
	userId: Id<'user'>
	signupUserId: string | null
	rolesUpdated: boolean
	sessionsUpdated: number
}

export const seedAdmin = internalAction({
	args: {
		email: v.string(),
		password: v.string(),
		name: v.optional(v.string()),
	},
	handler: async (ctx, args: SeedAdminArgs): Promise<SeedAdminResult> => {
		const adminEmail = normalizeEmail(args.email)
		const adminPassword = args.password
		const trimmedName = args.name?.trim() ?? ''
		const adminName = trimmedName.length > 0 ? trimmedName : 'Site Admin'
		const siteUrl = resolveSiteUrl()

		const { removed: removedExistingAccount } = await ctx.runMutation(
			internal.admin.resetAdminAccount,
			{ email: adminEmail },
		)

		const response = await fetch(`${siteUrl}/api/auth/sign-up/email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: adminEmail,
				password: adminPassword,
				name: adminName,
				rememberMe: true,
			}),
		})

		if (!response.ok) {
			const errorBody = await response.text()
			throw new Error(
				`Failed to seed admin via sign-up endpoint (status ${response.status}): ${errorBody}`,
			)
		}

		const signupPayload: {
			user?: { id?: string; email?: string }
			token?: string | null
		} = await response.json().catch(() => ({}))

		const { userId } = await ctx.runMutation(internal.admin.applyAdminProfile, {
			email: adminEmail,
			name: adminName,
		})

		const adminRoles = Array.from(ADMIN_ROLES)

		const { updated: rolesUpdated } = await ctx.runMutation(
			api.admin.ensureRoles,
			{
				email: adminEmail,
				roles: adminRoles,
			},
		)

		const { updated: sessionsUpdated } = await ctx.runMutation(
			internal.admin.syncSessionRoles,
			{ email: adminEmail, roles: adminRoles },
		)

		return {
			status: 'ok' as const,
			email: adminEmail,
			removedExistingAccount,
			userId,
			signupUserId: signupPayload.user?.id ?? null,
			rolesUpdated,
			sessionsUpdated,
		}
	},
})
