import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, length, updatedAt } from "../constants";
import { productViewTable } from "../product/product-view";
import { countryGroupTable } from "./country-group";

export const countryTable = pgTable("country", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  countryGroupId: uuid("country_group_id")
    .references(() => countryGroupTable.id, { onDelete: "cascade" })
    .notNull(),

  name: varchar("name", { length }).unique().notNull(),
  code: varchar("code", { length }).unique().notNull(),

  createdAt,
  updatedAt,
});

export const countryRelations = relations(countryTable, ({ one, many }) => ({
  countryGroup: one(countryGroupTable, {
    fields: [countryTable.countryGroupId],
    references: [countryGroupTable.id],
  }),
  productView: many(productViewTable),
}));
