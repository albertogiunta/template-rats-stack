import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import {
  anonymous,
  emailOTP,
  lastLoginMethod,
  magicLink,
  oneTap,
} from "better-auth/plugins";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./auth/schema";
import { items } from "./db/schema";
import {
  DATABASE_PATH,
  AUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "astro:env/server";
import { PUBLIC_APP_URL } from "astro:env/client";

// Import environment variables from Astro's env schema
const AUTH_URL = PUBLIC_APP_URL || "http://localhost:4321";

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
    // https://www.better-auth.com/docs/adapters/drizzle
    provider: "sqlite", // or "pg" or "mysql"
  }),

  // Base configuration
  secret: AUTH_SECRET,
  baseURL: AUTH_URL,
  basePath: "/api/auth",

  plugins: [
    // https://www.better-auth.com/docs/plugins/anonymous
    anonymous({
      emailDomainName: AUTH_URL.replace(/^https?:\/\//, ""),
      generateName: () => {
        const adjectives = [
          "Happy",
          "Lucky",
          "Clever",
          "Swift",
          "Brave",
          "Mighty",
          "Wise",
          "Noble",
        ];
        const animals = [
          "Panda",
          "Tiger",
          "Eagle",
          "Dolphin",
          "Fox",
          "Wolf",
          "Bear",
          "Falcon",
        ];
        const adjective =
          adjectives[Math.floor(Math.random() * adjectives.length)];
        const animal = animals[Math.floor(Math.random() * animals.length)];
        const number = Math.floor(Math.random() * 999) + 1;
        return `${adjective} ${animal} ${number}`;
      },
    }),
    // https://www.better-auth.com/docs/plugins/magic-link
    magicLink({
      sendMagicLink: async ({ email, url, token }, request) => {
        // TODO: Send magic link email
        // await sendEmail({
        //   to: user.email,
        //   subject: "Verify your email address",
        //   text: `Click the link to verify your email: ${url}`,
        // });
      },
    }),
    // https://www.better-auth.com/docs/plugins/email-otp
    emailOTP({
      sendVerificationOTP: async ({ email, otp }, request) => {
        // TODO: Send verification OTP
        // await sendEmail({
        //   to: user.email,
        //   subject: "Verify your email address",
        //   text: `Click the link to verify your email: ${url}`,
        // });
      },
    }),
    // https://www.better-auth.com/docs/plugins/last-login-method
    lastLoginMethod({}),
    // https://www.better-auth.com/docs/plugins/one-tap
    oneTap({
      clientId: process.env.GOOGLE_CLIENT_ID,
    }),
  ],

  // Database hooks: https://www.better-auth.com/docs/concepts/database
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          // If you want to stop the database hook from proceeding
          //  if (user.isAgreedToTerms === false) {
          //    // Your special condition.
          //    // Send the API error.
          //    throw new APIError("BAD_REQUEST", {
          //      message: "User must agree to the TOS before signing up.",
          //    });
          //  }

          // Modify the user object before it is created
          return {
            data: {
              // Ensure to return Better-Auth named fields, not the original field names in your database.
              ...user,
              firstName: user.name.split(" ")[0],
              lastName: user.name.split(" ")[1],
            },
          };
        },
        after: async (user) => {
          // Auto-create random items for new users
          try {
            const itemPrefixes = [
              "Epic",
              "Mystery",
              "Golden",
              "Ancient",
              "Rare",
              "Legendary",
              "Mystical",
              "Sacred",
            ];
            const itemTypes = [
              "Quest",
              "Box",
              "Treasure",
              "Artifact",
              "Scroll",
              "Relic",
              "Crystal",
              "Token",
            ];

            // Create 3-5 random items
            const numItems = Math.floor(Math.random() * 3) + 3; // 3-5 items
            const itemsToCreate = [];

            for (let i = 0; i < numItems; i++) {
              const prefix =
                itemPrefixes[Math.floor(Math.random() * itemPrefixes.length)];
              const type =
                itemTypes[Math.floor(Math.random() * itemTypes.length)];
              const number = Math.floor(Math.random() * 999) + 1;
              const name = `${prefix} ${type} ${number}`;

              itemsToCreate.push({
                name,
                userId: user.id,
              });
            }

            // Insert items into database
            await db.insert(items).values(itemsToCreate);

            console.log(
              `Created ${numItems} items for user ${user.id} (${user.name})`,
            );
          } catch (error) {
            console.error("Error creating initial items for user:", error);
            // Don't throw - we don't want to fail user creation if items fail
          }
        },
      },
      update: {
        before: async (data, ctx) => {
          // You can access the session from the context object.
          // if (ctx?.context.session) {
          //   console.log(
          //     "User update initiated by:",
          //     ctx?.context.session.user.id,
          //   );
          // }
          return { data };
        },
      },
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // TODO: Send verification email
      // await sendEmail({
      //   to: user.email,
      //   subject: "Verify your email address",
      //   text: `Click the link to verify your email: ${url}`,
      // });
    },
    async afterEmailVerification(user, request) {
      // Your custom logic here, e.g., grant access to premium features
      console.log(`${user.email} has been successfully verified!`);
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  // Email/password authentication
  // emailAndPassword: {
  //   enabled: false,
  //   rememberMe: true,
  //   requireEmailVerification: false, // Set to true in production
  //   sendResetPassword: async ({ user, url, token }, request) => {
  //     // TODO: Send reset password email
  //     // await sendEmail({
  //     //   to: user.email,
  //     //   subject: "Reset your password",
  //     //   text: `Click the link to reset your password: ${url}`,
  //     // });
  //   },
  // },

  // Social providers configuration
  socialProviders: {
    google: {
      // https://www.better-auth.com/docs/authentication/google
      // https://console.cloud.google.com/apis/dashboard
      enabled: !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET),
      clientId: GOOGLE_CLIENT_ID || "",
      clientSecret: GOOGLE_CLIENT_SECRET || "",
      scope: ["email", "profile"],
      prompt: "select_account",
      mapProfileToUser: (profile) => {
        return {
          firstName: profile.given_name,
          lastName: profile.family_name,
        };
      },
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
      isAnonymous: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache duration in seconds
      },
    },
  },

  // Advanced configuration
  advanced: {
    cookiePrefix: "rats_auth",
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },

  //
  hooks: {
    // When you call createAuthMiddleware a ctx object is passed that provides a lot of useful properties
    // https://www.better-auth.com/docs/concepts/hooks#ctx
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        const newSession = ctx.context.newSession;
        if (newSession) {
          // Example: Send a notification to your channel when a new user is registered
          // sendMessage({
          //   type: "user-register",
          //   name: newSession.user.name,
          // });
        }
      }
    }),
  },
});

// Export types
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
