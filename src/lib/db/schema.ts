import { unique } from "drizzle-orm/gel-core";
import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: text("name").notNull(),
  url: text("url").unique().notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  lastFetchedAt: timestamp("last_fetched_at"),
});

export const feed_follows = pgTable(
  "feed_follows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    feeds_id: uuid("feeds_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userFeedUnique: unique().on(table.user_id, table.feeds_id),
  }),
);

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  title: text("title").notNull(),
  url: text("url").unique().notNull(),
  description: text("description"),
  published_at: timestamp("published_at"),
  feedId: uuid("feed_id")
    .references(() => feeds.id, { onDelete: "cascade" })
    .notNull(),
});
