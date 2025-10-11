import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"

import { authComponent, createAuth } from "./auth"
import { internal } from "./_generated/api"

const http = httpRouter()

authComponent.registerRoutes(http, createAuth)

http.route({
  path: "/dev/seed-admin",
  method: "POST",
  handler: httpAction(async (ctx) => {
    if (process.env.NODE_ENV === "production") {
      return new Response("Not Found", { status: 404 })
    }

    const result = await ctx.runAction(internal.dev.seedAdmin, {})
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }),
})

export default http
