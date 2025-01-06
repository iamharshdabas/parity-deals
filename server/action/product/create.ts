"use server";

import UpgradeAccount from "@/components/permission/upgrade-account";
import { errorMessage, successMessage } from "@/config/message";
import { ProductInsertSchema, productInsertSchema } from "@/schema/product";
import { canCreateProduct } from "@/server/db/permission";
import { createProduct } from "@/server/db/product/create";
import { auth } from "@clerk/nextjs/server";

export async function createProductAction(unsafeData: ProductInsertSchema) {
  const { userId } = await auth();
  const { success, data } = productInsertSchema.safeParse(unsafeData);

  if (data?.clerkId !== userId || !success) {
    return { error: true, message: errorMessage.product.created };
  }

  if ((await canCreateProduct(userId)) === false) {
    return {
      error: true,
      message: errorMessage.product.permission.title,
      action: UpgradeAccount(),
    };
  }

  const product = await createProduct(data);

  return {
    success: true,
    message: successMessage.product.created,
    data: product,
  };
}
