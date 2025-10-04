import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

import Script from "next/script";
import Providers from "./providers";
import { SessionProvider } from "./admin/SessionProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project awards",
  description: "Plateforme de soumission de projets à forte valeur ajoutée",
  icons: {
    icon: [
      { media: "(prefers-color-scheme: dark)", url: "/LOGO.svg" },
      { media: "(prefers-color-scheme: light)", url: "/LOGO.svg" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable}`}>
      <body className="font-outfit ">
        <Providers>
          <SessionProvider>
            <main className=" ">{children}</main>
          </SessionProvider>
          <Toaster richColors position="top-right" />
        </Providers>
        <Script
          src="https://cdn.fedapay.com/checkout.js?v=1.1.7"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
