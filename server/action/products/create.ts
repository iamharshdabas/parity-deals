"use server";

import { siteHref } from "@/config/site";
import { productInsertSchema, ProductInsertSchema } from "@/drizzle/schema";
import { createProduct } from "@/server/db/products/create";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createProductAction(
  unsafeData: ProductInsertSchema,
): Promise<{ error?: boolean; message?: string } | null> {
  const { userId } = await auth();
  const { success, data } = productInsertSchema.safeParse(unsafeData);

  if (data?.clerkId !== userId || !success) {
    return { error: true, message: "There was an error creating the product" };
  }

  const { id } = await createProduct(data);

  redirect(siteHref.productEdit(id));
}
