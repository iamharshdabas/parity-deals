import { relations } from "drizzle-orm";
import { pgTable, primaryKey, real, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, length, updatedAt } from "../constants";
import { products } from "../product/products";
import { countriesGroup } from "./countries-group";

export const countriesGroupDiscount = pgTable(
  "countries_group_discount",
  {
    countryGroupId: uuid("country_group_id")
      .references(() => countriesGroup.id)
      .notNull(),
    productId: uuid("product_id")
      .references(() => products.id)
      .notNull(),

    coupon: varchar("coupon", { length }).notNull(),
    discount: real("discount").notNull(),

    createdAt,
    updatedAt,
  },
  (table) => ({
    pk: primaryKey({ columns: [table.countryGroupId, table.productId] }),
  }),
);

export const countriesGroupDiscountRelations = relations(
  countriesGroupDiscount,
  ({ one }) => ({
    countriesGroup: one(countriesGroup, {
      fields: [countriesGroupDiscount.countryGroupId],
      references: [countriesGroup.id],
    }),
    products: one(products, {
      fields: [countriesGroupDiscount.productId],
      references: [products.id],
    }),
  }),
);

export type CountriesGroupDiscount = typeof countriesGroupDiscount.$inferSelect;
export type CountriesGroupDiscountInsert =
  typeof countriesGroupDiscount.$inferInsert;
