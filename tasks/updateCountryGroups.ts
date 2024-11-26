import { countryGroupsDiscount } from "@/config/countryGroups";
import { db } from "@/drizzle/db";
import { countryGroupTable, countryTable } from "@/drizzle/schema";
import { sql } from "drizzle-orm";

async function updateCountryDbTable() {
  const dbCountryGroup = await db.query.countryGroupTable.findMany({
    columns: { id: true, name: true },
  });

  const countryInsertData = countryGroupsDiscount.flatMap(
    ({ country, name }) => {
      const countryGroup = dbCountryGroup.find((group) => group.name === name);
      if (!countryGroup) throw new Error(`Country group ${name} not found`);

      return country.map(({ name, code }) => {
        return { name, code, countryGroupId: countryGroup.id };
      });
    },
  );

  const { rowCount } = await db
    .insert(countryTable)
    .values(countryInsertData)
    .onConflictDoUpdate({
      target: countryTable.name,
      set: {
        name: sql.raw(`excluded.${countryTable.name.name}`),
        countryGroupId: sql.raw(`excluded.${countryTable.countryGroupId.name}`),
      },
    });

  // BUG: can't revalidate cache due release candidate version of react 19
  // revalidateDbCache({ tag: CACHE_TAGS.country });
  // HACK: can use nukeCache() to clear all cache

  return rowCount;
}

async function updateCountryGroupDbTable() {
  const countryGroupInsertData = countryGroupsDiscount.map(
    ({ name, recommendedDiscount }) => {
      return { name, recommendedDiscount };
    },
  );

  const { rowCount } = await db
    .insert(countryGroupTable)
    .values(countryGroupInsertData)
    .onConflictDoUpdate({
      target: countryGroupTable.name,
      set: {
        recommendedDiscount: sql.raw(
          `excluded.${countryGroupTable.recommendedDiscount.name}`,
        ),
      },
    });

  // revalidateDbCache({ tag: CACHE_TAGS.countryGroup });

  return rowCount;
}

// NOTE: it is important to update country groups first to use countryGroup id in country table
const countryGroupCount = await updateCountryGroupDbTable();
const countryCount = await updateCountryDbTable();

console.log(
  `Updated ${countryCount} countries and ${countryGroupCount} country groups`,
);
