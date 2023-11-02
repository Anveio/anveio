import { nanoid } from "nanoid";

export type Sender = {
  id: string;
  image?: string;
};

export type PartyMessage = {
  id: string;
  from: Sender;
  text: string;
  at: number; // Date
};

// Outbound message types

export type BroadcastMessage = {
  type: "new" | "edit";
} & PartyMessage;

export type SyncMessage = {
  type: "sync";
  messages: PartyMessage[];
};

export type ClearRoomMessage = {
  type: "clear";
};

// Inbound message types

export type NewMessage = {
  type: "new";
  text: string;
  id?: string; // optional, server will set if not provided
};

export type EditMessage = {
  type: "edit";
  text: string;
  id: string;
};

export type UserMessage = NewMessage | EditMessage;
export type ChatMessage = BroadcastMessage | SyncMessage | ClearRoomMessage;

export const newMessage = (msg: Omit<PartyMessage, "id" | "at">) =>
  JSON.stringify(<BroadcastMessage>{
    type: "new",
    id: nanoid(),
    at: Date.now(),
    ...msg,
  });

export const editMessage = (msg: Omit<PartyMessage, "at">) =>
  JSON.stringify(<BroadcastMessage>{
    type: "edit",
    at: Date.now(),
    ...msg,
  });

export const syncMessage = (messages: PartyMessage[]) =>
  JSON.stringify(<SyncMessage>{ type: "sync", messages });

export const systemMessage = (text: string) =>
  newMessage({ from: { id: "system" }, text });
