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

// custom schema
export const countryGroupQuerySchema = countryGroupSelectSchema
  .pick({ id: true, name: true, recommendedDiscount: true })
  .extend({
    country: z.array(countrySelectSchema.pick({ name: true, code: true })),
    countryGroupDiscount: z
      .array(
        countryGroupDiscountSelectSchema.pick({ discount: true, coupon: true }),
      )
      .optional(),
  });
export const countryGroupFormSchema = z.object({
  groups: z.array(
    z
      .object({
        id: z.string().min(1, "Required"),
        coupon: z.string().optional(),
        discount: z
          .number()
          .min(0)
          .max(100)
          .or(z.nan())
          .transform((n) => (isNaN(n) ? undefined : n))
          .optional(),
      })
      .refine(
        ({ coupon, discount }) => {
          const hasCoupon = coupon != undefined && coupon.length > 0;
          const hasDiscount = discount != undefined && discount > 0;
          // TODO: what if user add discount and not coupon? how to handle this case?
          return !(hasCoupon && !hasDiscount);
        },
        {
          message: "A discount is required if a coupon code is provided",
          path: ["root"],
        },
      ),
  ),
});

export type CountryGroupQuerySchema = z.infer<typeof countryGroupQuerySchema>;
export type CountryGroupFormSchema = z.infer<typeof countryGroupFormSchema>;
