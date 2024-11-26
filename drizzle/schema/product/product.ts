import { relations } from "drizzle-orm";
import { index, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, length, updatedAt } from "../constants";
import { countryGroupDiscountTable } from "../country/country-group-discount";
import { productCustomizationTable } from "./product-customization";
import { productViewTable } from "./product-view";

export const productTable = pgTable(
  "product",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    clerkId: varchar("clerk_id", { length }).notNull(),

    name: varchar("name", { length }).notNull(),
    url: text("url").notNull(),
    description: text("description"),

    createdAt,
    updatedAt,
  },
  (table) => {
    return {
      productClerkIdIndex: index("product_clerk_id_index").on(table.clerkId),
    };
  },
);

export const productRelations = relations(productTable, ({ one, many }) => ({
  productCustomization: one(productCustomizationTable),
  productView: many(productViewTable),
  countryGroupDiscount: many(countryGroupDiscountTable),
}));
