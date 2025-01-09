import Banner from "@/components/layout/banner";
import { ProductBannerResponseSchema } from "@/schema/product";
import { canRemoveBranding, canShowBanner } from "@/server/db/permission";
import { createProductView } from "@/server/db/product/create";
import { getProductForBanner } from "@/server/db/product/get";
import { geolocation } from "@vercel/functions";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";
import { createElement } from "react";

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  const { productId } = await params;

  const headersMap = await headers();
  const requestingUrl = headersMap.get("referer") || headersMap.get("origin");
  if (!requestingUrl) notFound();

  const { country: countryCode } = geolocation(request);
  if (!countryCode) return notFound();

  const { product, country, discount } = await getProductForBanner(
    productId,
    countryCode,
    requestingUrl,
  );

  if (!product || !country || !discount) return notFound();

  const showBanner = await canShowBanner(product.clerkId);

  await createProductView(product.clerkId, {
    productId: product.id,
    countryId: country?.id,
  });

  if (!showBanner) return notFound();

  return new Response(
    await getBannerJS({
      canRemoveBranding: await canRemoveBranding(product.clerkId),
      product,
      country,
      discount: {
        coupon: discount.coupon,
        discount: discount.discount,
      },
    }),
    { headers: { "content-type": "text/javascript" } },
  );
}

async function getBannerJS({
  product,
  country,
  discount,
  canRemoveBranding,
}: ProductBannerResponseSchema) {
  const { renderToStaticMarkup } = await import("react-dom/server");

  if (discount.coupon === null || discount.discount === null) return notFound();

  return `
    const banner = document.createElement("div");
    banner.innerHTML = \`${renderToStaticMarkup(
      createElement(Banner, {
        message: product.customization.bannerMessage,
        mappings: {
          country: country.name,
          coupon: discount.coupon,
          discount: discount.discount,
        },
        customizations: product.customization,
        canRemoveBranding,
      }),
    )}\`;
    document.querySelector(\`${product.customization.bannerContainer}\`).prepend(...banner.children);
  `.replace(/(\r\n|\n|\r)/g, "");
}
