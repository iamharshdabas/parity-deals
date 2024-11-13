import { db } from "@/drizzle/db";
import { ProductSelectSchema, productTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function deleteProduct(data: ProductSelectSchema) {
  const { rowCount } = await db
    .delete(productTable)
    .where(
      and(eq(productTable.id, data.id), eq(productTable.clerkId, data.clerkId)),
    );

  return rowCount === 1;
}
