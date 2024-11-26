"use server";

import { errorMessage, successMessage } from "@/config/message";
import { ProductInsertSchema } from "@/schema/product";
import { updateProduct } from "@/server/db/product/update";
import { auth } from "@clerk/nextjs/server";

export async function updateProductAction(
  data: ProductInsertSchema,
  productId: string,
) {
  const { userId } = await auth();

  if (data?.clerkId !== userId) {
    return { error: true, message: errorMessage.product.updated };
  }

  const isUpdated = await updateProduct(data, { clerkId: userId, productId });

  if (isUpdated) {
    return {
      success: isUpdated,
      message: successMessage.product.updated,
    };
  }

  return { error: true, message: errorMessage.product.updated };
}
