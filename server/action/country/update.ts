"use server";

import { errorMessage, successMessage } from "@/config/message";
import {
  countryGroupDiscountInsertSchema,
  CountryGroupDiscountInsertSchema,
} from "@/schema/country";
import { updateCountryGroupDiscount } from "@/server/db/country/update";
import { auth } from "@clerk/nextjs/server";

export async function updateCountryGroupDiscountAction(
  unsafeData: CountryGroupDiscountInsertSchema[],
  productId: string,
) {
  const { userId } = await auth();
  const { success, data } = countryGroupDiscountInsertSchema
    .array()
    .safeParse(unsafeData);

  if (!userId || !success) {
    return { error: true, message: errorMessage.countryGroupDiscount.updated };
  }

  const insertGroup: CountryGroupDiscountInsertSchema[] = [];
  const deleteGroup: { CountryGroupId: string }[] = [];

  data.forEach((group) => {
    if (
      group.coupon != null &&
      group.coupon.length > 0 &&
      group.discount != null &&
      group.discount > 0
    ) {
      insertGroup.push(group);
    } else {
      deleteGroup.push({ CountryGroupId: group.countryGroupId });
    }
  });

  const isUpdated = await updateCountryGroupDiscount(
    insertGroup,
    deleteGroup,
    productId,
    userId,
  );

  if (isUpdated) {
    return {
      success: true,
      message: successMessage.countryGroupDiscount.updated,
    };
  }

  return { error: true, message: errorMessage.countryGroupDiscount.updated };
}
