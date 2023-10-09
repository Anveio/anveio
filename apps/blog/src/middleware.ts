import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  debug: false,
  publicRoutes: [
    "/",
    "/x/inngest",
    "/sign-in",
    "/api/liveblocks-auth",
    "/api/inngest",
    "/sign-up",
    "/login",
    "/articles/(.*)",
    "/api/chat/send-message",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
