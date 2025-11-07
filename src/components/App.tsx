import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "@/lib/auth/client";
import { AuthModal } from "./app/auth";
import { UserMenu } from "./app/auth";
import ItemList from "./app/ItemList";

// Create query client once
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { data: session, isPending } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Show loading state while checking authentication
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Show auth modal if not authenticated or manually opened */}
      <AuthModal
        open={!session || isAuthModalOpen}
        onOpenChange={(open) => setIsAuthModalOpen(open)}
      />

      <div className="bg-background min-h-screen">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Welcome to the RATS Stack</h1>
            {session && <UserMenu onUpgradeClick={() => setIsAuthModalOpen(true)} />}
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {session ? (
            <ItemList />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Please sign in to access the app.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
