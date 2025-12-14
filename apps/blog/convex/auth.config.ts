const domain = process.env.CONVEX_SITE_URL

if (!domain) {
  throw new Error("CONVEX_SITE_URL must be defined to configure Better Auth")
}

export default {
  providers: [
    {
      domain,
      applicationID: "convex",
    },
  ],
}
