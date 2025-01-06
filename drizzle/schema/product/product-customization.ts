import { relations } from "drizzle-orm";
import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../constants";
import { productTable } from "./product";

export const productCustomizationTable = pgTable("product_customization", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  productId: uuid("product_id")
    .references(() => productTable.id, { onDelete: "cascade" })
    .unique()
    .notNull(),

  classPrefix: text("class_prefix"),
  backgroundColor: text("background_color").default("#000000").notNull(),
  textColor: text("text_color").default("#ffffff").notNull(),
  fontSize: text("font_size").default("1rem").notNull(),

  bannerContainer: text("banner_container").default("body").notNull(),
  bannerMessage: text("banner_message")
    .default(
      "Hey! It looks like you are form <b>{country}</b>. We support Parity Pruchasing Power, so if you need it, use code <b>{coupon}</b> to get <b>{discount}</b> off your purchase!",
    )
    .notNull(),
  isSticky: boolean("is_sticky").default(true).notNull(),

  createdAt,
  updatedAt,
});

export const productCustomizationRelations = relations(
  productCustomizationTable,
  ({ one }) => ({
    product: one(productTable, {
      fields: [productCustomizationTable.productId],
      references: [productTable.id],
    }),
  }),
);
