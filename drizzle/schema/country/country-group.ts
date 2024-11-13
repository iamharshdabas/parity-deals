import { relations } from "drizzle-orm";
import { pgTable, real, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createdAt, length, updatedAt } from "../constants";
import { countryTable } from "./country";
import { countryGroupDiscountTable } from "./country-group-discount";

export const countryGroupTable = pgTable("country_group", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  name: varchar("name", { length }).unique().notNull(),
  recommendedDiscount: real("recommended_discount").notNull(),

  createdAt,
  updatedAt,
});

export const countryGroupRelations = relations(
  countryGroupTable,
  ({ many }) => ({
    country: many(countryTable),
    countryGroupDiscount: many(countryGroupDiscountTable),
  }),
);

export const countryGroupSelectSchema = createSelectSchema(countryGroupTable);
export const countryGroupInsertSchema = createInsertSchema(countryGroupTable);

export type CountryGroupSelectSchema = z.infer<typeof countryGroupSelectSchema>;
export type CountryGroupInsertSchema = z.infer<typeof countryGroupInsertSchema>;
