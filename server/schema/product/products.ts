import { relations } from "drizzle-orm";
import { index, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, length, updatedAt } from "../constants";
import { productsCustomizations } from "./products-customizations";
import { productsViews } from "./products-views";
import { countriesGroupDiscount } from "../country/countries-group-discount";

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    clerkId: varchar("clerk_id", { length }).unique().notNull(),

    name: varchar("name", { length }).notNull(),
    url: text("url").notNull(),
    description: text("description"),

    createdAt,
    updatedAt,
  },
  (table) => {
    return {
      productsClerkIdIndex: index("products_clerk_id_index").on(table.clerkId),
    };
  },
);

export const productsRelations = relations(products, ({ one, many }) => ({
  productsCustomizations: one(productsCustomizations),
  productsViews: many(productsViews),
  countriesGroupDiscount: many(countriesGroupDiscount),
}));

export type Products = typeof products.$inferSelect;
export type ProductsInsert = typeof products.$inferInsert;
