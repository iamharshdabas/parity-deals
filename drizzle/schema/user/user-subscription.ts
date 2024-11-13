import { index, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createdAt, length, updatedAt } from "../constants";

export const tierEnum = pgEnum("tier", [
  "Free",
  "Basic",
  "Standard",
  "Premium",
]);

export const userSubscriptionTable = pgTable(
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

    tier: tierEnum("tier").default("Free").notNull(),

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

export const userSubscriptionSelectSchema = createSelectSchema(
  userSubscriptionTable,
);
export const userSubscriptionInsertSchema = createInsertSchema(
  userSubscriptionTable,
);

export type UserSubscriptionSelectSchema = z.infer<
  typeof userSubscriptionSelectSchema
>;
export type UserSubscriptionInsertSchema = z.infer<
  typeof userSubscriptionInsertSchema
>;
