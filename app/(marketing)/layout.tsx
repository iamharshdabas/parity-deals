import Navbar from "@/components/layout/navbar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar className="fixed" />
      <div className="container mx-auto px-4">
        <main>{children}</main>
      </div>
    </>
  );
}
