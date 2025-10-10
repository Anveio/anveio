
## The TypeScript Bible

Well written TypeScript will make difficult work easy, and protect you, me, and users from experiencing broken software. Think in data, then in flow. Start by shaping the types so that the wrong thing cannot fit, and let the application's logic be a faithful translation and exchange of those shapes. Each module exposes a small public contract and keeps its machinery private. Some change is a contract change: a function that becomes async or gains a parameter is a system-wide ripple—plan the migration, codemod where needed, and land it in steps. We’re building an application, but our internal seams still deserve API-grade care: narrow boundaries, explicit inputs/outputs, stable names. Lean on TypeScript to carry your intent—as const for precision, satisfies for validation, discriminated unions for clarity, and type guards for safe narrowing. Choose composition over inheritance and pure functions over hidden state. When the data is right and the seams are clean, the rest becomes inevitable.

### Tenet: Start with readonly data, then selectively make it writable with a precise Mutable utility

DONT:

```ts
// Mutates config in-place; types allow accidental writes everywhere.
type Config = {
  region: string
  retries: number
}

const cfg: Config = { region: "us-west-2", retries: 3 }
cfg.region = "eu-central-1" // oops, easy to mutate anywhere
```

DO

```ts
// Prefer immutable surfaces; unwrap only when you *intentionally* need mutability.
type Mutable<T> = { -readonly [K in keyof T]: T[K] }
type DeepMutable<T> = T extends object
  ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
  : T

interface RuntimeConfig {
  readonly region: string
  readonly retries: number
  readonly tags: readonly string[]
}

const runtimeConfig: RuntimeConfig = {
  region: "us-west-2",
  retries: 3,
  tags: ["prod", "blue"],
}

// Need a local, controlled mutation (e.g., during bootstrapping)?
const mutableBoot: Mutable<RuntimeConfig> = { ...runtimeConfig }
mutableBoot.retries++ // allowed *here*, not everywhere

// Or deep-mutate a staged copy safely:
const stage: DeepMutable<RuntimeConfig> = JSON.parse(JSON.stringify(runtimeConfig))
stage.tags.push("canary") // ok here, still not leaking mutability out

```
### Tenet: Use `as const` to preserve literal intent and enable exhaustiveness

DONT:

```ts
// Loses literal types; everything becomes string | number.
const LEVELS = ["debug", "info", "warn", "error"]
type Level = typeof LEVELS[number] // string
```

DO

```ts
const LEVELS = ["debug", "info", "warn", "error"] as const
type Level = typeof LEVELS[number] // "debug" | "info" | "warn" | "error"

const DEFAULTS = {
  backoffMs: 250,
  level: "info",
} as const
```
### Tenet: Leverage `infer` to extract types and reduce duplication

DONT:

```ts
// Manually re-declare return/param types; they drift over time.
function makeClient() {
  return {
    getUser(id: string) { return { id, name: "Ada" } },
  }
}
type Client = ReturnType<typeof makeClient>
type GetUserReturn = { id: string; name: string } // duplicated, brittle
```

DO

```ts
function makeClient() {
  return {
    getUser(id: string) { return { id, name: "Ada" as const } },
  }
}
type Client = ReturnType<typeof makeClient>

type MethodReturn<T> = T extends (...args: any[]) => infer R ? R : never
type GetUserReturn = MethodReturn<Client["getUser"]> // { id: string; name: "Ada" }
```
### Tenet: Make patterned strings type-safe

DONT:

```ts
// Stringly-typed routes; easy to mismatch or forget params.
function buildUrl(path: string, params: Record<string, string | number>) {
  return path.replace(/:([A-Za-z]+)/g, (_, k) => String(params[k]))
}

buildUrl("/users/:id/posts/:postId", { id: 1 }) // runtime boom, no type help
```

DO

```ts
// Extract route params from a pattern like "/users/:id/posts/:postId"
type SegmentParams<S extends string> =
  S extends `${string}:${infer Param}/${infer Rest}`
    ? Param | SegmentParams<`/${Rest}`>
    : S extends `${string}:${infer Param}`
      ? Param
      : never

type ParamsOf<P extends string> =
  [SegmentParams<P>] extends [never] ? {} : Record<SegmentParams<P>, string | number>

function buildUrl<P extends string>(pattern: P, params: ParamsOf<P>): string {
  return pattern.replace(/:([A-Za-z]+)/g, (_, k) => encodeURIComponent(String((params as any)[k])))
}

// ✅ fully typed
const url = buildUrl("/users/:id/posts/:postId", { id: 42, postId: "abc" })

// ❌ TS error: Property 'postId' is missing
// buildUrl("/users/:id/posts/:postId", { id: 42 })
```
### Tenet: Use `satisfies` to validate shapes without widening literal types

DONT:

```ts
// Inference widens; accidental keys slip through.
const levelsToCode: Record<Level, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  // trace: 5, // would compile if Level were widened; here it wouldn't, but often unions widen
}
```

DO:

