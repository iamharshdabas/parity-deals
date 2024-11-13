import { relations } from "drizzle-orm";
import { pgTable, real, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, length, updatedAt } from "../constants";
import { countries } from "./countries";
import { countriesGroupDiscount } from "./countries-group-discount";

export const countriesGroup = pgTable("countries_group", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  name: varchar("name", { length }).unique().notNull(),
  recommendedDiscount: real("recommended_discount").notNull(),

  createdAt,
  updatedAt,
});

export const countriesGroupRelations = relations(
  countriesGroup,
  ({ many }) => ({
    countries: many(countries),
    countriesGroupDiscount: many(countriesGroupDiscount),
  }),
);

export type CountriesGroup = typeof countriesGroup.$inferSelect;
export type CountriesGroupInsert = typeof countriesGroup.$inferInsert;
