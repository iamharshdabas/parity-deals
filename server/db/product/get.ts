import { db } from "@/drizzle/db";
import { productTable } from "@/drizzle/schema";
import { CACHE_TAGS, dbCache, getIdTag, getUserTag } from "@/lib/cache";
import { and, desc, eq } from "drizzle-orm";

export async function getProducts(clerkId: string) {
  const cacheFn = dbCache(getNotCachedProducts, {
    tags: [getUserTag(clerkId, CACHE_TAGS.products)],
  });

  return cacheFn(clerkId);
}

export async function getNotCachedProducts(clerkId: string) {
  return await db.query.productTable.findMany({
    where: eq(productTable.clerkId, clerkId),
    orderBy: [desc(productTable.createdAt)],
  });
}

export async function getProduct(productId: string, clerkId: string) {
  const cacheFn = dbCache(getNotCachedProduct, {
    tags: [getIdTag(productId, CACHE_TAGS.products)],
  });

  return cacheFn(productId, clerkId);
}

export async function getNotCachedProduct(productId: string, clerkId: string) {
  return await db.query.productTable.findFirst({
    where: and(
      eq(productTable.id, productId),
      eq(productTable.clerkId, clerkId),
    ),
  });
}

export async function getProductCustomization(
  productId: string,
  clerkId: string,
) {
  const cacheFn = dbCache(getNotCachedProductCustomization, {
    tags: [getIdTag(productId, CACHE_TAGS.products)],
  });

  return cacheFn(productId, clerkId);
}

export async function getNotCachedProductCustomization(
  productId: string,
  clerkId: string,
) {
  const data = await db.query.productTable.findFirst({
    where: and(
      eq(productTable.id, productId),
      eq(productTable.clerkId, clerkId),
    ),
    with: { productCustomization: true },
  });

  return data?.productCustomization;
}
