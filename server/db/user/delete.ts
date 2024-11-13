import { db } from "@/drizzle/db";
import { userSubscriptionTable, productTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function deleteUser(clerkId: string) {
  return await db.batch([
    db
      .delete(userSubscriptionTable)
      .where(eq(userSubscriptionTable.clerkId, clerkId)),
    db.delete(productTable).where(eq(productTable.clerkId, clerkId)),
  ]);
}
