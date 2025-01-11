import PageWrapper from "@/components/layout/page-wrapper";
import NoPermissionCard from "@/components/permission/no-permission-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { title } from "@/config/class-variants";
import { errorMessage } from "@/config/message";
import { createURL, siteHref } from "@/config/site";
import { canAccessAnalytics } from "@/server/db/permission";
import { getProducts } from "@/server/db/product/get";
import {
  getViewsByCountry,
  getViewsByCountryGroup,
  getViewsByDay,
  INTERVALS,
} from "@/server/db/productViews/get";
import { auth } from "@clerk/nextjs/server";
import { ChevronDownIcon } from "lucide-react";
import ViewsByCountryChart from "../_components/charts/viewsByCountry";
import ViewsByCountryGroupChart from "../_components/charts/viewsByCountryGroup";
import ViewsByDayChart from "../_components/charts/viewsByDay";
import Link from "next/link";
import { TimezoneDropdown } from "../_components/timezone-dropdown";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    productId?: string;
    timezone?: string;
    interval?: string;
  };
}) {
  const awaitedSearchParams = await searchParams;
  const productId = awaitedSearchParams.productId;
  const timezone = awaitedSearchParams.timezone ?? "UTC";
  const interval =
    INTERVALS[awaitedSearchParams.interval as keyof typeof INTERVALS] ??
    INTERVALS.last7Days;

  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const accessAnalytics = await canAccessAnalytics(userId);
  if (!accessAnalytics) {
    return (
      <PageWrapper>
        <NoPermissionCard message={errorMessage.analytics.permission} />;
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <h1 className={title({ size: "sm", class: "py-4" })}>Analytics</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {interval.label}
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.entries(INTERVALS).map(([key, value]) => (
            <DropdownMenuItem asChild key={key}>
              <Link
                href={createURL(siteHref.analytics(), awaitedSearchParams, {
                  interval: key,
                })}
              >
                {value.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <ProductDropdown
        userId={userId}
        selectedProductId={productId}
        searchParams={awaitedSearchParams}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {timezone}
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link
              href={createURL(siteHref.analytics(), awaitedSearchParams, {
                timezone: "UTC",
              })}
            >
              UTC
            </Link>
          </DropdownMenuItem>
          <TimezoneDropdown searchParams={awaitedSearchParams} />
        </DropdownMenuContent>
      </DropdownMenu>
      <ViewsByDay
        clerkId={userId}
        timezone={timezone}
        productId={productId}
        interval={interval}
      />
      <ViewsByCountryGroup
        clerkId={userId}
        timezone={timezone}
        productId={productId}
        interval={interval}
      />
      <ViewsByCountry
        clerkId={userId}
        timezone={timezone}
        productId={productId}
        interval={interval}
      />
    </PageWrapper>
  );
}

async function ProductDropdown({
  userId,
  selectedProductId,
  searchParams,
}: {
  userId: string;
  selectedProductId?: string;
  searchParams: Record<string, string>;
}) {
  const products = await getProducts(userId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {products.find((p) => p.id === selectedProductId)?.name ??
            "All Products"}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link
            href={createURL(siteHref.analytics(), searchParams, {
              productId: undefined,
            })}
          >
            All Products
          </Link>
        </DropdownMenuItem>
        {products.map((product) => (
          <DropdownMenuItem asChild key={product.id}>
            <Link
              href={createURL(siteHref.analytics(), searchParams, {
                productId: product.id,
              })}
            >
              {product.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function ViewsByDay(props: Parameters<typeof getViewsByDay>[0]) {
  const data = await getViewsByDay(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByDayChart chart={data} />
      </CardContent>
    </Card>
  );
}

async function ViewsByCountryGroup(
  props: Parameters<typeof getViewsByCountryGroup>[0],
) {
  const data = await getViewsByCountryGroup(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Views by day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByCountryGroupChart chart={data} />
      </CardContent>
    </Card>
  );
}

async function ViewsByCountry(props: Parameters<typeof getViewsByCountry>[0]) {
  const data = await getViewsByCountry(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Views by day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByCountryChart chart={data} />
      </CardContent>
    </Card>
  );
}
