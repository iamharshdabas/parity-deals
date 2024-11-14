"use server";

import { errorMessage, successMessage } from "@/config/message";
import { ProductSelectSchema } from "@/drizzle/schema";
import { deleteProduct } from "@/server/db/product/delete";
import { auth } from "@clerk/nextjs/server";

export async function deleteProductAction(data: ProductSelectSchema) {
  const { userId } = await auth();

  if (data?.clerkId !== userId) {
    return { error: true, message: errorMessage.product.deleted };
  }

  const isDeleted = await deleteProduct(data);

  if (isDeleted) {
    return {
      success: isDeleted,
      message: successMessage.product.deleted,
    };
  }

  return { error: true, message: errorMessage.product.deleted };
}
