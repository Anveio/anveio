import type { BetterAuthOptions } from "better-auth"
import { betterAuth } from "better-auth"
import {
  createClient,
  type GenericCtx,
} from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"

import { buildAuthOptions } from "../lib/auth-config"
import { components } from "./_generated/api"
import type { DataModel } from "./_generated/dataModel"

export const authComponent = createClient<DataModel>(components.betterAuth)

type PluginList = NonNullable<BetterAuthOptions["plugins"]>

interface CreateAuthOptions {
  readonly optionsOnly?: boolean
  readonly plugins?: PluginList
}

export function createAuth(
  ctx: GenericCtx<DataModel>,
  { optionsOnly = false, plugins = [] }: CreateAuthOptions = {},
) {
  const combinedPlugins: PluginList = [...plugins, convex()]

  const options = buildAuthOptions({
    database: authComponent.adapter(ctx),
    optionsOnly,
    plugins: combinedPlugins,
  })

  return betterAuth(options)
}

export type { CreateAuthOptions }
