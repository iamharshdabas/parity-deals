import { relations } from "drizzle-orm";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createdAt } from "../constants";
import { countryTable } from "../country/country";
import { productTable } from "./product";

export const productViewTable = pgTable("product_view", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  productId: uuid("product_id")
    .references(() => productTable.id, { onDelete: "cascade" })
    .notNull(),
  countryId: uuid("country_id")
    .references(() => countryTable.id, { onDelete: "cascade" })
    .notNull(),

  createdAt,
});

export const productViewRelations = relations(productViewTable, ({ one }) => ({
  product: one(productTable, {
    fields: [productViewTable.productId],
    references: [productTable.id],
  }),
  country: one(countryTable, {
    fields: [productViewTable.countryId],
    references: [countryTable.id],
  }),
}));

export const productViewSelectSchema = createSelectSchema(productViewTable);
export const productViewInsertSchema = createInsertSchema(productViewTable);

export type ProductViewSelectSchema = z.infer<typeof productViewSelectSchema>;
export type ProductViewInsertSchema = z.infer<typeof productViewInsertSchema>;