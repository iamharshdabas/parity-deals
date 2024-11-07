import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../constants";
import { products } from "./products";

export const productsCustomizations = pgTable("products_customizations", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .unique()
    .notNull(),

  classPrefix: text("class_prefix"),
  backgroundColor: text("background_color").default("#111111").notNull(),
  textColor: text("text_color").default("#ffffff").notNull(),
  fontSize: text("font_size").default("1rem").notNull(),
  bannerContainer: text("banner_container").default("body").notNull(),
  bannerPosition: text("banner_position").default("sticky").notNull(),
  bannerMessage: text("banner_message")
    .default(
      "Hey! It looks like you are form <b>{country}</b>. We support Parity Pruchasing Power, so if you need it, use code <b>{coupon}<b> to get <b>{discount}</b> off your purchase!",
    )
    .notNull(),

  createdAt,
  updatedAt,
});

export const productsCustomizationsRelations = relations(
  productsCustomizations,
  ({ one }) => ({
    products: one(products, {
      fields: [productsCustomizations.productId],
      references: [products.id],
    }),
  }),
);

export type ProductsCustomizations = typeof productsCustomizations.$inferSelect;
export type ProductsCustomizationsInsert =
  typeof productsCustomizations.$inferInsert;
