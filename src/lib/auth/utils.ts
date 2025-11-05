import type { APIContext } from "astro";
import { auth } from "./index";

/**
 * Authentication Utilities
 *
 * This file provides utilities for protecting pages and handling redirects
 * in both Astro pages and API routes.
 */

/**
 * Get the current session from an Astro request
 *
 * @param context - Astro API context
 * @returns Session object or null if not authenticated
 */
export async function getSession(context: APIContext) {
  try {
    const session = await auth.api.getSession({
      headers: context.request.headers,
    });
    return session;
  } catch (error) {
    return null;
  }
}

/**
 * Require authentication for a page
 *
 * If the user is not authenticated, they will be redirected to the login page.
 *
 * @param context - Astro API context
 * @param redirectTo - Path to redirect to after login (defaults to current path)
 * @returns Session object or throws redirect
 *
 * @example
 * // In an Astro page
 * const session = await requireAuth(Astro);
 * const user = session.user;
 */
export async function requireAuth(
  context: APIContext,
  redirectTo?: string,
) {
  const session = await getSession(context);

  if (!session) {
    const currentPath = redirectTo || context.url.pathname;
    const loginUrl = `/app/login?redirect=${encodeURIComponent(currentPath)}`;
    return context.redirect(loginUrl);
  }

  return session;
}

/**
 * Require a specific role for a page
 *
 * If the user doesn't have the required role, they will be redirected.
 *
 * @param context - Astro API context
 * @param role - Required role (e.g., "admin")
 * @param redirectTo - Path to redirect to if unauthorized (defaults to home)
 * @returns Session object or throws redirect
 *
 * @example
 * // In an Astro page
 * const session = await requireRole(Astro, "admin");
 * // User is guaranteed to be an admin here
 */
export async function requireRole(
  context: APIContext,
  role: string,
  redirectTo: string = "/app",
) {
  const session = await requireAuth(context);

  if (typeof session === "object" && "user" in session) {
    const userRole = (session.user as any).role;
    if (userRole !== role) {
      return context.redirect(redirectTo);
    }
    return session;
  }

  // If requireAuth returned a redirect, pass it through
  return session;
}

/**
 * Require one of several roles for a page
 *
 * @param context - Astro API context
 * @param roles - Array of acceptable roles
 * @param redirectTo - Path to redirect to if unauthorized
 * @returns Session object or throws redirect
 */
export async function requireAnyRole(
  context: APIContext,
  roles: string[],
  redirectTo: string = "/app",
) {
  const session = await requireAuth(context);

  if (typeof session === "object" && "user" in session) {
    const userRole = (session.user as any).role;
    if (!roles.includes(userRole)) {
      return context.redirect(redirectTo);
    }
    return session;
  }

  return session;
}

/**
 * Redirect to home if already authenticated
 *
 * Useful for login/signup pages.
 *
 * @param context - Astro API context
 * @param redirectTo - Path to redirect to if authenticated (defaults to /app)
 *
 * @example
 * // In a login page
 * await redirectIfAuthenticated(Astro);
 * // If user is already logged in, they'll be redirected to /app
 */
export async function redirectIfAuthenticated(
  context: APIContext,
  redirectTo: string = "/app",
) {
  const session = await getSession(context);

  if (session) {
    return context.redirect(redirectTo);
  }
}

/**
 * Check if a user has a specific role
 *
 * @param session - Session object
 * @param role - Role to check
 * @returns True if user has the role
 */
export function hasRole(session: any, role: string): boolean {
  return session?.user?.role === role;
}

/**
 * Check if a user has any of the specified roles
 *
 * @param session - Session object
 * @param roles - Array of roles to check
 * @returns True if user has any of the roles
 */
export function hasAnyRole(session: any, roles: string[]): boolean {
  return roles.includes(session?.user?.role);
}
