import { db } from "@/drizzle/db";
import { productTable } from "@/drizzle/schema";
import { CACHE_TAGS, dbCache, getUserTag } from "@/lib/cache";
import { desc, eq } from "drizzle-orm";

export async function getProducts(clerkId: string, limit?: number) {
  const cacheFn = dbCache(getNotCachedProducts, {
    tags: [getUserTag(clerkId, CACHE_TAGS.products)],
  });

  return cacheFn(clerkId, limit);
}

export async function getNotCachedProducts(clerkId: string, limit?: number) {
  return await db.query.productTable.findMany({
    where: eq(productTable.clerkId, clerkId),
    orderBy: [desc(productTable.createdAt)],
    limit,
  });
}
