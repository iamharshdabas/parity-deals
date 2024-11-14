import { db } from "@/drizzle/db";
import {
  productCustomizationTable,
  ProductInsertSchema,
  productTable,
} from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { eq } from "drizzle-orm";

export async function createProduct(data: ProductInsertSchema) {
  const [newProduct] = await db
    .insert(productTable)
    .values(data)
    .returning({ id: productTable.id });

  try {
    await db
      .insert(productCustomizationTable)
      .values({ productId: newProduct.id })
      .onConflictDoNothing({ target: productCustomizationTable.productId });
  } catch (err) {
    await db.delete(productTable).where(eq(productTable.id, newProduct.id));
    console.error(err);
  }

  revalidateDbCache({
    tag: CACHE_TAGS.products,
    userId: data.clerkId,
    id: newProduct.id,
  });

  return newProduct;
}
