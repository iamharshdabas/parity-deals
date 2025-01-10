import { db } from "@/drizzle/db";
import {
  countryGroupTable,
  countryTable,
  productTable,
  productViewTable,
} from "@/drizzle/schema";
import {
  CACHE_TAGS,
  dbCache,
  getGlobalTag,
  getIdTag,
  getUserTag,
} from "@/lib/cache";
import { tz } from "@date-fns/tz";
import { startOfDay, subDays } from "date-fns";
import { and, count, desc, eq, gte, SQL, sql } from "drizzle-orm";

export async function getProductsViewCount(clerkId: string, date: Date) {
  const cacheFn = dbCache(getNotCachedProductsViewCount, {
    tags: [getUserTag(clerkId, CACHE_TAGS.productView)],
  });

  return cacheFn(clerkId, date);
}

export async function getNotCachedProductsViewCount(
  clerkId: string,
  date: Date,
) {
  const data = await db
    .select({ count: count() })
    .from(productViewTable)
    .innerJoin(productTable, eq(productTable.id, productViewTable.productId))
    .where(
      and(
        eq(productTable.clerkId, clerkId),
        gte(productViewTable.createdAt, date),
      ),
    );

  return data[0].count ?? 0;
}

export async function getViewsByCountry({
  clerkId,
  timezone,
  productId,
  interval,
}: {
  clerkId: string;
  timezone: string;
  productId?: string;
  interval: (typeof INTERVALS)[keyof typeof INTERVALS];
}) {
  const cacheFn = dbCache(getNotCachedViewsByCountry, {
    tags: [
      getUserTag(clerkId, CACHE_TAGS.productView),
      productId == null
        ? getUserTag(clerkId, CACHE_TAGS.products)
        : getIdTag(productId, CACHE_TAGS.products),
      getGlobalTag(CACHE_TAGS.country),
    ],
  });

  return cacheFn({ clerkId, timezone, productId, interval });
}

export async function getNotCachedViewsByCountry({
  clerkId,
  timezone,
  productId,
  interval,
}: {
  clerkId: string;
  timezone: string;
  productId?: string;
  interval: (typeof INTERVALS)[keyof typeof INTERVALS];
}) {
  const startDate = startOfDay(interval.startDate, { in: tz(timezone) });
  const productsSubQuery = getProductSubQuery(clerkId, productId);
  return await db
    .with(productsSubQuery)
    .select({
      views: count(productViewTable.createdAt),
      countryName: countryTable.name,
      countryCode: countryTable.code,
    })
    .from(productViewTable)
    .innerJoin(
      productsSubQuery,
      eq(productsSubQuery.id, productViewTable.productId),
    )
    .innerJoin(countryTable, eq(countryTable.id, productViewTable.countryId))
    .where(
      gte(
        sql`${productViewTable.createdAt} AT TIME ZONE ${timezone}`.inlineParams(),
        startDate,
      ),
    )
    .groupBy(countryTable.name, countryTable.code)
    .orderBy(({ views }) => desc(views));
  // .limit(25);
}

export async function getViewsByCountryGroup({
  clerkId,
  timezone,
  productId,
  interval,
}: {
  clerkId: string;
  timezone: string;
  productId?: string;
  interval: (typeof INTERVALS)[keyof typeof INTERVALS];
}) {
  const cacheFn = dbCache(getNotCachedViewsByCountryGroup, {
    tags: [
      getUserTag(clerkId, CACHE_TAGS.productView),
      productId == null
        ? getUserTag(clerkId, CACHE_TAGS.products)
        : getIdTag(productId, CACHE_TAGS.products),
      getGlobalTag(CACHE_TAGS.country),
      getGlobalTag(CACHE_TAGS.countryGroup),
    ],
  });

  return cacheFn({ clerkId, timezone, productId, interval });
}

export async function getNotCachedViewsByCountryGroup({
  clerkId,
  timezone,
  productId,
  interval,
}: {
  clerkId: string;
  timezone: string;
  productId?: string;
  interval: (typeof INTERVALS)[keyof typeof INTERVALS];
}) {
  const startDate = startOfDay(interval.startDate, { in: tz(timezone) });
  const productsSubQuery = getProductSubQuery(clerkId, productId);
  const productsViewsSubQuery = db.$with("productsViews").as(
    db
      .with(productsSubQuery)
      .select({
        visitedAt: sql`${productViewTable.createdAt} AT TIME ZONE ${timezone}`
          .inlineParams()
          .as("visitedAt"),
        countryGroupId: countryTable.countryGroupId,
      })
      .from(productViewTable)
      .innerJoin(
        productsSubQuery,
        eq(productsSubQuery.id, productViewTable.productId),
      )
      .innerJoin(countryTable, eq(countryTable.id, productViewTable.countryId))
      .where(({ visitedAt }) => gte(visitedAt, startDate)),
  );

  return await db
    .with(productsViewsSubQuery)
    .select({
      countryGroup: countryGroupTable.name,
      views: count(productsViewsSubQuery.visitedAt),
    })
    .from(countryGroupTable)
    .leftJoin(
      productsViewsSubQuery,
      eq(productsViewsSubQuery.countryGroupId, countryGroupTable.id),
    )
    .groupBy(countryGroupTable.name)
    .orderBy(countryGroupTable.name);
}

