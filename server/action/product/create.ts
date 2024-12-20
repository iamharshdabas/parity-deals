"use server";

import { errorMessage, successMessage } from "@/config/message";
import { ProductInsertSchema, productInsertSchema } from "@/schema/product";
import { createProduct } from "@/server/db/product/create";
import { auth } from "@clerk/nextjs/server";

export async function createProductAction(unsafeData: ProductInsertSchema) {
  const { userId } = await auth();
  const { success, data } = productInsertSchema.safeParse(unsafeData);

  if (data?.clerkId !== userId || !success) {
    return { error: true, message: errorMessage.product.created };
  }

  const product = await createProduct(data);

  return {
    success: true,
    message: successMessage.product.created,
    data: product,
  };
}
