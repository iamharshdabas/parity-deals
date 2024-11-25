import BackButton from "@/components/layout/back-button";
import { siteHref } from "@/config/site";
import { auth } from "@clerk/nextjs/server";
import ProductForm from "../../_components/form/product";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return (
    <BackButton backButtonHref={siteHref.dashboard()}>
      <ProductForm clerkId={userId} cardTitle="Create new product" />
    </BackButton>
  );
}
