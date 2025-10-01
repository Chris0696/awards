"use client";
import Footer from "@/app/(landing)/components/Footer";
import Header from "@/app/(landing)/components/Header";
import { SessionProvider } from "../admin/SessionProvider";

export default function LandingLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="w-full overflow-x-hidden">
      <Header />
      {children}
      <Footer />
      {modal}
    </main>
  );
}
