import { authClient, useSession } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

interface UserMenuProps {
  onUpgradeClick?: () => void;
}

/**
 * User Menu Component
 *
 * Displays the current user's information and provides a logout button.
 * For anonymous users, shows an option to sign in and save their progress.
 * Shows loading state while checking authentication.
 *
 * @example
 * <UserMenu onUpgradeClick={() => setShowAuthModal(true)} />
 */
export function UserMenu({ onUpgradeClick }: UserMenuProps) {
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
  const isAnonymous = (user as any).isAnonymous || false;

  // For anonymous users, show upgrade prompt
  if (isAnonymous) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
            <span className="text-sm font-medium text-amber-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-amber-600">Guest</span>
          </div>
        </div>
        <Button variant="default" size="sm" onClick={onUpgradeClick}>
          Sign In to Save
        </Button>
      </div>
    );
  }

  // For authenticated users, show normal menu
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
