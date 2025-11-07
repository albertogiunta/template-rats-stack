import { ProtectedRoute } from "../protected-route";
import { UserMenu } from "../user-menu";

/**
 * Admin Page (Admin Only)
 *
 * Example of a page that requires admin role.
 *
 * @example
 * // In your App.tsx with React Router
 * <Route path="/admin" element={<AdminPage />} />
 */
export function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <UserMenu />
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">
              Admin Dashboard
            </h2>
            <p className="mt-2 text-gray-600">
              This page is only accessible to users with the "admin" role.
            </p>

            <div className="mt-6 space-y-6">
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">User Management</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Manage user accounts, roles, and permissions.
                </p>
                <button className="mt-3 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                  View Users
                </button>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">System Settings</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Configure system-wide settings and preferences.
                </p>
                <button className="mt-3 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                  Configure
                </button>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="mt-2 text-sm text-gray-600">
                  View application analytics and usage statistics.
                </p>
                <button className="mt-3 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
