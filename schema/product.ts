import {
  productCustomizationTable,
  productTable,
  productViewTable,
} from "@/drizzle/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const productSelectSchema = createSelectSchema(productTable);
export const productInsertSchema = createInsertSchema(productTable, {
  name: (schema) => schema.name.trim().min(1, { message: "Required" }),
  url: (schema) => schema.url.trim().url(),
});
export const productViewSelectSchema = createSelectSchema(productViewTable);
export const productViewInsertSchema = createInsertSchema(productViewTable);
export const productCustomizationSelectSchema = createSelectSchema(
  productCustomizationTable,
);
export const productCustomizationInsertSchema = createSelectSchema(
  productCustomizationTable,
);

export type ProductSelectSchema = z.infer<typeof productSelectSchema>;
export type ProductInsertSchema = z.infer<typeof productInsertSchema>;
export type ProductViewSelectSchema = z.infer<typeof productViewSelectSchema>;
export type ProductViewInsertSchema = z.infer<typeof productViewInsertSchema>;
export type ProductCustomizationSelectSchema = z.infer<
  typeof productCustomizationSelectSchema
>;
export type ProductCustomizationInsertSchema = z.infer<
  typeof productCustomizationInsertSchema
>;
