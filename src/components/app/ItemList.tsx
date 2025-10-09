import type { Item } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";

export default function ItemList() {
  const { data: items, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: async (): Promise<Item[]> => {
      const res = await fetch("/api/items");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (items?.length === 0) return <div>No items found</div>;

  return (
    <ul className="space-y-2">
      {items?.map((item) => (
        <li key={item.id} className="rounded border p-4">
          {item.name}
        </li>
      ))}
    </ul>
  );
}
