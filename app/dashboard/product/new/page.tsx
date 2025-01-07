import PageWrapper from "@/components/layout/page-wrapper";
import { canCreateProduct } from "@/server/db/permission";
import { auth } from "@clerk/nextjs/server";
import ProductForm from "../../_components/form/product";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const createProduct = await canCreateProduct(userId);

  return (
    <PageWrapper>
      <ProductForm
        clerkId={userId}
        cardTitle="Create new product"
        canCreateProduct={createProduct}
      />
    </PageWrapper>
  );
}
