import { index, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../constants";
import { subscriptionTires, tireName } from "@/config/subscription-tire";

export const tierEnum = pgEnum(
  "tier",
  Object.keys(subscriptionTires) as [tireName],
);

export const userSubscription = pgTable(
  "user_subscription",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    clerkId: varchar("clerk_id", { length }).notNull(),

    stripeCustomerId: varchar("stripe_customer_id", { length }).notNull(),
    stripeSubscriptionId: varchar("stripe_subscription_id", {
      length,
    }).notNull(),
    stripeSubscriptionItemId: varchar("stripe_subscription_item_id", {
      length,
    }).notNull(),

    tier: tierEnum("tire").notNull(),

    updatedAt,
    createdAt,
  },
  (table) => {
    return {
      clerkIdIndex: index("clerk_id_index").on(table.clerkId),
      stripeCustomerIdIndex: index("stripe_customer_id_index").on(
        table.stripeCustomerId,
      ),
    };
  },
);
