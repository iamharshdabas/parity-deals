import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import ThemeToggle from "../theme/toggle";

type Props = {
  backButtonHref: string;
  layoutButton?: ReactNode;
  children: ReactNode;
};

export default function BackButton({
  backButtonHref,
  layoutButton,
  children,
}: Props) {
  return (
    <>
      <div className="flex py-4 gap-4 justify-between items-center">
        <Button asChild size="icon" variant="outline">
          <Link href={backButtonHref}>
            <ChevronLeft />
          </Link>
        </Button>
        <div className="flex items-center justify-between gap-4">
          {layoutButton}
          <ThemeToggle />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      {children}
    </>
  );
}
