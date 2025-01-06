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
export const productCustomizationInsertSchema = createInsertSchema(
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

// custom schema
export const productBannerMappingsSchema = z.object({
  country: z.string(),
  coupon: z.string(),
  discount: z.number(),
});

export const productCustomizationFormSchema = productCustomizationInsertSchema
  .omit({
    id: true,
    productId: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    classPrefix: z.string().optional(),
    backgroundColor: z.string().min(1, "Required"),
    textColor: z.string().min(1, "Required"),
    fontSize: z.string().min(1, "Required"),
    bannerContainer: z.string().min(1, "Required"),
    bannerMessage: z.string().min(1, "Required"),
    isSticky: z.boolean(),
  });

export const productBannerSchema = z.object({
  canRemoveBranding: z.boolean(),
  message: z.string().min(1, "Required"),
  mappings: productBannerMappingsSchema,
  customizations: productCustomizationFormSchema.omit({ bannerMessage: true }),
});

export type ProductBannerMappingsSchema = z.infer<
  typeof productBannerMappingsSchema
>;
export type ProductCustomizationFormSchema = z.infer<
  typeof productCustomizationFormSchema
>;
export type ProductBannerSchema = z.infer<typeof productBannerSchema>;
