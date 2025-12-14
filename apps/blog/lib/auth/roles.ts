import { z } from 'zod'

export const ROLES = ['user', 'admin'] as const
export type Role = (typeof ROLES)[number]

export const ADMIN_ROLE = 'admin' satisfies Role
export const DEFAULT_ROLES = ['user'] as const satisfies readonly Role[]

export const roleSchema = z.enum(ROLES)
export const rolesSchema = z
  .array(roleSchema)
  .nonempty()
  .superRefine((roles, ctx) => {
    const unique = new Set(roles)
    if (unique.size !== roles.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Roles must be unique',
      })
    }
  })

export type Roles = z.infer<typeof rolesSchema>

const extractRoles = (
  subject: { readonly roles?: ReadonlyArray<Role> } | ReadonlyArray<Role> | undefined,
): ReadonlyArray<Role> => {
  if (!subject) return []
  if (Array.isArray(subject)) return subject
  if (typeof subject === 'object' && subject !== null && 'roles' in subject) {
    const candidate = (subject as { readonly roles?: ReadonlyArray<Role> }).roles
    if (Array.isArray(candidate)) {
      return candidate
    }
  }
  return []
}

export const hasRole = (
  subject: { readonly roles?: ReadonlyArray<Role> } | ReadonlyArray<Role> | undefined,
  role: Role,
): boolean => extractRoles(subject).includes(role)

export const isAdmin = (
  subject: { readonly roles?: ReadonlyArray<Role> } | ReadonlyArray<Role> | undefined,
): boolean => hasRole(subject, ADMIN_ROLE)

export const assertHasRole = (
  subject: { readonly roles?: ReadonlyArray<Role> } | ReadonlyArray<Role> | undefined,
  role: Role,
  message = `Role ${role} required`,
): asserts subject => {
  if (!hasRole(subject, role)) {
    throw new Error(message)
  }
}

export const assertAdmin = (
  subject: { readonly roles?: ReadonlyArray<Role> } | ReadonlyArray<Role> | undefined,
  message = 'Admin role required',
): asserts subject => assertHasRole(subject, ADMIN_ROLE, message)
