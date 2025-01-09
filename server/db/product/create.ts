import { db } from "@/drizzle/db";
import {
  productCustomizationTable,
  productTable,
  productViewTable,
} from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { ProductInsertSchema, ProductViewInsertSchema } from "@/schema/product";
import { eq } from "drizzle-orm";

export async function createProduct(data: ProductInsertSchema) {
  const [createdProduct] = await db
    .insert(productTable)
    .values(data)
    .returning({ id: productTable.id });

  try {
    await db
      .insert(productCustomizationTable)
      .values({ productId: createdProduct.id })
      .onConflictDoNothing({ target: productCustomizationTable.productId });
  } catch (err) {
    await db.delete(productTable).where(eq(productTable.id, createdProduct.id));
    console.error(err);
  }

  revalidateDbCache({
    tag: CACHE_TAGS.products,
    userId: data.clerkId,
    id: createdProduct.id,
  });

  return createdProduct;
}

export async function createProductView(
  clerkId: string,
  data: ProductViewInsertSchema,
) {
  const [createdProductView] = await db
    .insert(productViewTable)
    .values(data)
    .returning({ id: productViewTable.id });

  if (createdProductView) {
    revalidateDbCache({
      tag: CACHE_TAGS.productView,
      userId: clerkId,
      id: data.id,
    });
  }
}
