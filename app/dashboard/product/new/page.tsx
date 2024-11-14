import BackButton from "@/components/layout/back-button";
import { siteHref } from "@/config/site";
import { auth } from "@clerk/nextjs/server";
import ProductDetails from "../../_components/form/product-details";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return (
    <BackButton backButtonHref={siteHref.dashboard()}>
      <ProductDetails clerkId={userId} cardTitle="Create new product" />
    </BackButton>
  );
}
