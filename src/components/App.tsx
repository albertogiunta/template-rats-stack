import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-background min-h-screen">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Welcome to the RATS Stack</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <ItemList />
        </main>
      </div>
    </QueryClientProvider>
  );
}
