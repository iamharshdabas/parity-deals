import { db } from "@/drizzle/db";
import { countryGroupDiscountTable } from "@/drizzle/schema";
import { CACHE_TAGS, dbCache, getGlobalTag, getIdTag } from "@/lib/cache";
import { CountryGroupQuerySchema } from "@/schema/country";
import { eq } from "drizzle-orm";
import { getProduct } from "../product/get";

export async function getCountryGroups(productId: string, clerkId: string) {
  const cacheFn = dbCache(getNotCachedCountryGroups, {
    tags: [
      getIdTag(productId, CACHE_TAGS.products),
      getGlobalTag(CACHE_TAGS.country),
      getGlobalTag(CACHE_TAGS.countryGroup),
    ],
  });

  return cacheFn(productId, clerkId);
}

export async function getNotCachedCountryGroups(
  productId: string,
  clerkId: string,
): Promise<CountryGroupQuerySchema[]> {
  const product = getProduct(productId, clerkId);
  if (!product) return [];

  return await db.query.countryGroupTable.findMany({
    columns: {
      id: true,
      name: true,
      recommendedDiscount: true,
    },
    with: {
      country: {
        columns: {
          name: true,
          code: true,
        },
      },
      countryGroupDiscount: {
        columns: {
          discount: true,
          coupon: true,
        },
        where: eq(countryGroupDiscountTable.productId, productId),
      },
    },
  });
}
