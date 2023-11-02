import type * as Party from "partykit/server";
import { nanoid } from "nanoid";
import type { PartyMessage, ChatMessage, UserMessage } from "./utils/message";
import type { User } from "./utils/auth";
import { notFound } from "next/navigation";
import { error, ok } from "./utils/response";
import { Message } from "ai";

const PROMPT_MESSAGE_HISTORY_LENGTH = 10;
const PROMPT = `
You are a participant in an internet chatroom. 
You're trying to fit in and impress everyone else with cool facts that you know.
You emulate the tone and writing style of the room. 
When presented with a chat history, you'll respond with a cool fact that's related to the topic being discussed. 
Keep your responses short.
`;

export const AI_USERNAME = "ai@anveio.com";
export const AI_USER: User = {
  id: "GPT-4",
  email: AI_USERNAME,
};

/**
 * A chatroom party can request an AI to join it, and the AI party responds
 * by opening a WebSocket connection and simulating a user in the chatroom
 */
export default class AIServer implements Party.Server {
  constructor(public party: Party.Party) {}

  async onRequest(req: Party.Request) {
    if (req.method !== "POST") return notFound();

    const { roomId, botId, action } = await req.json<{
      roomId: string;
      botId: string;
      action: string;
    }>();
    if (action !== "connect") return notFound();

    if (!this.party.env.OPENAI_API_KEY) return error("OPENAI_API_KEY not set");

    // open a websocket connection to the chatroom with the given id
    const chatRoom = this.party.context.parties.chatroom.get(roomId);
    const socket = await chatRoom.socket("/?_pk=" + botId);

    // simulate an user in the chatroom
    this.simulateUser(socket);

    return ok();
  }
  // act as a user in the room
  simulateUser(socket: Party.Connection["socket"]) {
    let messages: PartyMessage[] = [];
    //let identified = false;

    // listen to messages from the chatroom
    socket.addEventListener("message", (message) => {
      const data = JSON.parse(message.data as string) as ChatMessage;
      // the room sent us the whole list of messages
      if (data.type === "sync") {
        messages = data.messages;
      }
      // a client updated a message
      if (data.type === "edit") {
        messages = messages.map((m) => (m.id === data.id ? data : m));
      }
      // a client sent a nessage message
      if (data.type === "new") {
        messages.push(data);
        // don't respond to our own messages
        if (data.from.id !== AI_USERNAME && data.from.id !== "system") {
          /**
           * TODO FILL THIS ONE OUT
           */
        }
      }
    });
  }
}
