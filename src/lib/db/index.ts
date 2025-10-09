import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Function to get database path from either astro:env or process.env
function getDatabasePath(): string {
  // In Node scripts (like seed), use process.env
  if (typeof process !== "undefined" && process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }

  // Default fallback
  return "./db/data.db";
}

// Create drizzle instance with libsql
export const db = drizzle({
  connection: {
    url: `file:${getDatabasePath()}`,
  },
  schema,
});
