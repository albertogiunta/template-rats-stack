import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Single table, minimal fields - just for testing
export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// Types
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
