"use server";

import { db } from "@/drizzle/db";
import {
  UserSubscriptionInsertSchema,
  userSubscriptionTable,
} from "@/drizzle/schema";

export async function createSubscription(data: UserSubscriptionInsertSchema) {
  return await db
    .insert(userSubscriptionTable)
    .values(data)
    .onConflictDoNothing({ target: userSubscriptionTable.clerkId })
    .returning({
      id: userSubscriptionTable.id,
      clerkId: userSubscriptionTable.clerkId,
    });
}
