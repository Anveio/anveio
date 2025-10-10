import "server-only"

import { getToken as getTokenNextjs } from "@convex-dev/better-auth/nextjs"

import { createNextAuth } from "@/lib/auth"

export const getToken = () => getTokenNextjs(createNextAuth)
