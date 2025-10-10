import type { GenericCtx } from "@convex-dev/better-auth"
import { ConvexHttpClient } from "convex/browser"
import type { FunctionReference } from "convex/server"

import type { DataModel } from "@/convex/_generated/dataModel"
import { authEnv } from "@/lib/env"

type AnyFunctionReference = FunctionReference<
  "query" | "mutation" | "action",
  "public" | "internal",
  unknown,
  unknown
>

function createHttpClient(): ConvexHttpClient {
  const client = new ConvexHttpClient(authEnv.convexUrl)
  client.setAdminAuth(authEnv.convexAuthSecret)
  client.setFetchOptions({ cache: "no-store" })
  return client
}

function invokeQuery<Reference extends AnyFunctionReference>(
  client: ConvexHttpClient,
  reference: Reference,
  args: Reference["_args"],
) {
  return client.query(reference, args) as Promise<Reference["_returnType"]>
}

function invokeMutation<Reference extends AnyFunctionReference>(
  client: ConvexHttpClient,
  reference: Reference,
  args: Reference["_args"],
) {
  return client.mutation(reference, args) as Promise<Reference["_returnType"]>
}

function invokeAction<Reference extends AnyFunctionReference>(
  client: ConvexHttpClient,
  reference: Reference,
  args: Reference["_args"],
) {
  return client.action(reference, args) as Promise<Reference["_returnType"]>
}

export function createConvexAuthContext(): GenericCtx<DataModel> {
  const client = createHttpClient()

  return {
    async runQuery(reference, args) {
      return invokeQuery(client, reference, args)
    },
    async runMutation(reference, args) {
      return invokeMutation(client, reference, args)
    },
    async runAction(reference, args) {
      return invokeAction(client, reference, args)
    },
    auth: {
      async getUserIdentity() {
        return null
      },
    },
  } satisfies GenericCtx<DataModel>
}
