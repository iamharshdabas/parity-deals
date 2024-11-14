import Navbar from "@/components/layout/navbar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <main>{children}</main>
      </div>
    </>
  );
}
