import { db } from "@/drizzle/db";
import { productTable, productViewTable } from "@/drizzle/schema";
import { CACHE_TAGS, dbCache, getIdTag, getUserTag } from "@/lib/cache";
import { and, count, desc, eq, gte } from "drizzle-orm";

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

export async function getProductsCount(clerkId: string) {
  const cacheFn = dbCache(getNotCachedProductsCount, {
    tags: [getUserTag(clerkId, CACHE_TAGS.products)],
  });

  return cacheFn(clerkId);
}

export async function getNotCachedProductsCount(clerkId: string) {
  const data = await db
    .select({ count: count() })
    .from(productTable)
    .where(eq(productTable.clerkId, clerkId));

  return data[0].count ?? 0;
}

export async function getProductsViewCount(clerkId: string, date: Date) {
  const cacheFn = dbCache(getNotCachedProductsViewCount, {
    tags: [getUserTag(clerkId, CACHE_TAGS.productView)],
  });

  return cacheFn(clerkId, date);
}

export async function getNotCachedProductsViewCount(
  clerkId: string,
  date: Date,
) {
  const data = await db
    .select({ count: count() })
    .from(productViewTable)
    .innerJoin(productTable, eq(productTable.id, productViewTable.productId))
    .where(
      and(
        eq(productTable.clerkId, clerkId),
        gte(productViewTable.createdAt, date),
      ),
    );

  return data[0].count ?? 0;
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
