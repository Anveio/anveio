import { Message } from "ai";
import { inngest } from "./client";

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

export type ChatGlobalMessageSend = {
  "chat/global.message-send": {
    data: {
      messages: Message[];
      requestId: string;
    };
  };
};
