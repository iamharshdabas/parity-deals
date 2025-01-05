import { relations } from "drizzle-orm";
import { pgTable, primaryKey, real, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, length, updatedAt } from "../constants";
import { productTable } from "../product/product";
import { countryGroupTable } from "./country-group";

export const countryGroupDiscountTable = pgTable(
  "country_group_discount",
  {
    countryGroupId: uuid("country_group_id")
      .references(() => countryGroupTable.id)
      .notNull(),
    productId: uuid("product_id")
      .references(() => productTable.id)
      .notNull(),

    coupon: varchar("coupon", { length }),
    discount: real("discount"),

    createdAt,
    updatedAt,
  },
  (table) => ({
    pk: primaryKey({ columns: [table.countryGroupId, table.productId] }),
  }),
);

export const countryGroupDiscountRelations = relations(
  countryGroupDiscountTable,
  ({ one }) => ({
    countryGroup: one(countryGroupTable, {
      fields: [countryGroupDiscountTable.countryGroupId],
      references: [countryGroupTable.id],
    }),
    product: one(productTable, {
      fields: [countryGroupDiscountTable.productId],
      references: [productTable.id],
    }),
  }),
);
