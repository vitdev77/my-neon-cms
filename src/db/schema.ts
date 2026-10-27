import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

// Создаем таблицу постов (posts)
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  content: text("content").notNull(),
  status: varchar("status", { length: 50 }).default("draft").notNull(), // draft или published
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
