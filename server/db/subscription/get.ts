import { subscriptionTiers } from "@/config/subscription-tier";
import { db } from "@/drizzle/db";
import { userSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TAGS, dbCache, getUserTag } from "@/lib/cache";
import { eq } from "drizzle-orm";

export async function getSubscriptionTier(clerkId: string) {
  const subscription = await getSubscription(clerkId);

  if (subscription === undefined)
    throw new Error("User had no subscription not found");

  return subscriptionTiers[subscription.tier];
}

export async function getSubscription(clerkId: string) {
  const cacheFn = dbCache(getNotCachedSubscription, {
    tags: [getUserTag(clerkId, CACHE_TAGS.subscriptions)],
  });

  return cacheFn(clerkId);
}

export async function getNotCachedSubscription(clerkId: string) {
  return await db.query.userSubscriptionTable.findFirst({
    where: eq(userSubscriptionTable.clerkId, clerkId),
  });
}
