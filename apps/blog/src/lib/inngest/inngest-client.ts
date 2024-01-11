import { EventSchemas, Inngest } from "inngest";
import { InngestFunctionTypes } from "./types";

// Create a client to send and receive events
export const AnveioInngestClient = new Inngest({
    id: "ingest-client-anveio-blog",
    schemas: new EventSchemas().fromRecord<InngestFunctionTypes>(),
});

export * from 'inngest'
