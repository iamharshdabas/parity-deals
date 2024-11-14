import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "../ui/button";

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
    <div className="space-y-4">
      <div className="flex gap-4 justify-between items-center">
        <Button asChild size="icon" variant="outline">
          <Link href={backButtonHref}>
            <ChevronLeft />
          </Link>
        </Button>
        {layoutButton}
      </div>
      {children}
    </div>
  );
}
