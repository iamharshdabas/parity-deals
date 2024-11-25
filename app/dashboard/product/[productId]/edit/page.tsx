import CountryForm from "@/app/dashboard/_components/form/country";
import ProductForm from "@/app/dashboard/_components/form/product";
import BackButton from "@/components/layout/back-button";
import Section from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { title } from "@/config/class-variants";
import { editProductTabHref, siteHref } from "@/config/site";
import { CountryGroupQuerySchema } from "@/schema/country";
import { getCountryGroups } from "@/server/db/country/get";
import { getProduct } from "@/server/db/product/get";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

// TODO: searchParams. I wasn't able to find any way to set default tab in searchParams
export default async function Page({
  params,
  // searchParams,
}: {
  params: { productId: string };
  // searchParams: { tab: string };
}) {
  // WARN: fix eslint config
  const { productId } = await params;
  // const { tab } = await searchParams;

  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const product = await getProduct(productId, userId);
  if (!product) return <NotFound />;

  const countryGroups = await getCountryGroups(productId, userId);

  return (
    <BackButton backButtonHref={siteHref.dashboard()}>
      <Tabs defaultValue={editProductTabHref.details}>
        <TabsList>
          <TabsTrigger value={editProductTabHref.details}>Details</TabsTrigger>
          <TabsTrigger value={editProductTabHref.country}>Country</TabsTrigger>
        </TabsList>
        <TabsContent value={editProductTabHref.details}>
          <ProductForm
            clerkId={userId}
            cardTitle="Edit Product"
            product={product}
          />
        </TabsContent>
        <TabsContent value={editProductTabHref.country}>
          <CountryTabContent countryGroups={countryGroups} />
        </TabsContent>
      </Tabs>
    </BackButton>
  );
}

function CountryTabContent({
  countryGroups,
}: {
  countryGroups: CountryGroupQuerySchema[];
}) {
  console.log(countryGroups);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Country groups</CardTitle>
        <CardDescription>
          Leave the discount field blank if you do not want to display deals for
          any specific parity group.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CountryForm />
      </CardContent>
    </Card>
  );
}

function NotFound() {
  return (
    <Section>
      <h1 className={title()}>Product Not Found</h1>
      <Button asChild>
        <Link href={siteHref.dashboard()}>View all products</Link>
      </Button>
    </Section>
  );
}
