import type { Metadata, Viewport } from "next";
import { Geist, Lilita_One } from "next/font/google";
import { DEFAULT_LOCALE, getDictionary } from "@/i18n/dictionaries";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Letra de juego para títulos y botones grandes.
const display = Lilita_One({
  variable: "--font-display-face",
  weight: "400",
  subsets: ["latin"],
});

const t = getDictionary(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
};

export const viewport: Viewport = {
  themeColor: "#0b1f3a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={DEFAULT_LOCALE} className={`${geistSans.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
