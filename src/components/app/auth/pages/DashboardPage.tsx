import { ProtectedRoute } from "../protected-route";
import { UserMenu } from "../user-menu";
import { useSession } from "@/lib/auth/client";

/**
 * Dashboard Page (Protected)
 *
 * Example of a protected page that requires authentication.
 *
 * @example
 * // In your App.tsx with React Router
 * <Route path="/dashboard" element={<DashboardPage />} />
 */
export function DashboardPage() {
  const { data: session } = useSession();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <UserMenu />
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome, {session?.user?.name}!
            </h2>
            <p className="mt-2 text-gray-600">
              This is a protected page. Only authenticated users can see this content.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">Profile</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Email: {session?.user?.email}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Role: {(session?.user as any)?.role || "user"}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">Account Status</h3>
                <p className="mt-2 text-sm text-gray-600">Active</p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                <div className="mt-2 space-y-2">
                  <a
                    href="/app"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    Go to Home
                  </a>
                  {(session?.user as any)?.role === "admin" && (
                    <a
                      href="/app/admin"
                      className="block text-sm text-blue-600 hover:underline"
                    >
                      Admin Panel
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
