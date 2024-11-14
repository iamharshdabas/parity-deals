import { db } from "@/drizzle/db";
import { ProductSelectSchema, productTable } from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { and, eq } from "drizzle-orm";

export async function deleteProduct(data: ProductSelectSchema) {
  const { rowCount } = await db
    .delete(productTable)
    .where(
      and(eq(productTable.id, data.id), eq(productTable.clerkId, data.clerkId)),
    );

  if (rowCount === 1) {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId: data.clerkId,
      id: data.id,
    });
  }

  return rowCount === 1;
}