```ts
const levelToCode = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
} as const satisfies Record<Level, number>

// levelToCode has exact keys; adding/removing a key produces a compile error.

```
### Tenet: Precise type guards to refine unknown data safely

DONT:

```ts
// `any` and loose checks defeat type safety.
function isUserLoose(x: any) { return x && x.id }

// Consuming code stays unsafe.
```

DO

```ts
type User = { id: string; name: string }
function isUser(val: unknown): val is User {
  return !!val
    && typeof (val as any).id === "string"
    && typeof (val as any).name === "string"
}

function greet(x: unknown) {
  if (isUser(x)) {
    // x is User here
    return `Hello ${x.name}`
  }
  return "Hello stranger"
}
```
### Tenet: Use discriminated unions to make illegal states unrepresentable

DONT:

```ts
// Optional fields enable invalid combos at compile time.
type PaymentBad = {
  method: "card" | "bank" | "cash"
  cardNumber?: string
  routingNumber?: string
}
const p: PaymentBad = { method: "cash", cardNumber: "4111..." } // allowed 😬
```

DO

```ts
type Payment =
  | { method: "card"; cardNumber: string; cvv: string }
  | { method: "bank"; routingNumber: string; accountNumber: string }
  | { method: "cash" }

function pay(p: Payment) {
  switch (p.method) {
    case "card": return chargeCard(p.cardNumber, p.cvv)
    case "bank": return debitBank(p.routingNumber, p.accountNumber)
    case "cash": return "accept-cash"
    // Exhaustive—additions will error until handled.
  }
}

declare function chargeCard(n: string, c: string): "ok"
declare function debitBank(r: string, a: string): "ok"

// ❌ TS error: Type '{ method: "cash"; cardNumber: string; }' is not assignable to type 'Payment'.
// pay({ method: "cash", cardNumber: "4111..." })
```
### Tenet: Prefer literal unions over `enum`s (avoid runtime baggage & pitfalls)

DONT:

```ts
// Enums emit runtime objects and allow reverse mapping; tree-shaking & interop pain.
export enum StatusEnum { Idle, Loading, Success, Error }
function setStatus(s: StatusEnum) {}
setStatus(StatusEnum.Success)
```

DO

```ts
// Zero runtime cost, great interop with JSON/APIs, exhaustive checks remain.
export const Status = ["idle", "loading", "success", "error"] as const
export type Status = typeof Status[number]

function setStatus(s: Status) {}
setStatus("success")

// If you need numbers:
export type HttpCode = 200 | 201 | 400 | 404 | 500
```
### Tenet: Conditional types encode business rules in the type system

DONT:

```ts
// Generic APIs accept unsupported shapes; runtime errors later.
type Event = { type: "user" | "system"; payload: unknown }
function handle(e: Event) {/* ... */}
```

DO

```ts
type UserEvent = { type: "user"; payload: { id: string } }
type SystemEvent = { type: "system"; payload: { uptime: number } }
type AnyEvent = UserEvent | SystemEvent

type PayloadOf<E> = E extends { payload: infer P } ? P : never

function handle<E extends AnyEvent>(e: E): PayloadOf<E> {
  return e.payload // contextually typed—callers get precise return type
}

// Inference:
const u = handle({ type: "user", payload: { id: "u1" } })
//    ^? { id: string }
```
### Tenet:  Distributive conditional types operate per-member of unions

DONT:

```ts
// Overconstrain unions; lose per-member precision.
type Id = { id: string } | { id: number }
type IdTypeBad<T> = T extends { id: infer U } ? U[] : never
type Bad = IdTypeBad<Id> // string[] | number[] (accidentally okay, but often misused)
```

DO

```ts
// Use distribution intentionally; or stop it with a tuple.
type Id = { id: string } | { id: number }

type IdType<T> = T extends { id: infer U } ? U : never
type Distributive = IdType<Id> // string | number

type NonDistributive<T> = [T] extends [{ id: infer U }] ? U : never
type Stopped = NonDistributive<Id> // never (no single U fits both) — useful for guards
```
### Tenet: Let conditional types *infer* precisely for API helpers

DONT:

```ts
// One-size-fits-all `any` loses the benefit of helpers.
function pick(obj: any, keys: any[]) { /* ... */ }
```

DO

```ts
function pick<T, K extends readonly (keyof T)[]>(
  obj: T,
  keys: K
): { [P in K[number]]: T[P] } {
  const out = {} as any
  for (const k of keys) out[k] = obj[k]
  return out
}

const user = { id: "u1", name: "Ada", admin: true }
const slim = pick(user, ["id", "name"] as const)
//    ^? { id: string; name: string }
```
### Tenet: Composition over inheritance for durable systems

DONT:

```ts
// Inheritance tangle; brittle across changes.
class BaseRepo {
  save(entity: object) {/*...*/}
}
class UserRepo extends BaseRepo {
  findById(id: string) {/*...*/}
}
```

DO

