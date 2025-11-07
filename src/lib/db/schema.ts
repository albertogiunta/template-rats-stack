import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Authentication tables (better-auth)
// Import and re-export auth schema for database migrations
export * from "../auth/schema";
import { user } from "../auth/schema";

// Items table - user-owned data
export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// Types
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
