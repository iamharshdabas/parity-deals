import SignInButton from "@/components/auth/sign-in";
import ThemeToggle from "@/components/theme/toggle";
import { Button } from "@/components/ui/button";
import { siteData, siteNavLinks } from "@/config/site";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="p-1 sm:p-4 container fixed w-full">
      <div className="flex bg-background/80 backdrop-blur-lg p-2 sm:p-4 rounded-2xl shadow-2xl border border-border justify-between items-center">
        <div className="flex gap-2 items-center">
          {siteData.icon}
          <span className="hidden sm:block">{siteData.title}</span>
        </div>
        <nav className="flex gap-2 items-center">
          {siteNavLinks.map((link) => (
            <Button key={link.href} variant="link" asChild>
              <Link className="px-4" href={link.href}>
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="flex gap-2 items-center">
          <ThemeToggle />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
