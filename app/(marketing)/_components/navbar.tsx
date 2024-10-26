import ThemeToggle from "@/components/theme/toggle";
import { siteData, siteNavLinks } from "@/config/site";
import { EarthIcon } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <EarthIcon /> {siteData.title}
      </div>
      <nav className="flex gap-2 items-center">
        {siteNavLinks.marketing.map((link) => (
          <Link key={link.href} className="px-4" href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex gap-2 items-center">
        <ThemeToggle />
      </div>
    </header>
  );
}
