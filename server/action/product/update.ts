"use server";

import { errorMessage, successMessage } from "@/config/message";
import {
  productCustomizationInsertSchema,
  ProductCustomizationInsertSchema,
  productInsertSchema,
  ProductInsertSchema,
} from "@/schema/product";
import { canCustomizeBanner } from "@/server/db/permission";
import {
  updateProduct,
  updateProductCustomization,
} from "@/server/db/product/update";
import { auth } from "@clerk/nextjs/server";

export async function updateProductAction(
  unsafeData: ProductInsertSchema,
  { clerkId, productId }: { clerkId: string; productId: string },
) {
  const { userId } = await auth();
  const { success, data } = productInsertSchema.safeParse(unsafeData);

  if (clerkId !== userId || !success) {
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

export async function updateProductCustomizationAction(
  unsafeData: ProductCustomizationInsertSchema,
  { clerkId, productId }: { clerkId: string; productId: string },
) {
  const { userId } = await auth();
  const customizeBanner = await canCustomizeBanner(userId);
  const { success, data } =
    productCustomizationInsertSchema.safeParse(unsafeData);

  if (clerkId !== userId || !customizeBanner || !success) {
    return { error: true, message: errorMessage.productCustomization.updated };
  }

  const isUpdated = await updateProductCustomization(data, {
    clerkId,
    productId,
  });

  if (isUpdated) {
    return {
      success: isUpdated,
      message: successMessage.productCustomization.updated,
    };
  }

  return { error: true, message: errorMessage.productCustomization.updated };
}
