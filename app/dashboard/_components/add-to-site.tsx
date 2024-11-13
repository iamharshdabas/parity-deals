"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductSelectSchema } from "@/drizzle/schema";
import useCopy from "@/hooks/copy";
import { CopyIcon } from "lucide-react";

type Props = {
  product: ProductSelectSchema;
};

export default function AddToSite({ product }: Props) {
  const { isCopied, copyToClipboard } = useCopy();
  // HACK: using process.env.NEXT_PUBLIC_SITE_URL here is a hack. @/lib/env cause error.
  const code = `<script src="${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${product.id}/banner"></script>`;

  function copyCode() {
    copyToClipboard(code);
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Start Earning PPP Sales!</DialogTitle>
        <DialogDescription>
          All you need to do is copy the below script into your site and your
          customers will start seeing PPP discounts!
        </DialogDescription>
      </DialogHeader>
      <pre className="overflow-x-scroll">
        <code>{code}</code>
      </pre>
      <Button onClick={copyCode} disabled={isCopied}>
        {!isCopied && <CopyIcon />}
        {isCopied ? "Copied" : "Copy"}
      </Button>
      <DialogClose asChild>
        <Button variant="outline">Close</Button>
      </DialogClose>
    </DialogContent>
  );
}
