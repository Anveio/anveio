import {
  mysqlTable,
  serial,
  varchar,
  timestamp,
  json,
  bigint,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

export const events = mysqlTable("blog_events", {
  /**
   * autoincrement() is a helper function that adds the `AUTO_INCREMENT` keyword
   */
  id: serial("id").primaryKey().autoincrement(),
  event_type: varchar("event_type", { length: 50 }).notNull(),
  /**
   * Start of properties provided by Vercel's Edge Runtime on the request object
   */
  ipAddress: varchar("ip_address", { length: 39 }),
  city: varchar("city", { length: 30 }),
  country: varchar("country", { length: 30 }),
  flagEmoji: varchar("flag", { length: 4 }),
  region: varchar("region", { length: 30 }),
  countryRegion: varchar("country_region", { length: 30 }),
  latitude: varchar("latitude", { length: 30 }),
  longitude: varchar("longitude", { length: 30 }),
  browser_name: varchar("browser_name", { length: 50 }),
  browser_version: varchar("browser_version", { length: 30 }),
  rendering_engine_name: varchar("rendering_engine_name", { length: 30 }),
  device_type: varchar("device_type", { length: 15 }),
  device_vendor: varchar("device_vendor", { length: 50 }),
  device_model: varchar("device_model", { length: 50 }),
  /**
   * End of the properties provided by Vercel's Edge Runtime
   */
  /**
   * There could be weeks between the event happening and it hitting our analytics
   * endpoint and subsequently being written into our database, so the auto-generated
   * created_at timestamp is not sufficient for our needs. We need the client to tell
   * us when the event happened.
   */
  client_recorded_at: timestamp("client_recorded_at").notNull(),
  metadata: json("metadata"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  session_id: bigint("session_id", {
    mode: "number",
  }),
});

export const emailVerificationTokens = mysqlTable(
  "email_verification_tokens",
  {
    id: serial("id").primaryKey().autoincrement(),
    userId: bigint("user_id", {
      mode: "number",
    }).notNull(),
    email: varchar("email", { length: 319 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (emailVerificationTokens) => ({
    tokenIndex: uniqueIndex("token_idx").on(emailVerificationTokens.token),
    emailIndex: uniqueIndex("email_idx").on(emailVerificationTokens.email),
  })
);

export const sessions = mysqlTable("sessions", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", {
    mode: "number",
  }).notNull(),
  sessionLocationId: bigint("session_location_id", {
    mode: "number",
  }),
  sessionToken: varchar("session_token", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = mysqlTable(
  "users",
  {
    id: serial("id").primaryKey().autoincrement(),
    publicId: varchar("public_id", { length: 12 }).notNull(),
    email: varchar("email", { length: 319 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    /**
     * The most efficient MySQL type for a bcrypt password hash is varchar(60).
     */
    passwordHash: varchar("password_hash", {
      length: 200,
    }),
    emailVerifiedAt: timestamp("email_verified_at"),
  },
  (users) => ({
    emailIndex: uniqueIndex("email_idx").on(users.email),
    publicId: uniqueIndex("public_id_idx").on(users.publicId),
  })
);
