import type { Item } from "@/lib/db/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Random name generator (same as in auth.ts)
const generateRandomItemName = () => {
  const itemPrefixes = [
    "Epic",
    "Mystery",
    "Golden",
    "Ancient",
    "Rare",
    "Legendary",
    "Mystical",
    "Sacred",
  ];
  const itemTypes = [
    "Quest",
    "Box",
    "Treasure",
    "Artifact",
    "Scroll",
    "Relic",
    "Crystal",
    "Token",
  ];

  const prefix = itemPrefixes[Math.floor(Math.random() * itemPrefixes.length)];
  const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  return `${prefix} ${type} ${number}`;
};

export default function ItemList() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: items, isLoading: isLoadingItems, error: queryError } = useQuery({
    queryKey: ["items"],
    queryFn: async (): Promise<Item[]> => {
      const res = await fetch("/api/items");

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("You must be signed in to view items");
        }
        throw new Error("Failed to fetch items");
      }

      return res.json();
    },
  });

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("Failed to add item");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setError(null);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to add item");
    },
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch("/api/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete item");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setError(null);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to delete item");
    },
  });

  const handleAddRandomItem = () => {
    const randomName = generateRandomItemName();
    addItemMutation.mutate(randomName);
  };

  const handleDeleteRandomItem = () => {
    if (!items || items.length === 0) {
      setError("No items to delete");
      return;
    }

    // Pick a random item
    const randomItem = items[Math.floor(Math.random() * items.length)];
    deleteItemMutation.mutate(randomItem.id);
  };

  if (isLoadingItems) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto" />
          <p className="text-gray-600">Loading your items...</p>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="text-red-800">
          {queryError instanceof Error ? queryError.message : "Failed to load items"}
        </p>
      </div>
    );
  }

  const isLoading = addItemMutation.isPending || deleteItemMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Items ({items?.length || 0})</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleAddRandomItem}
            disabled={isLoading}
            variant="default"
            size="sm"
          >
            {addItemMutation.isPending ? "Adding..." : "Add Random Item"}
          </Button>
          <Button
            onClick={handleDeleteRandomItem}
            disabled={isLoading || !items || items.length === 0}
            variant="destructive"
            size="sm"
          >
            {deleteItemMutation.isPending ? "Deleting..." : "Delete Random Item"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {items?.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-6 text-center">
          <p className="text-gray-600">
            No items yet. Click "Add Random Item" to create one!
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items?.map((item) => (
            <li
              key={item.id}
              className="rounded border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="font-medium">{item.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
