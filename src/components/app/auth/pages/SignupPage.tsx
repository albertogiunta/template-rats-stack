import { SignupForm } from "../signup-form";

/**
 * Signup Page
 *
 * Example implementation of a signup page.
 * To use this page, add it to your React Router or routing solution.
 *
 * @example
 * // In your App.tsx with React Router
 * <Route path="/signup" element={<SignupPage />} />
 */
export function SignupPage() {
  const redirectTo = new URLSearchParams(window.location.search).get("redirect") || "/app";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/app/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </a>
          </p>
        </div>

        <div className="mt-8">
          <SignupForm redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}
