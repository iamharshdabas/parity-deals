"use server";

import { errorMessage, successMessage } from "@/config/message";
import {
  countryGroupDiscountInsertSchema,
  CountryGroupDiscountInsertSchema,
} from "@/schema/country";

export async function updateCountryGroupDiscountAction(
  unsafeData: CountryGroupDiscountInsertSchema,
) {
  const { success, data } =
    countryGroupDiscountInsertSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: errorMessage.product.created };
  }

  // const product = await createProduct(data);

  return {
    success: true,
    message: successMessage.product.created,
    // data: product,
  };
}
