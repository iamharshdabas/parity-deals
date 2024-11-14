import { db } from "@/drizzle/db";
import { userSubscriptionTable, productTable } from "@/drizzle/schema";
import { revalidateDbCache, CACHE_TAGS } from "@/lib/cache";
import { eq } from "drizzle-orm";

export async function deleteUser(clerkId: string) {
  const [deletedSubscription, deletedProduct] = await db.batch([
    db
      .delete(userSubscriptionTable)
      .where(eq(userSubscriptionTable.clerkId, clerkId))
      .returning({ id: userSubscriptionTable.id }),
    db
      .delete(productTable)
      .where(eq(productTable.clerkId, clerkId))
      .returning({ id: productTable.id }),
  ]);

  deletedSubscription.forEach(({ id }) => {
    revalidateDbCache({
      tag: CACHE_TAGS.subscriptions,
      userId: clerkId,
      id,
    });
  });

  deletedProduct.forEach(({ id }) => {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId: clerkId,
      id,
    });
  });
}
