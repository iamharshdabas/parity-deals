import { timestamp } from "drizzle-orm/pg-core";

export const length = 256;

export const createdAt = timestamp("created_at", { withTimezone: true })
  .defaultNow()
  .notNull();

export const updatedAt = timestamp("updated_at", { withTimezone: true })
  .defaultNow()
  .$onUpdateFn(() => new Date())
  .notNull();
