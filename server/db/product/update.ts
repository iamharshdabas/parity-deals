import { db } from "@/drizzle/db";
import { productCustomizationTable, productTable } from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import {
  ProductCustomizationInsertSchema,
  ProductInsertSchema,
} from "@/schema/product";
import { and, eq } from "drizzle-orm";
import { getProduct } from "./get";

export async function updateProduct(
  data: ProductInsertSchema,
  { clerkId, productId }: { clerkId: string; productId: string },
) {
  const { rowCount } = await db
    .update(productTable)
    .set(data)
    .where(
      and(eq(productTable.clerkId, clerkId), eq(productTable.id, productId)),
    );

  if (rowCount === 1) {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId: clerkId,
      id: productId,
    });
  }

  return rowCount === 1;
}

export async function updateProductCustomization(
  data: ProductCustomizationInsertSchema,
  { clerkId, productId }: { clerkId: string; productId: string },
) {
  const product = await getProduct(productId, clerkId);
  if (!product) return false;

  const { rowCount } = await db
    .update(productCustomizationTable)
    .set(data)
    .where(eq(productCustomizationTable.productId, productId));

  if (rowCount === 1) {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId: clerkId,
      id: productId,
    });
  }

  return rowCount === 1;
}
