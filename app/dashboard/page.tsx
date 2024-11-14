import Section from "@/components/layout/section";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { subtitle, title } from "@/config/class-variants";
import { siteHref } from "@/config/site";
import { ProductSelectSchema } from "@/drizzle/schema";
import { getProducts } from "@/server/db/product/get";
import { auth } from "@clerk/nextjs/server";
import { EllipsisVerticalIcon } from "lucide-react";
import Link from "next/link";
import AddToSite from "./_components/add-to-site";
import DeleteProduct from "./_components/delete-product";
import BackButton from "@/components/layout/back-button";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const products = await getProducts(userId, 6);

  if (products.length === 0) return <NoProducts />;

  return (
    <BackButton
      backButtonHref={siteHref.home()}
      layoutButton={
        <Button variant="secondary" asChild>
          <Link href={siteHref.newProduct()}>Create Product</Link>
        </Button>
      }
    >
      <ProductGrid products={products} />
    </BackButton>
  );
}

function ProductGrid({ products }: { products: ProductSelectSchema[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id}>
          <DropdownMenu>
            <CardHeader className="flex-row justify-between">
              <div>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription className={subtitle()}>
                  {product.url}
                </CardDescription>
              </div>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <EllipsisVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
            </CardHeader>

            {product.description && (
              <CardContent>{product.description}</CardContent>
            )}

            <Dialog>
              <AlertDialog>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={siteHref.productEdit(product.id)}>Edit</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DialogTrigger>Add to site</DialogTrigger>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <AlertDialogTrigger>Delete</AlertDialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuContent>

                <AddToSite product={product} />
                <DeleteProduct product={product} />
              </AlertDialog>
            </Dialog>
          </DropdownMenu>
        </Card>
      ))}
    </div>
  );
}

function NoProducts() {
  return (
    <Section>
      <h1 className={title()}>You have no products</h1>
      <h2 className={subtitle()}> Get started by creating a product</h2>
      <Button asChild>
        <Link href={siteHref.newProduct()}>Add Product</Link>
      </Button>
    </Section>
  );
}
