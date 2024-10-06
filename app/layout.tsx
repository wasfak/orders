import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orders App",
  description: "Orders App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <ClerkProvider>
        <body className={`${inter.className} bg-[#1d1e22]`}>
          <Header />
          {children}
          <Toaster position="top-center" />
        </body>
      </ClerkProvider>
    </html>
  );
}
