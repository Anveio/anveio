// db.ts
import {
    datetime,
    int,
    mysqlEnum,
    mysqlTable,
    serial,
    uniqueIndex,
    varchar,
  } from 'drizzle-orm/mysql-core';
  
  // declaring enum in database
  export const users = mysqlTable('useras', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 256 }),
    email: varchar('email', { length: 256 }).notNull(),
    password_hash: varchar('password_hash', { length: 256 }),
    created_at: datetime('created_at'),
    updated_at: datetime('updated_at'),
    public_id: varchar('public_id', { length: 12 }),
  }, (el) => ({
    emailIndex: uniqueIndex('email').on(el.email),
    
  }));
  
  export const messages = mysqlTable('messages', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
    countryId: int('country_id').references(() => countries.id),
    popularity: mysqlEnum('popularity', ['unknown', 'known', 'popular']),
  });