import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { items } from "@/lib/db/schema";

export const GET: APIRoute = async () => {
  try {
    // With libsql, don't use .all() - just await the query
    const allItems = await db.select().from(items);

    console.log("Fetched items:", allItems); // Debug log

    return Response.json(allItems);
  } catch (error) {
    console.error("Error fetching items:", error);
    return Response.json({ error: "Failed to fetch items" }, { status: 500 });
  }
};
