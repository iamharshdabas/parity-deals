import ProductDetails from "@/app/dashboard/_components/form/product-details";
import BackButton from "@/components/layout/back-button";
import Section from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { title } from "@/config/class-variants";
import { editProductTabHref, siteHref } from "@/config/site";
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

  return (
    <BackButton backButtonHref={siteHref.dashboard()}>
      <Tabs defaultValue={editProductTabHref.details}>
        <TabsList>
          <TabsTrigger value={editProductTabHref.details}>Details</TabsTrigger>
        </TabsList>
        <TabsContent value={editProductTabHref.details}>
          <ProductDetails
            clerkId={userId}
            cardTitle="Edit Product"
            product={product}
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
