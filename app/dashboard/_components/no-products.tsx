import Section from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { subtitle, title } from "@/config/class-variants";
import { siteHref } from "@/config/site";
import Link from "next/link";
import React from "react";

export default function NoProducts() {
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
