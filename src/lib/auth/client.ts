import { createAuthClient } from "better-auth/react";

/**
 * Better Auth Client Configuration
 *
 * This client is used on the frontend (React components) to interact
 * with the authentication API.
 *
 * Usage in React components:
 *
 * import { authClient } from "@/lib/auth/client";
 *
 * // Sign in
 * await authClient.signIn.email({
 *   email: "user@example.com",
 *   password: "password123"
 * });
 *
 * // Sign up
 * await authClient.signUp.email({
 *   email: "user@example.com",
 *   password: "password123",
 *   name: "John Doe"
 * });
 *
 * // Sign out
 * await authClient.signOut();
 *
 * // Get current session
 * const session = authClient.useSession();
 *
 * @see https://www.better-auth.com/docs/client
 */
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  basePath: "/api/auth",
});

// Export hooks for convenience
export const {
  useSession,
  $Infer,
} = authClient;

// Type exports
export type Session = typeof $Infer.Session.session;
export type User = typeof $Infer.Session.user;
