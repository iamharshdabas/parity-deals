import { relations } from "drizzle-orm";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { createdAt } from "../constants";
import { countries } from "../country/countries";
import { products } from "./products";

export const productsViews = pgTable("products_views", {
  id: uuid().defaultRandom().primaryKey().notNull(),

  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  countryId: uuid("country_id")
    .references(() => countries.id, { onDelete: "cascade" })
    .notNull(),

  createdAt,
});

export const productsViewsRelations = relations(productsViews, ({ one }) => ({
  products: one(products, {
    fields: [productsViews.productId],
    references: [products.id],
  }),
  countries: one(countries, {
    fields: [productsViews.countryId],
    references: [countries.id],
  }),
}));

export type ProductsViews = typeof productsViews.$inferSelect;
export type ProductsViewsInsert = typeof productsViews.$inferInsert;
