import { db } from "@/drizzle/db";
import { userSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { UserSubscriptionInsertSchema } from "@/schema/user";
import { SQL } from "drizzle-orm";

export async function updateSubscription(
  where: SQL,
  data: Partial<UserSubscriptionInsertSchema>,
) {
  const [updatedSubscription] = await db
    .update(userSubscriptionTable)
    .set(data)
    .where(where)
    .returning({
      id: userSubscriptionTable.id,
      clerkId: userSubscriptionTable.clerkId,
    });

  if (updatedSubscription) {
    revalidateDbCache({
      tag: CACHE_TAGS.subscriptions,
      userId: updatedSubscription.clerkId,
      id: updatedSubscription.id,
    });
  }
}
