import {
  countryGroupDiscountTable,
  countryGroupTable,
  countryTable,
} from "@/drizzle/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const countrySelectSchema = createSelectSchema(countryTable);
export const countryInsertSchema = createInsertSchema(countryTable);
export const countryGroupSelectSchema = createSelectSchema(countryGroupTable);
export const countryGroupInsertSchema = createInsertSchema(countryGroupTable);
export const countryGroupDiscountSelectSchema = createSelectSchema(
  countryGroupDiscountTable,
);
export const countryGroupDiscountInsertSchema = createInsertSchema(
  countryGroupDiscountTable,
);

export type CountrySelectSchema = z.infer<typeof countrySelectSchema>;
export type CountryInsertSchema = z.infer<typeof countryInsertSchema>;
export type CountryGroupSelectSchema = z.infer<typeof countryGroupSelectSchema>;
export type CountryGroupInsertSchema = z.infer<typeof countryGroupInsertSchema>;
export type CountryGroupDiscountSelectSchema = z.infer<
  typeof countryGroupDiscountSelectSchema
>;
export type CountryGroupDiscountInsertSchema = z.infer<
  typeof countryGroupDiscountInsertSchema
>;

// optimized schema
export const countryGroupQuerySchema = countryGroupSelectSchema
  .pick({ id: true, name: true, recommendedDiscount: true })
  .extend({
    country: z.array(countrySelectSchema.pick({ name: true, code: true })),
    countryGroupDiscount: z.array(
      countryGroupDiscountSelectSchema.pick({ discount: true, coupon: true }),
    ),
  });

export type CountryGroupQuerySchema = z.infer<typeof countryGroupQuerySchema>;
