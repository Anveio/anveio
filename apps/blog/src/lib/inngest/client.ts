import { EventSchemas, Inngest } from "inngest";
import { ChatGlobalMessageSend } from "./functions";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "ingest-client-anveio-blog",
  schemas: new EventSchemas().fromRecord<ChatGlobalMessageSend>(),
});
