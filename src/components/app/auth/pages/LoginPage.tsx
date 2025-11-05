import { LoginForm } from "../login-form";

/**
 * Login Page
 *
 * Example implementation of a login page.
 * To use this page, add it to your React Router or routing solution.
 *
 * @example
 * // In your App.tsx with React Router
 * <Route path="/login" element={<LoginPage />} />
 */
export function LoginPage() {
  // Get redirect path from URL query params
  const redirectTo = new URLSearchParams(window.location.search).get("redirect") || "/app";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <a
              href="/app/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </a>
          </p>
        </div>

        <div className="mt-8">
          <LoginForm redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}
