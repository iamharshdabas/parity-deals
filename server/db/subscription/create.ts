"use server";

import { db } from "@/drizzle/db";
import { UserSubscriptionInsert, userSubscription } from "@/drizzle/schema";

export async function createSubscription(data: UserSubscriptionInsert) {
  return await db
    .insert(userSubscription)
    .values(data)
    .onConflictDoNothing({ target: userSubscription.clerkId })
    .returning({
      id: userSubscription.id,
      clerkId: userSubscription.clerkId,
    });
}
