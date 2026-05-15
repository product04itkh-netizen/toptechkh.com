import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Top Tech Computer | Electronics & Tech Store",
  description:
    "Top Tech Computer — Phnom Penh's leading electronics store. Shop the latest smartphones, laptops, cameras, headphones, and more at the best prices.",
  keywords:
    "electronics, Cambodia, Phnom Penh, smartphones, laptops, cameras, headphones, watches, Top Tech Computer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-white text-[#021523] antialiased`}>
        {children}
      </body>
    </html>
  );
}
