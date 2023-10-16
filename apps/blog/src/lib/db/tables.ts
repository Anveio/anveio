export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 120 }),
  tagline: varchar("tagline", { length: 250 }),
  display_name: varchar("display_name", { length: 250 }),
  img_url: varchar("img_url", { length: 500 }),
});
