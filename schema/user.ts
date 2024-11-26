import { userSubscriptionTable } from "@/drizzle/schema";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
