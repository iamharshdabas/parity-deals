import { db } from "@/drizzle/db";
import { productTable } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";

export async function getProducts(clerkId: string, limit?: number) {
  return await db.query.productTable.findMany({
    where: eq(productTable.clerkId, clerkId),
    orderBy: [desc(productTable.createdAt)],
    limit,
  });
}
