import type {
  Party,
  Server,
  Request,
  ServerOptions,
  Worker,
  Connection,
  ConnectionContext,
} from "partykit/server";
import { EventSchemas, Inngest } from "inngest";

type Events = {
  "user/new.signup": {
    data: {
      email: string;
      name: string;
    };
  };
};

const inngest = new Inngest({
  id: "nextjs-shop",
  schemas: new EventSchemas().fromRecord<Events>(),
});

// PartyKit servers now implement Server interface
export default class Main implements Server {
  // onBefore* handlers that run in the worker nearest the user are now
  // explicitly marked static, because they have no access to Party state
  static async onBeforeRequest(req: Request) {
    return req;
  }
  static async onBeforeConnect(req: Request) {
    return req;
  }
  // onFetch is now stable. No more unstable_onFetch
  static async onFetch(req: Request) {
    return new Response("Unrecognized request: " + req.url, { status: 404 });
  }

  // Opting into hibernation is now an explicit option
  readonly options: ServerOptions = {
    hibernate: true,
  };

  // Servers can now keep state in class instance variables
  messages: string[] = [];

  // Server receives the Party (previous PartyKitRoom) as a constructor argument
  // instead of receiving the `room` argument in each method.
  readonly party: Party;
  constructor(party: Party) {
    this.party = party;
  }

  // There's now a new lifecycle method `onStart` which fires before first connection
  // or request to the room. You can use this to load data from storage and perform other
  // asynchronous initialization. The Party will wait until `onStart` completes before
  // processing any connections or requests.
  async onStart() {
    this.messages = (await this.party.storage.get<string[]>("messages")) ?? [];
  }

  // onConnect, onRequest, onAlarm no longer receive the room argument.
  async onRequest(_req: Request) {
    const messageBody: { requestId: string; body: string } = await _req.json();

    this.party.broadcast(messageBody.body);

    return new Response(
      `Party ${this.party.id} has received ${this.messages.length} messages`
    );
  }
  async onConnect(connection: Connection, ctx: ConnectionContext) {}

  // Previously onMessage, onError, onClose were only called for hibernating parties.
  // They're now available for all parties, so you no longer need to manually
  // manage event handlers in onConnect!
  async onMessage(message: string, connection: Connection) {
    this.party.broadcast(message, [connection.id]);
  }
  async onError(connection: Connection, err: Error) {
    console.log("Error from " + connection.id, err.message);
  }
  async onClose(connection: Connection) {
    console.log("Closed " + connection.id);
  }
}

// Optional: Typecheck the static methods with a `satisfies` statement.
Main satisfies Worker;
