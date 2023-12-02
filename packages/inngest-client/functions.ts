import { inngest } from "./inngest-client";

export const sendChatMessageGlobalChat = inngest.createFunction(
  { id: "chat-global-message-send" },
  { event: "chat/global.message-send" },
  async ({ event, step }) => {
    await step.run("wait-a-moment", () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    });
    return { event, body: "Hello, World!" };
  }
);

export const uploadImageToVercelBlobStorage = inngest.createFunction(
  { id: "upload-image-to-vercel-blob-storage" },
  { event: "upload/image-to-vercel-blob-storage" },
  async ({ event, step }) => {
    await step.run("wait-a-moment", () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    });
    return { event, body: "Hello, World!" };
  }
);
