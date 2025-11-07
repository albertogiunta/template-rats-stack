import { useSession } from "@/lib/auth/client";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Protected Route Component
 *
 * Wraps content that requires authentication and/or specific roles.
 * Automatically redirects unauthenticated users to login.
 *
 * @example
 * // Require authentication
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 *
 * @example
 * // Require admin role
 * <ProtectedRoute requiredRole="admin">
 *   <AdminPanel />
 * </ProtectedRoute>
 *
 * @example
 * // Require one of multiple roles
 * <ProtectedRoute requiredRoles={["admin", "moderator"]}>
 *   <ModerationPanel />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  requiredRole,
  requiredRoles,
  fallback,
  redirectTo = "/app/login",
}: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      const currentPath = window.location.pathname;
      const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      window.location.href = loginUrl;
    }
  }, [session, isPending, redirectTo]);

  // Show loading state
  if (isPending) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
        </div>
      )
    );
  }

  // Not authenticated
  if (!session) {
    return null;
  }

  // Check role requirements
  const userRole = (session.user as any).role;

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            You don't have permission to view this page.
          </p>
          <a
            href="/app"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            You don't have permission to view this page.
          </p>
          <a
            href="/app"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
