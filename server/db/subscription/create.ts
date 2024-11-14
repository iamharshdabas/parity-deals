import { db } from "@/drizzle/db";
import {
  UserSubscriptionInsertSchema,
  userSubscriptionTable,
} from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";

export async function createSubscription(data: UserSubscriptionInsertSchema) {
  const [createdSubscription] = await db
    .insert(userSubscriptionTable)
    .values(data)
    .onConflictDoNothing({ target: userSubscriptionTable.clerkId })
    .returning({ id: userSubscriptionTable.id });

  if (createdSubscription) {
    revalidateDbCache({
      tag: CACHE_TAGS.subscriptions,
      userId: data.clerkId,
      id: createdSubscription.id,
    });
  }
}
