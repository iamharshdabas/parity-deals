import { db } from "@/server/db";
import { products, userSubscription } from "@/server/schema";
import { eq } from "drizzle-orm";

export async function deleteUser(clerkId: string) {
  return await db.batch([
    db.delete(userSubscription).where(eq(userSubscription.clerkId, clerkId)),
    db.delete(products).where(eq(products.clerkId, clerkId)),
  ]);
}
