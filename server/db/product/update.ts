import { db } from "@/drizzle/db";
import { ProductInsertSchema, productTable } from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { and, eq } from "drizzle-orm";

export async function updateProduct(
  data: Partial<ProductInsertSchema>,
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
