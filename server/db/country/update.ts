import { CountryGroupDiscountInsertSchema } from "@/schema/country";
import { BatchItem } from "drizzle-orm/batch";
import { getProduct } from "../product/get";
import { db } from "@/drizzle/db";
import { countryGroupDiscountTable } from "@/drizzle/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";

export async function updateCountryGroupDiscount(
  insertGroup: CountryGroupDiscountInsertSchema[],
  deleteGroup: { CountryGroupId: string }[],
  productId: string,
  clerkId: string,
) {
  const product = getProduct(productId, clerkId);
  if (!product) return false;

  const statements: BatchItem<"pg">[] = [];

  if (insertGroup.length > 0) {
    statements.push(
      db
        .insert(countryGroupDiscountTable)
        .values(insertGroup)
        .onConflictDoUpdate({
          target: [
            countryGroupDiscountTable.countryGroupId,
            countryGroupDiscountTable.productId,
          ],
          set: {
            coupon: sql.raw(
              `excluded.${countryGroupDiscountTable.coupon.name}`,
            ),
            discount: sql.raw(
              `excluded.${countryGroupDiscountTable.discount.name}`,
            ),
          },
        }),
    );
  }

  if (deleteGroup.length > 0) {
    statements.push(
      db.delete(countryGroupDiscountTable).where(
        and(
          eq(countryGroupDiscountTable.productId, productId),
          inArray(
            countryGroupDiscountTable.countryGroupId,
            deleteGroup.map((group) => group.CountryGroupId),
          ),
        ),
      ),
    );
  }

  if (statements.length > 0) {
    await db.batch(statements as [BatchItem<"pg">]);

    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId: clerkId,
      id: productId,
    });

    return true;
  }

  return false;
}
