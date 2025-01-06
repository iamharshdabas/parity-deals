import CustomizationForm from "@/app/dashboard/_components/form/customization";
import CountryForm from "@/app/dashboard/_components/form/country";
import ProductForm from "@/app/dashboard/_components/form/product";
import BackButton from "@/components/layout/back-button";
import Section from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { title } from "@/config/class-variants";
import { editProductTabHref, siteHref } from "@/config/site";
import { getCountryGroups } from "@/server/db/country/get";
import { canCustomizeBanner, canRemoveBranding } from "@/server/db/permission";
import { getProduct, getProductCustomization } from "@/server/db/product/get";
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
  const productCustomization = await getProductCustomization(productId, userId);
  if (!countryGroups || !productCustomization) return <NotFound />;

  const customizeBanner = await canCustomizeBanner(userId);
  const removeBranding = await canRemoveBranding(userId);

  return (
    <BackButton backButtonHref={siteHref.dashboard()}>
      <Tabs defaultValue={editProductTabHref.details}>
        <TabsList>
          <TabsTrigger value={editProductTabHref.details}>Details</TabsTrigger>
          <TabsTrigger value={editProductTabHref.country}>Country</TabsTrigger>
          <TabsTrigger value={editProductTabHref.customizations}>
            Customizations
          </TabsTrigger>
        </TabsList>
        <TabsContent value={editProductTabHref.details}>
          <ProductForm
            clerkId={userId}
            cardTitle="Edit Product"
            product={product}
          />
        </TabsContent>
        <TabsContent value={editProductTabHref.country}>
          <CountryForm productId={productId} countryGroups={countryGroups} />
        </TabsContent>
        <TabsContent value={editProductTabHref.customizations}>
          <CustomizationForm
            productId={productId}
            userId={userId}
            canRemoveBranding={removeBranding}
            canCustomizeBanner={customizeBanner}
            productCustomization={productCustomization}
          />
        </TabsContent>
      </Tabs>
    </BackButton>
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
