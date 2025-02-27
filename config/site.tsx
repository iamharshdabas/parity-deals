import { Earth } from "lucide-react";

export const siteData = {
  icon: <Earth />,
  title: "Parity Deals",
  // TODO: Add description
  description: "",
};

export type EditProductTabHref = keyof typeof editProductTabHref;

export const editProductTabHref = {
  details: "details",
  country: "country",
  customizations: "customizations",
};

export const siteHref = {
  home: () => "/",
  dashboard: () => "/dashboard",
  analytics: () => `${siteHref.dashboard()}/analytics`,
  subscription: () => `${siteHref.dashboard()}/subscription`,
  product: () => `${siteHref.dashboard()}/product`,
  newProduct: () => `${siteHref.product()}/new`,
  productEdit: (id: string) => `${siteHref.product()}/${id}/edit`,
  // TODO: searchParams. I wasn't able to find any way to set default tab in searchParams
  // productEdit: (id: string, tab?: EditProductTabHref) => {
  //   const url = `${siteHref.product()}/${id}/edit`;
  //   if (tab) return `${url}?tab=${tab}`;
  //   return url;
  // },
};

export function createURL(
  href: string,
  oldParams: Record<string, string>,
  newParams: Record<string, string | undefined>,
) {
  const params = new URLSearchParams(oldParams);
  Object.entries(newParams).forEach(([key, value]) => {
    if (value == undefined) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  return `${href}?${params.toString()}`;
}

export type SiteNavLinks = { label: string; href: string }[];

export const siteNavLinksWithHome: SiteNavLinks = [
  {
    label: "Home",
    href: siteHref.home(),
  },
  {
    label: "Dashboard",
    href: siteHref.dashboard(),
  },
  {
    label: "Analytics",
    href: siteHref.analytics(),
  },
  {
    label: "Subscription",
    href: siteHref.subscription(),
  },
];

export const siteNavLinks = siteNavLinksWithHome.filter(
  (link) => link.href !== siteHref.home(),
);
