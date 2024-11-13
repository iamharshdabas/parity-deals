import { Earth } from "lucide-react";

export const siteData = {
  icon: <Earth />,
  title: "Parity Deals",
  // TODO: Add description
  description: "",
};

export const siteHref = {
  home: () => "/",
  dashboard: () => "/dashboard",
  product: () => `${siteHref.dashboard()}/product`,
  productEdit: (id: string) => `${siteHref.product()}/${id}/edit`,
  newProduct: () => `${siteHref.product()}/new`,
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
