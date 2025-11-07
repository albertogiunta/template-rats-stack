import type { APIRoute } from "astro";
import { auth } from "@/lib/auth";

/**
 * Better Auth API Route
 *
 * This catch-all route handles all authentication requests:
 * - POST /api/auth/sign-in/email - Email/password sign in
 * - POST /api/auth/sign-up/email - Email/password sign up
 * - GET /api/auth/sign-in/google - Google OAuth redirect
 * - GET /api/auth/callback/google - Google OAuth callback
 * - POST /api/auth/sign-out - Sign out
 * - GET /api/auth/session - Get current session
 * - more...
 *
 * @see https://www.better-auth.com/docs/concepts/api-reference
 * @see https://www.better-auth.com/docs/integrations/astro
 */
export const ALL: APIRoute = async (context) => {
  return auth.handler(context.request);
};
