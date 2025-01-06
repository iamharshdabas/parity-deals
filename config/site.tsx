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

export const siteNavLinks: { label: string; href: string }[] = [
  {
    label: "Home",
    href: siteHref.home(),
  },
  {
    label: "Dashboard",
    href: siteHref.dashboard(),
  },
];
