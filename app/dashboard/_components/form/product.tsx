"use client";

import NoPermissionCard from "@/components/permission/no-permission-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { errorMessage } from "@/config/message";
import { siteHref } from "@/config/site";
import {
  ProductInsertSchema,
  productInsertSchema,
  ProductSelectSchema,
} from "@/schema/product";
import { createProductAction } from "@/server/action/product/create";
import { updateProductAction } from "@/server/action/product/update";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProductForm({
  clerkId,
  cardTitle,
  canCreateProduct,
  product,
}: {
  clerkId: string;
  cardTitle: string;
  canCreateProduct?: boolean;
  product?: ProductSelectSchema;
}) {
  const form = useForm<ProductInsertSchema>({
    resolver: zodResolver(productInsertSchema),
    defaultValues: product
      ? {
          ...product,
          description: product.description || "",
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
        }
      : {
          clerkId,
          name: "",
          url: "",
          description: "",
        },
  });

  async function onSubmit(data: ProductInsertSchema) {
    if (product) {
      const result = await updateProductAction(data, {
        clerkId,
        productId: product.id,
      });

      if (result?.error) {
        toast.error(result.message);
      }

      if (result.success) {
        toast.success(result.message);
      }
    } else {
      const result = await createProductAction(data);

      if (result?.error) {
        toast.error(result.message, {
          action: result.action,
        });
      }
      if (result.success) {
        toast.success(result.message);
        redirect(siteHref.productEdit(result.data.id));
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{cardTitle}</CardTitle>
            {!canCreateProduct && !product && (
              <div className="pt-8">
                <NoPermissionCard message={errorMessage.product.permission} />
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site url</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              className="w-full sm:w-min"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <LoaderCircle className="animate-spin" />
              )}
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
