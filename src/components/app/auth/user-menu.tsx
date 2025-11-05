import { authClient, useSession } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

/**
 * User Menu Component
 *
 * Displays the current user's information and provides a logout button.
 * Shows loading state while checking authentication.
 *
 * @example
 * <UserMenu />
 */
export function UserMenu() {
  const { data: session, isPending } = useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user;
  const userRole = (user as any).role || "user";

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
            <span className="text-sm font-medium text-gray-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-gray-500">
            {userRole === "admin" && "Admin • "}
            {user.email}
          </span>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        Sign out
      </Button>
    </div>
  );
}
