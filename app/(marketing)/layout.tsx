import "@/app/globals.css";
import ThemeProvider from "@/components/theme/provider";
import { siteData } from "@/config/site";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ReactNode } from "react";
import Navbar from "./_components/navbar";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: siteData.title,
  description: siteData.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="container mx-auto px-4">
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
