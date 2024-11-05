import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Section({ children, className }: Props) {
  return (
    <section
      className={cn(
        "flex min-h-screen flex-col justify-center py-16 items-center gap-8",
        className,
      )}
    >
      {children}
    </section>
  );
}
