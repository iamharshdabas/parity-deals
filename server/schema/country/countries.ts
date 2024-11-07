import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, length, updatedAt } from "../constants";
import { productsViews } from "../product/products-views";
import { countriesGroup } from "./countries-group";

export const countries = pgTable("countries", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  countryGroupId: uuid("country_group_id")
    .references(() => countriesGroup.id, { onDelete: "cascade" })
    .notNull(),

  name: varchar("name", { length }).unique().notNull(),
  code: varchar("code", { length }).unique().notNull(),

  createdAt,
  updatedAt,
});

export const countriesRelations = relations(countries, ({ one, many }) => ({
  countriesGroup: one(countriesGroup, {
    fields: [countries.countryGroupId],
    references: [countriesGroup.id],
  }),
  productsViews: many(productsViews),
}));

export type Countries = typeof countries.$inferSelect;
export type CountriesInsert = typeof countries.$inferInsert;
