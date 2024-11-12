import { index, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, length, updatedAt } from "../constants";

export const tierEnum = pgEnum("tier", [
  "Free",
  "Basic",
  "Standard",
  "Premium",
]);

export const userSubscription = pgTable(
  "user_subscription",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    clerkId: varchar("clerk_id", { length }).unique().notNull(),

    stripeCustomerId: varchar("stripe_customer_id", { length }),
    stripeSubscriptionId: varchar("stripe_subscription_id", {
      length,
    }),
    stripeSubscriptionItemId: varchar("stripe_subscription_item_id", {
      length,
    }),

    tier: tierEnum("tier").notNull(),

    updatedAt,
    createdAt,
  },
  (table) => {
    return {
      userSubscriptionClerkIdIndex: index(
        "user_subscription_clerk_id_index",
      ).on(table.clerkId),
      userSubscriptionStripeCustomerIdIndex: index(
        "user_subscription_stripe_customer_id_index",
      ).on(table.stripeCustomerId),
    };
  },
);

export type UserSubscription = typeof userSubscription.$inferSelect;
export type UserSubscriptionInsert = typeof userSubscription.$inferInsert;
