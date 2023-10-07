import { uploadThingFileRouter } from "@/lib/uploadthing-integ";
import { createNextRouteHandler } from "uploadthing/next";

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: uploadThingFileRouter,
});