```ts
// Compose small capabilities; each is mockable/testable.
type Saver<T> = { save(entity: T): Promise<void> }
type FinderById<T> = { findById(id: string): Promise<T | null> }

type Clock = { now(): Date }
type IdGen = { newId(): string }

function makeUserRepo(deps: {
  db: { exec(query: string, args?: unknown[]): Promise<unknown> }
}): Saver<User> & FinderById<User> {
  return {
    async save(u) {
      await deps.db.exec("INSERT INTO users (id, name) VALUES (?, ?)", [u.id, u.name])
    },
    async findById(id) {
      const row = await deps.db.exec("SELECT id, name FROM users WHERE id = ?", [id])
      return row as any as User | null
    },
  }
}

type User = { id: string; name: string }
```
### Tenet: Favor functional patterns & pure helpers over imperative state

DONT:

```ts
// Hidden mutation & side-effects; hard to test.
let cache: Record<string, User> = {}
async function getUserCached(id: string) {
  if (!cache[id]) cache[id] = await fetchUser(id)
  return cache[id]
}
```

DO

```ts
// Explicit dependencies; pure transformers; easy to test via stubs.
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }
const Ok = <T>(value: T): Result<T> => ({ ok: true, value })
const Err = <E>(error: E): Result<never, E> => ({ ok: false, error })

const isOk = <T, E>(r: Result<T, E>): r is { ok: true; value: T } => r.ok

type FetchUser = (id: string) => Promise<Result<User>>
type Cache = { get(k: string): User | undefined; set(k: string, v: User): void }

function makeGetUserCached(fetchUser: FetchUser, cache: Cache) {
  return async (id: string): Promise<Result<User>> => {
    const hit = cache.get(id)
    if (hit) return Ok(hit)

    const res = await fetchUser(id)
    if (isOk(res)) cache.set(id, res.value)
    return res
  }
}
// Tests can provide in-memory Cache & a stub FetchUser without network.
```
### Tenet: Use type guards on discriminated unions to drive business logic

DONT:

```ts
// Ad-hoc checks; lose narrowing benefits.
function isReadyBad(s: { status: Status }) { return s.status === "success" }
```

DO

```ts
type Ready =
  | { status: "idle" }
  | { status: "loading"; progress?: number }
  | { status: "success"; data: unknown }
  | { status: "error"; message: string }

function isSuccess(s: Ready): s is Extract<Ready, { status: "success" }> {
  return s.status === "success"
}

function render(s: Ready) {
  if (isSuccess(s)) {
    // s narrowed: has .data
    return JSON.stringify(s.data)
  }
  // other cases still precise via switch
}
```
### Tenet: Encode API matrix constraints with unions to catch impossible combos

DONT:

```ts
// Feature flags let invalid matrices compile; bugs found at runtime.
type CreateJobArgs = {
  kind: "scheduled" | "immediate"
  cron?: string
  delayMs?: number
}
```

DO

```ts
// Make illegal states unrepresentable:
type CreateJobArgs =
  | { kind: "scheduled"; cron: string }             // must have cron
  | { kind: "immediate"; delayMs?: number }         // may delay, but no cron

declare function createJob(a: CreateJobArgs): string

createJob({ kind: "scheduled", cron: "0 2 * * *" }) // ok
// ❌ Property 'cron' is missing
// createJob({ kind: "scheduled" })

// ❌ 'cron' not allowed on 'immediate'
// createJob({ kind: "immediate", cron: "*" })
```
### Tenet: When distributing, control wideness with helper wrappers

DONT:

```ts
// Overly wide "string | number | boolean" leaks everywhere.
type JsonPrimitive = string | number | boolean | null
type ToWire<T> = T extends JsonPrimitive ? T : never
```

DO

```ts
// Narrow at the edges; keep core types rich inside the app.
type Json = JsonPrimitive | Json[] | { [k: string]: Json }
type ToWire<T> =
  T extends Date ? string :
  T extends undefined ? never :
  T extends (...args: any) => any ? never :
  T extends { toJSON(): infer J } ? J :
  T extends Array<infer U> ? ToWire<U>[] :
  T extends object ? { [K in keyof T]: ToWire<T[K]> } :
  T // primitives

// Encode once; re-use in API surface types:
type UserDTO = ToWire<User>

```
### Tenet: Testability-first: pure types + thin I/O edges

DONT:

```ts
// Logic bound to frameworks—hard to unit test.
async function controller(req: any, res: any) {
  // business logic here...
  res.json({ ok: true })
}
```

DO

```ts
// Pure core:
type CreateUserInput = { name: string }
type CreateUserOutput = Result<{ id: string }>

function createUserCore(clock: Clock, idGen: IdGen) {
  return async (input: CreateUserInput): Promise<CreateUserOutput> => {
    if (!input.name.trim()) return Err(new Error("name required"))
    const id = idGen.newId()
    // write to store elsewhere...
    return Ok({ id, /* createdAt: clock.now() */ })
  }
}

// Thin adapter for whatever framework:
async function controller(req: { body: unknown }, res: { json: (x: unknown) => void }) {
  const core = createUserCore({ now: () => new Date() }, { newId: () => crypto.randomUUID() })
  const input = req.body as CreateUserInput
  const out = await core(input)
  res.json(out)
}
```