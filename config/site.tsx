import { Earth } from "lucide-react";

export const siteData = {
  icon: <Earth />,
  title: "Parity Deals",
  // TODO: Add description
  description: "",
};

export const siteHref = {
  root: {
    page: "/",
  },
};

const marketing: { label: string; href: string }[] = [
  {
    label: "Home",
    href: siteHref.root.page,
  },
];

export const siteNavLinks = { marketing };
