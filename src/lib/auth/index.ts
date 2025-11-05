import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

// Import environment variables
const DATABASE_PATH = process.env.DATABASE_PATH || "./db/data.db";
const AUTH_SECRET = process.env.AUTH_SECRET;
const AUTH_URL = process.env.PUBLIC_APP_URL || "http://localhost:4321";

// Initialize better-sqlite3 database
const sqlite = new Database(DATABASE_PATH);
const db = drizzle(sqlite, { schema });

/**
 * Better Auth Configuration
 *
 * This file sets up authentication with:
 * - Email/password authentication
 * - Google OAuth (when configured)
 * - Role-based access control (admin, user)
 * - SQLite database with Drizzle ORM
 *
 * To enable authentication:
 * 1. Set AUTH_SECRET in your .env file
 * 2. For Google OAuth, add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
 * 3. Run database migrations to create auth tables
 *
 * @see https://www.better-auth.com/docs
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),

  // Base configuration
  secret: AUTH_SECRET,
  baseURL: AUTH_URL,
  basePath: "/api/auth",

  // Email/password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
    sendResetPassword: async ({ user, url }) => {
      // TODO: Implement email sending
      console.log(`Password reset URL for ${user.email}: ${url}`);
    },
  },

  // Social providers configuration
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
  },

  // User configuration
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        // Role can be: "user" or "admin"
      },
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  // Advanced configuration
  advanced: {
    cookiePrefix: "rats_auth",
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
});

// Export types
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