export async function getViewsByDay({
  clerkId,
  timezone,
  productId,
  interval,
}: {
  clerkId: string;
  timezone: string;
  productId?: string;
  interval: (typeof INTERVALS)[keyof typeof INTERVALS];
}) {
  const cacheFn = dbCache(getNotCachedViewsByDay, {
    tags: [
      getUserTag(clerkId, CACHE_TAGS.productView),
      productId == null
        ? getUserTag(clerkId, CACHE_TAGS.products)
        : getIdTag(productId, CACHE_TAGS.products),
    ],
  });

  return cacheFn({ clerkId, timezone, productId, interval });
}

// I dont know how date part works.
// Yes we are doing it, because it works.
async function getNotCachedViewsByDay({
  clerkId,
  timezone,
  productId,
  interval,
}: {
  clerkId: string;
  timezone: string;
  productId?: string;
  interval: (typeof INTERVALS)[keyof typeof INTERVALS];
}) {
  const productsSubQuery = getProductSubQuery(clerkId, productId);
  const productsViewsSubQuery = db.$with("productsViews").as(
    db
      .with(productsSubQuery)
      .select({
        visitedAt: sql`${productViewTable.createdAt} AT TIME ZONE ${timezone}`
          .inlineParams()
          .as("visitedAt"),
        productId: productsSubQuery.id,
      })
      .from(productViewTable)
      .innerJoin(
        productsSubQuery,
        eq(productsSubQuery.id, productViewTable.productId),
      ),
  );

  return await db
    .with(productsViewsSubQuery)
    .select({
      date: interval
        .dateGrouper(sql.raw("series"))
        .mapWith((dateString) => interval.dateFormatter(new Date(dateString))),
      views: count(productsViewsSubQuery.visitedAt),
    })
    .from(interval.sql)
    .leftJoin(productsViewsSubQuery, ({ date }) =>
      eq(interval.dateGrouper(productsViewsSubQuery.visitedAt), date),
    )
    .groupBy(({ date }) => [date])
    .orderBy(({ date }) => date);
}

function getProductSubQuery(userId: string, productId: string | undefined) {
  return db.$with("products").as(
    db
      .select()
      .from(productTable)
      .where(
        and(
          eq(productTable.clerkId, userId),
          productId ? eq(productTable.id, productId) : undefined,
        ),
      ),
  );
}

export const INTERVALS = {
  last7Days: {
    dateFormatter: (date: Date) => dateFormatter.format(date),
    startDate: subDays(new Date(), 7),
    label: "Last 7 Days",
    sql: sql`GENERATE_SERIES(current_date - 7, current_date, '1 day'::interval) as series`,
    dateGrouper: (col: SQL | SQL.Aliased) =>
      sql<string>`DATE(${col})`.inlineParams(),
  },
  last30Days: {
    dateFormatter: (date: Date) => dateFormatter.format(date),
    startDate: subDays(new Date(), 30),
    label: "Last 30 Days",
    sql: sql`GENERATE_SERIES(current_date - 30, current_date, '1 day'::interval) as series`,
    dateGrouper: (col: SQL | SQL.Aliased) =>
      sql<string>`DATE(${col})`.inlineParams(),
  },
  last365Days: {
    dateFormatter: (date: Date) => monthFormatter.format(date),
    startDate: subDays(new Date(), 365),
    label: "Last 365 Days",
    sql: sql`GENERATE_SERIES(DATE_TRUNC('month', current_date - 365), DATE_TRUNC('month', current_date), '1 month'::interval) as series`,
    dateGrouper: (col: SQL | SQL.Aliased) =>
      sql<string>`DATE_TRUNC('month', ${col})`.inlineParams(),
  },
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeZone: "UTC",
});

const monthFormatter = new Intl.DateTimeFormat(undefined, {
  year: "2-digit",
  month: "short",
  timeZone: "UTC",
});
