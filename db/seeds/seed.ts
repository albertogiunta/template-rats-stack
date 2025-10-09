import { db } from "@/lib/db";
import { items } from "@/lib/db/schema";

async function seed() {
  console.log("🌱 Seeding...");

  await db.delete(items);

  await db
    .insert(items)
    .values([
      { name: "First item" },
      { name: "Second item" },
      { name: "Third item" },
    ]);

  console.log("✅ Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
