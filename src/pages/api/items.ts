import type { APIRoute } from "astro";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { items } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export const GET: APIRoute = async (context) => {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: context.request.headers,
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch items owned by the current user
    const userItems = await db
      .select()
      .from(items)
      .where(eq(items.userId, session.user.id));

    return Response.json(userItems);
  } catch (error) {
    console.error("Error fetching items:", error);
    return Response.json({ error: "Failed to fetch items" }, { status: 500 });
  }
};

export const POST: APIRoute = async (context) => {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: context.request.headers,
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await context.request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    // Create item for the current user
    const newItem = await db
      .insert(items)
      .values({
        name,
        userId: session.user.id,
      })
      .returning();

    return Response.json(newItem[0], { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return Response.json({ error: "Failed to create item" }, { status: 500 });
  }
};

export const DELETE: APIRoute = async (context) => {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: context.request.headers,
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await context.request.json();
    const { id } = body;

    if (!id || typeof id !== "number") {
      return Response.json({ error: "Item ID is required" }, { status: 400 });
    }

    // Delete item only if it belongs to the current user
    const deletedItems = await db
      .delete(items)
      .where(and(eq(items.id, id), eq(items.userId, session.user.id)))
      .returning();

    if (deletedItems.length === 0) {
      return Response.json(
        { error: "Item not found or unauthorized" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, item: deletedItems[0] });
  } catch (error) {
    console.error("Error deleting item:", error);
    return Response.json({ error: "Failed to delete item" }, { status: 500 });
  }
};
