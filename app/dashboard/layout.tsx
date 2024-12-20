import Navbar from "@/components/layout/navbar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4">{children}</main>
    </>
  );
}
