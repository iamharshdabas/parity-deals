import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  fullScreen?: boolean;
};

export default function Section({ children, fullScreen = true }: Props) {
  return (
    <section
      className={cn(
        "flex flex-col justify-center py-16 items-center gap-8",
        fullScreen && "min-h-screen",
      )}
    >
      {children}
    </section>
  );
}
