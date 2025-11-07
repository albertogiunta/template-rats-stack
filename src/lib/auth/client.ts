import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";

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
 * // Sign in anonymously
 * await authClient.signIn.anonymous();
 *
 * // Sign in with email
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
  // Example: "http://localhost:3000" in dev, "https://yourdomain.com" in production
  // If you're using a different base path other than /api/auth, make sure to pass the whole URL, including the path. (e.g., http://localhost:3000/custom-path/auth)
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  basePath: "/api/auth",
  plugins: [anonymousClient()],
});

// Export hooks for convenience
export const {
  useSession,
  $Infer,
} = authClient;

// Type exports
export type Session = typeof $Infer.Session.session;
export type User = typeof $Infer.Session.user;
