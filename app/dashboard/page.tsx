import { Button } from "@/components/ui/button";
import { siteHref } from "@/config/site";
import { ProductSelectSchema } from "@/drizzle/schema";
import { getProducts } from "@/server/db/products/get";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const products = await getProducts(userId, 6);

  return (
    <div>
      <Button variant="link" asChild>
        <Link href={siteHref.newProduct()}>Create Product</Link>
      </Button>
      <ProductGrid products={products} />
    </div>
  );
}

function ProductGrid({ products }: { products: ProductSelectSchema[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: ProductSelectSchema }) {
  return <div>{product.name}</div>;
}
