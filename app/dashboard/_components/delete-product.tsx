"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductSelectSchema } from "@/schema/product";
import { deleteProductAction } from "@/server/action/product/delete";
import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  product: ProductSelectSchema;
};

export default function DeleteProduct({ product }: Props) {
  const [isDeletePending, startDeleteTransition] = useTransition();

  function deleteProduct() {
    startDeleteTransition(async () => {
      const isDeleted = await deleteProductAction(product);

      if (isDeleted.error) {
        toast.error(isDeleted.message);
      }
      if (isDeleted.success) {
        toast.success(isDeleted.message);
      }
    });
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete this
          product.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={deleteProduct} disabled={isDeletePending}>
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
